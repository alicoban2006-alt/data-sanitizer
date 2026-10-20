export interface SampleData {
  id: string;
  label: string;
  description: string;
  icon: string;
  data: string;
}

export const SAMPLES: SampleData[] = [
  {
    id: 'broken-json',
    label: 'Broken & Malformed JSON',
    description: 'Unquoted keys, single quotes, trailing commas, and Python literals (True/False/None)',
    icon: 'FileJson',
    data: `{
  // User analytics record from legacy API
  user_id: 10492,
  'username': 'alex_dev',
  fullName: “Alex Morgan”,
  isActive: True,
  isVerified: False,
  permissions: ['admin', 'billing', 'deploy',],
  metadata: {
    theme: 'dark',
    session_timeout: None,
  },
}`,
  },
  {
    id: 'hidden-unicode',
    label: 'Hidden Zero-Width & Smart Quotes',
    description: 'Notion/Slack copy-paste containing invisible zero-width spaces (\u200B) and curly quotes',
    icon: 'EyeOff',
    data: `// Notice: invisible characters like \\u200B, \\uFEFF break compilers!
const config = {
  “appName”: “DataSanitizer”,​
  “apiKey”: “sk_live_99482718291827491029”,​​
  “endpoint”: “https://api.cleaner.dev/v1”​
};`,
  },
  {
    id: 'escaped-string',
    label: 'Escaped DB / Log String',
    description: 'Double-escaped JSON string from MySQL/Postgres text columns or AWS CloudWatch',
    icon: 'Code2',
    data: `"{\\"status\\":\\"success\\",\\"records\\":[{\\"id\\":1,\\"name\\":\\"Item A\\",\\"details\\":\\"Line 1\\\\nLine 2\\"},{\\"id\\":2,\\"name\\":\\"Item B\\"}]}"`,
  },
  {
    id: 'ansi-terminal',
    label: 'Docker / Jest Terminal Log',
    description: 'Raw terminal log with ANSI color escape codes and mixed line endings',
    icon: 'Terminal',
    data: `\u001b[32m PASS \u001b[39m tests/auth.spec.ts\r
  \u001b[32m✓\u001b[39m should authenticate user with valid credentials (32 ms)\r
  \u001b[32m✓\u001b[39m should reject invalid JWT bearer token (18 ms)\r
\r
\u001b[33m[WARN]\u001b[39m Database connection pool reached 85% capacity.\r
\u001b[1m\u001b[36mTest Suites:\u001b[39m\u001b[22m 1 passed, 1 total\r
\u001b[1m\u001b[36mSnapshots:\u001b[39m\u001b[22m   0 total\r
`,
  },
];
