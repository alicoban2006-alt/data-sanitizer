export interface SanitizerOptions {
  // JSON options
  repairJson: boolean;
  indentSize: 2 | 4 | 'minify';
  
  // Invisible character cleanup
  stripInvisibleChars: boolean;
  normalizeSpaces: boolean; // convert NBSP \u00A0 to standard space
  
  // Encoding & Quotes
  normalizeQuotes: boolean; // smart quotes “ ” to " and ‘ ’ to '
  unescapeStrings: boolean; // \", \\n, \t, etc.
  stripAnsi: boolean; // remove terminal color codes
  
  // Whitespace
  trimWhitespace: boolean;
  collapseNewlines: boolean;
  
  // Developer extras
  removeComments: boolean;
  maskSensitiveData: boolean; // Mask potential API keys, emails, JWTs
}

export const DEFAULT_OPTIONS: SanitizerOptions = {
  repairJson: true,
  indentSize: 2,
  stripInvisibleChars: true,
  normalizeSpaces: true,
  normalizeQuotes: true,
  unescapeStrings: false,
  stripAnsi: true,
  trimWhitespace: true,
  collapseNewlines: true,
  removeComments: true,
  maskSensitiveData: false,
};

export interface SanitizationResult {
  output: string;
  isJson: boolean;
  jsonValid: boolean;
  inputCharCount: number;
  outputCharCount: number;
  inputByteCount: number;
  outputByteCount: number;
  stats: {
    invisibleCharsRemoved: number;
    ansiCodesRemoved: number;
    quotesNormalized: number;
    commentsRemoved: number;
    jsonRepaired: boolean;
    maskedCount: number;
  };
  warnings: string[];
}

/**
 * Strips ANSI terminal escape codes (e.g. from Docker, CI/CD, npm test outputs)
 */
export function removeAnsiCodes(text: string): { text: string; count: number } {
  // Matches standard ANSI 7-bit and 8-bit escape codes
  // eslint-disable-next-line no-control-regex
  const ansiRegex = /[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/g;
  let count = 0;
  const replaced = text.replace(ansiRegex, () => {
    count++;
    return '';
  });
  return { text: replaced, count };
}

/**
 * Removes hidden Unicode, Zero-Width characters, BOM, and dangerous control chars
 */
export function removeInvisibleCharacters(text: string): { text: string; count: number } {
  // \u200B: Zero-width space
  // \u200C: Zero-width non-joiner
  // \u200D: Zero-width joiner
  // \u2060: Word joiner
  // \uFEFF: Zero-width no-break space (BOM)
  // \u00AD: Soft hyphen
  // \u200E, \u200F: LTR / RTL marks
  // \u202A - \u202E: Directional embedding / override
  // \x00-\x08, \x0B, \x0C, \x0E-\x1F: Non-printable control characters
  // eslint-disable-next-line no-control-regex
  const invisibleRegex = /[\u200B\u200C\u200D\u2060\uFEFF\u00AD\u200E\u200F\u202A-\u202E\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
  let count = 0;
  const replaced = text.replace(invisibleRegex, () => {
    count++;
    return '';
  });
  return { text: replaced, count };
}

/**
 * Converts smart / curly quotes to standard ASCII quotes
 */
export function normalizeSmartQuotes(text: string): { text: string; count: number } {
  let count = 0;
  // Double quotes
  const dblQuotes = /[\u201C\u201D\u201E\u00AB\u00BB\u201F]/g;
  // Single quotes / apostrophes
  const sglQuotes = /[\u2018\u2019\u201A\u201B\u2039\u203A\u0060\u00B4]/g;

  let res = text.replace(dblQuotes, () => {
    count++;
    return '"';
  });
  res = res.replace(sglQuotes, () => {
    count++;
    return "'";
  });

  return { text: res, count };
}

/**
 * Unescapes commonly escaped strings (e.g. from database logs, JSON stringified values)
 */
export function unescapeStringContent(text: string): string {
  // If the entire text is a quoted string e.g. "{\"name\":\"John\"}"
  let candidate = text.trim();
  if (
    (candidate.startsWith('"') && candidate.endsWith('"')) ||
    (candidate.startsWith("'") && candidate.endsWith("'"))
  ) {
    // Attempt JSON parse first if it unwraps to a valid inner string
    try {
      const parsed = JSON.parse(candidate);
      if (typeof parsed === 'string') {
        candidate = parsed;
      }
    } catch {
      // Fallback manual unescape
      candidate = candidate.slice(1, -1);
    }
  }

  return candidate
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\//g, '/');
}

/**
 * Strips JS/JSON comments (// and /* ... *\/)
 */
export function stripComments(text: string): { text: string; count: number } {
  let count = 0;
  // Keep strings intact while removing comments
  // Matches strings OR single-line / multi-line comments
  const commentOrStringRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)/g;

  const result = text.replace(commentOrStringRegex, (match, stringGroup, commentGroup) => {
    if (commentGroup) {
      count++;
      return '';
    }
    return stringGroup || match;
  });

  return { text: result, count };
}

/**
 * Attempt to repair common malformed JSON errors:
 * - Single quotes instead of double quotes for keys and strings
 * - Unquoted object keys { foo: "bar" } -> { "foo": "bar" }
 * - Trailing commas in arrays and objects
 * - Python literals (True, False, None) -> (true, false, null)
 * - Leading/trailing unwanted characters
 */
export function repairJsonString(input: string): { repaired: string; changed: boolean } {
  let text = input.trim();
  const original = text;

  // If input looks like stringified JSON that was wrapped in quotes, unwrap it
  if (
    (text.startsWith('"{') && text.endsWith('}"')) ||
    (text.startsWith('"[') && text.endsWith(']"'))
  ) {
    try {
      const unquoted = JSON.parse(text);
      if (typeof unquoted === 'string') {
        text = unquoted.trim();
      }
    } catch {
      // ignore and continue regex repairs
    }
  }

  // 1. Replace Python boolean/null literals
  text = text.replace(/\bTrue\b/g, 'true');
  text = text.replace(/\bFalse\b/g, 'false');
  text = text.replace(/\bNone\b/g, 'null');

  // 2. Fix unquoted keys in objects: { key: "value", another_key-2: 123 }
  // Look for { or , followed by whitespace, then an identifier, then :
  text = text.replace(
    /([{,]\s*)([a-zA-Z0-9_$-]+)\s*:/g,
    '$1"$2":'
  );

  // 3. Fix single-quoted keys and values
  // Replace single-quoted keys: 'key': -> "key":
  text = text.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'\s*:/g, '"$1":');

  // Replace single-quoted string values: : 'value' -> : "value"
  text = text.replace(/:\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g, ': "$1"');

  // Replace single-quoted array elements: ['a', 'b'] -> ["a", "b"]
  text = text.replace(/\[\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g, '["$1"');
  text = text.replace(/,\s*'([^'\\]*(?:\\.[^'\\]*)*)'/g, ', "$1"');

  // 4. Remove trailing commas before } or ]
  text = text.replace(/,\s*([}\]])/g, '$1');

  // 5. Clean up duplicate commas like [1, , 2]
  text = text.replace(/,\s*,+/g, ',');

  return { repaired: text, changed: text !== original };
}

/**
 * Mask sensitive data like Bearer tokens, API keys, emails
 */
export function maskSensitive(text: string): { text: string; count: number } {
  let count = 0;
  // Mask JWT / Bearer tokens
  let res = text.replace(/(Bearer\s+)[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/gi, () => {
    count++;
    return 'Bearer [REDACTED_TOKEN]';
  });

  // Mask common API keys (e.g. sk_live_..., ghp_..., AIza...)
  res = res.replace(/\b(sk_[live|test]_[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36}|AIza[0-9A-Za-z-_]{35})\b/g, () => {
    count++;
    return '[REDACTED_API_KEY]';
  });

  // Mask emails
  res = res.replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, (email) => {
    count++;
    const [user, domain] = email.split('@');
    return `${user.slice(0, 2)}***@${domain}`;
  });

  return { text: res, count };
}

/**
 * Main Sanitizer Function
 */
export function sanitizeData(
  input: string,
  options: SanitizerOptions = DEFAULT_OPTIONS
): SanitizationResult {
  if (!input || input.trim() === '') {
    return {
      output: '',
      isJson: false,
      jsonValid: false,
      inputCharCount: 0,
      outputCharCount: 0,
      inputByteCount: 0,
      outputByteCount: 0,
      stats: {
        invisibleCharsRemoved: 0,
        ansiCodesRemoved: 0,
        quotesNormalized: 0,
        commentsRemoved: 0,
        jsonRepaired: false,
        maskedCount: 0,
      },
      warnings: [],
    };
  }

  const inputCharCount = input.length;
  const inputByteCount = new TextEncoder().encode(input).length;
  const warnings: string[] = [];
  const stats = {
    invisibleCharsRemoved: 0,
    ansiCodesRemoved: 0,
    quotesNormalized: 0,
    commentsRemoved: 0,
    jsonRepaired: false,
    maskedCount: 0,
  };

  let processed = input;

  // 1. Strip ANSI escape sequences
  if (options.stripAnsi) {
    const ansiRes = removeAnsiCodes(processed);
    processed = ansiRes.text;
    stats.ansiCodesRemoved = ansiRes.count;
  }

  // 2. Remove invisible & zero-width characters
  if (options.stripInvisibleChars) {
    const invRes = removeInvisibleCharacters(processed);
    processed = invRes.text;
    stats.invisibleCharsRemoved = invRes.count;
  }

  // 3. Normalize non-breaking spaces (\u00A0 to standard space)
  if (options.normalizeSpaces) {
    processed = processed.replace(/\u00A0/g, ' ');
  }

  // 4. Normalize smart quotes & apostrophes
  if (options.normalizeQuotes) {
    const quoteRes = normalizeSmartQuotes(processed);
    processed = quoteRes.text;
    stats.quotesNormalized = quoteRes.count;
  }

  // 5. Unescape strings if requested
  if (options.unescapeStrings) {
    processed = unescapeStringContent(processed);
  }

  // 6. Remove comments if requested
  if (options.removeComments) {
    const commentRes = stripComments(processed);
    processed = commentRes.text;
    stats.commentsRemoved = commentRes.count;
  }

  // 7. Mask sensitive data if enabled
  if (options.maskSensitiveData) {
    const maskRes = maskSensitive(processed);
    processed = maskRes.text;
    stats.maskedCount = maskRes.count;
  }

  // 8. Trim and normalize line endings
  processed = processed.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  if (options.trimWhitespace) {
    // Trim trailing whitespace on each line
    processed = processed
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');
  }

  if (options.collapseNewlines) {
    // Collapse 3+ newlines to max 2
    processed = processed.replace(/\n{3,}/g, '\n\n');
  }

  // 9. JSON Detection and Repair
  const trimmed = processed.trim();
  const looksLikeJson =
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'));

  let isJson = looksLikeJson;
  let jsonValid = false;

  // Try direct parse first
  try {
    const parsed = JSON.parse(trimmed);
    jsonValid = true;
    isJson = true;

    // Format if JSON
    const indent = options.indentSize === 'minify' ? 0 : options.indentSize;
    processed = options.indentSize === 'minify'
      ? JSON.stringify(parsed)
      : JSON.stringify(parsed, null, indent);
  } catch (err: unknown) {
    // Direct parse failed. If user enabled repairJson and it looks like JSON, try to repair
    if (options.repairJson && looksLikeJson) {
      const { repaired, changed } = repairJsonString(trimmed);
      try {
        const parsed = JSON.parse(repaired);
        jsonValid = true;
        stats.jsonRepaired = changed;
        const indent = options.indentSize === 'minify' ? 0 : options.indentSize;
        processed = options.indentSize === 'minify'
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, indent);
      } catch (repairErr: unknown) {
        // Repair also failed, leave processed as cleaned text with warning
        const errorMsg = repairErr instanceof Error ? repairErr.message : String(repairErr);
        warnings.push(`JSON Syntax Notice: ${errorMsg}`);
      }
    } else if (looksLikeJson) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      warnings.push(`JSON parsing error: ${errorMsg}`);
    }
  }

  if (options.trimWhitespace && !jsonValid) {
    processed = processed.trim();
  }

  const outputCharCount = processed.length;
  const outputByteCount = new TextEncoder().encode(processed).length;

  return {
    output: processed,
    isJson,
    jsonValid,
    inputCharCount,
    outputCharCount,
    inputByteCount,
    outputByteCount,
    stats,
    warnings,
  };
}
