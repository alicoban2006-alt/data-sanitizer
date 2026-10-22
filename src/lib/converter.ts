import YAML from 'yaml';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export type SupportedFormat = 'json' | 'yaml' | 'xml' | 'csv';

export interface ConversionResult {
  output: string;
  success: boolean;
  error?: string;
  inputFormat: SupportedFormat;
  outputFormat: SupportedFormat;
}

/**
 * Parses CSV string into an array of objects
 */
export function csvToJson(csv: string): Record<string, unknown>[] {
  const lines = csv.trim().split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length === 0) return [];

  // Simple CSV delimiter detector (comma or semicolon or tab)
  const firstLine = lines[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  let delimiter = ',';
  if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';
  if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';

  // Helper to parse line accounting for quotes
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows: Record<string, unknown>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const obj: Record<string, unknown> = {};
    headers.forEach((h, index) => {
      let val: unknown = values[index] ?? '';
      // Type inference for numbers and booleans
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (val !== '' && !isNaN(Number(val))) val = Number(val);
      obj[h] = val;
    });
    rows.push(obj);
  }

  return rows;
}

/**
 * Converts any JS value/array into a formatted CSV string
 */
export function jsonToCsv(data: unknown): string {
  let array: Record<string, unknown>[] = [];

  if (Array.isArray(data)) {
    array = data.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return item as Record<string, unknown>;
      }
      return { value: item };
    });
  } else if (typeof data === 'object' && data !== null) {
    // If it's an object with array property, pick that array
    const keys = Object.keys(data);
    const arrayKey = keys.find((k) => Array.isArray((data as Record<string, unknown>)[k]));
    if (arrayKey) {
      array = (data as Record<string, unknown>)[arrayKey] as Record<string, unknown>[];
    } else {
      // Flatten key-value pairs into rows
      return (
        'key,value\n' +
        Object.entries(data)
          .map(([k, v]) => `"${k}","${String(v).replace(/"/g, '""')}"`)
          .join('\n')
      );
    }
  } else {
    return String(data);
  }

  if (array.length === 0) return '';

  // Extract all distinct keys from all rows
  const allHeaders = Array.from(
    new Set(array.flatMap((row) => (row && typeof row === 'object' ? Object.keys(row) : [])))
  );

  const escapeCsv = (val: unknown) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
    const str = String(val);
    if (str.includes(',') || str.includes(';') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = allHeaders.map((h) => escapeCsv(h)).join(',');
  const rowLines = array.map((row) =>
    allHeaders.map((h) => escapeCsv(row ? row[h] : '')).join(',')
  );

  return [headerLine, ...rowLines].join('\n');
}

/**
 * Parses raw text into an intermediate JS Object based on source format
 */
export function parseToJs(input: string, format: SupportedFormat): unknown {
  const trimmed = input.trim();
  if (!trimmed) return null;

  switch (format) {
    case 'json':
      return JSON.parse(trimmed);

    case 'yaml':
      return YAML.parse(trimmed);

    case 'xml': {
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        textNodeName: '#text',
        parseTagValue: true,
      });
      return parser.parse(trimmed);
    }

    case 'csv':
      return csvToJson(trimmed);

    default:
      throw new Error(`Bilinmeyen format: ${format}`);
  }
}

/**
 * Converts an intermediate JS Object to the target format string
 */
export function serializeFromJs(data: unknown, format: SupportedFormat): string {
  if (data === null || data === undefined) return '';

  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);

    case 'yaml':
      return YAML.stringify(data, { indent: 2 });

    case 'xml': {
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        textNodeName: '#text',
        format: true,
        indentBy: '  ',
      });
      // XML requires a single root element if not already present
      if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        const keys = Object.keys(data);
        if (keys.length === 1) {
          return `<?xml version="1.0" encoding="UTF-8"?>\n${builder.build(data)}`;
        }
      }
      return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${builder.build(data)}\n</root>`;
    }

    case 'csv':
      return jsonToCsv(data);

    default:
      throw new Error(`Bilinmeyen format: ${format}`);
  }
}

/**
 * Detect format automatically from text
 */
export function detectFormat(text: string): SupportedFormat {
  const trimmed = text.trim();
  if (!trimmed) return 'json';

  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    return 'xml';
  }
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    return 'json';
  }
  // Check CSV: contains comma/semicolon and multiple lines
  const lines = trimmed.split('\n');
  if (lines.length > 1 && (lines[0].includes(',') || lines[0].includes(';')) && !trimmed.includes(': ')) {
    return 'csv';
  }
  // Check YAML: key: value format
  if (lines.some((l) => /^[a-zA-Z0-9_-]+\s*:\s*.+/.test(l))) {
    return 'yaml';
  }

  return 'json';
}

/**
 * Main Format Converter
 */
export function convertFormat(
  input: string,
  fromFormat: SupportedFormat | 'auto',
  toFormat: SupportedFormat
): ConversionResult {
  if (!input || input.trim() === '') {
    return {
      output: '',
      success: true,
      inputFormat: fromFormat === 'auto' ? 'json' : fromFormat,
      outputFormat: toFormat,
    };
  }

  const effectiveFrom = fromFormat === 'auto' ? detectFormat(input) : fromFormat;

  try {
    const jsObj = parseToJs(input, effectiveFrom);
    const converted = serializeFromJs(jsObj, toFormat);
    return {
      output: converted,
      success: true,
      inputFormat: effectiveFrom,
      outputFormat: toFormat,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      output: '',
      success: false,
      error: `Dönüştürme Hatası (${effectiveFrom.toUpperCase()} → ${toFormat.toUpperCase()}): ${message}`,
      inputFormat: effectiveFrom,
      outputFormat: toFormat,
    };
  }
}
