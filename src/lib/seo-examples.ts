export interface SeoTechnicalExample {
  errorMessage: string;
  beforeCode: string;
  afterCode: string;
}

export const SEO_TECHNICAL_EXAMPLES: Record<string, SeoTechnicalExample> = {
  'fix-python-dict-to-json': {
    errorMessage:
      'JSONDecodeError: Expecting property name enclosed in double quotes / SyntaxError: Unexpected token \'',
    beforeCode: `{'user_id': 42, 'active': True, 'deleted_at': None, 'roles': ['admin', 'editor',]}`,
    afterCode: `{
  "user_id": 42,
  "active": true,
  "deleted_at": null,
  "roles": ["admin", "editor"]
}`,
  },
  'remove-zero-width-characters': {
    errorMessage:
      'SyntaxError: Unexpected token "\\u200B" (ZWSP) or U+FEFF BOM in JSON at position 0',
    beforeCode: `{"api_url":\u200B "https://api.\u200Cexample.com/\uFEFFv1/users"}`,
    afterCode: `{
  "api_url": "https://api.example.com/v1/users"
}`,
  },
  'fix-llm-broken-json': {
    errorMessage:
      'SyntaxError: Unexpected token ` in JSON at position 0 (Markdown code fences / trailing commas)',
    beforeCode: `\`\`\`json
{
  "summary": "Quarterly report",
  "status": "ready",
}
\`\`\``,
    afterCode: `{
  "summary": "Quarterly report",
  "status": "ready"
}`,
  },
  'json-unescape-online': {
    errorMessage:
      'Unexpected stringified JSON payload with escaped quotes (\\") and escaped newlines (\\n)',
    beforeCode: `"{\\"event\\":\\"payment_succeeded\\",\\"amount\\":4900,\\"currency\\":\\"USD\\"}"`,
    afterCode: `{
  "event": "payment_succeeded",
  "amount": 4900,
  "currency": "USD"
}`,
  },
  'remove-comments-from-json': {
    errorMessage:
      'SyntaxError: Unexpected token / in JSON (JSONC // or /* */ comments not supported by JSON.parse)',
    beforeCode: `{
  // Production database port
  "port": 5432,
  /* Enable SSL in prod */
  "ssl": true
}`,
    afterCode: `{
  "port": 5432,
  "ssl": true
}`,
  },
  'yaml-to-json-client-side': {
    errorMessage:
      'Converting Kubernetes / Docker Compose / GitHub Actions YAML to structured JSON without server upload',
    beforeCode: `service:
  name: auth-gateway
  replicas: 3
  tls: true`,
    afterCode: `{
  "service": {
    "name": "auth-gateway",
    "replicas": 3,
    "tls": true
  }
}`,
  },
  'csv-to-json-privacy': {
    errorMessage:
      'Converting sensitive financial, HR, or customer CSV exports into typed JSON records locally',
    beforeCode: `id,email,plan,active
101,alice@acme.io,pro,true
102,bob@acme.io,team,false`,
    afterCode: `[
  { "id": 101, "email": "alice@acme.io", "plan": "pro", "active": true },
  { "id": 102, "email": "bob@acme.io", "plan": "team", "active": false }
]`,
  },
  'fix-trailing-commas-json': {
    errorMessage:
      'SyntaxError: Expected double-quoted property name or Unexpected token } in JSON',
    beforeCode: `{
  "features": ["sanitize", "convert",],
  "strict": true,
}`,
    afterCode: `{
  "features": ["sanitize", "convert"],
  "strict": true
}`,
  },
  'redact-api-keys-from-logs': {
    errorMessage:
      'Preventing accidental leakage of sk-proj-, ghp_, Bearer JWTs, emails, and internal IPs in logs',
    beforeCode: `[INFO] user=alice@corp.com ip=10.0.4.18
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.payload.sig
OPENAI_API_KEY=sk-proj-abc123xyz987`,
    afterCode: `[INFO] user=[REDACTED_EMAIL] ip=[REDACTED_IP]
Authorization: Bearer [REDACTED_JWT]
OPENAI_API_KEY=[REDACTED_OPENAI_KEY]`,
  },
  'clean-ansi-terminal-logs': {
    errorMessage:
      'Removing raw ANSI SGR color sequences ([31m, [32m, [1m, [39m) from CI/CD and Docker logs',
    beforeCode: `\\u001b[32m✓\\u001b[39m Tests passed in \\u001b[1m2.14s\\u001b[22m
\\u001b[31mERR!\\u001b[39m Timeout on port 8080`,
    afterCode: `✓ Tests passed in 2.14s
ERR! Timeout on port 8080`,
  },
  'json-to-yaml-client-side': {
    errorMessage:
      'Transforming nested JSON API schemas and configs into 2-space indented YAML locally',
    beforeCode: `{"kind":"Deployment","metadata":{"name":"web"},"spec":{"replicas":2}}`,
    afterCode: `kind: Deployment
metadata:
  name: web
spec:
  replicas: 2`,
  },
  'xml-to-json-privacy': {
    errorMessage:
      'Parsing confidential SOAP / invoice XML trees into clean JSON without external uploads',
    beforeCode: `<invoice id="INV-42"><customer>Acme</customer><total>199.00</total></invoice>`,
    afterCode: `{
  "invoice": {
    "@attributes": { "id": "INV-42" },
    "customer": "Acme",
    "total": 199
  }
}`,
  },
};
