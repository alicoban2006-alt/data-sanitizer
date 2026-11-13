import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'DataPurge — 100% Client-Side JSON Repair, Log Redactor & Data Converter';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #09090b 0%, #0f172a 55%, #06283d 100%)',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #06b6d4, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800,
              color: '#09090b',
            }}
          >
            DP
          </div>
          <span style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            DataPurge
          </span>
          <span
            style={{
              marginLeft: '12px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.16)',
              border: '1px solid rgba(16, 185, 129, 0.45)',
              color: '#34d399',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            100% Client-Side • Zero Telemetry
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '960px' }}>
          <div
            style={{
              fontSize: '60px',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
            }}
          >
            Repair Broken JSON, Strip Invisible Chars & Redact Secrets.
          </div>
          <div style={{ fontSize: '26px', color: '#94a3b8', lineHeight: 1.4 }}>
            Instant browser-based developer utility for LLM JSON, Python dicts, ANSI logs, and JSON/YAML/XML/CSV conversion.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '20px', color: '#38bdf8' }}>
          <span>✓ Fix LLM JSON</span>
          <span>•</span>
          <span>✓ Redact API Keys</span>
          <span>•</span>
          <span>✓ JSON / YAML / XML / CSV</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
