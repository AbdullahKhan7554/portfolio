import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const alt = siteConfig.seo.ogImage.alt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          backgroundColor: '#0A0A0B',
          backgroundImage:
            'radial-gradient(circle at 70% 0%, rgba(227,168,87,0.22), transparent 55%)',
          color: '#F6F3EE',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '999px',
              border: '1px solid #34323B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E3A857',
              fontSize: '24px',
              fontWeight: 600,
            }}
          >
            AS
          </div>
          <div
            style={{
              fontSize: '24px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#97949F',
            }}
          >
            {siteConfig.brand.name}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              fontSize: '76px',
              lineHeight: 1.05,
              fontWeight: 600,
              maxWidth: '960px',
            }}
          >
            <span>Web engineering that turns visitors into&nbsp;</span>
            <span style={{ color: '#E3A857' }}>customers.</span>
          </div>
          <div style={{ fontSize: '30px', color: '#97949F', maxWidth: '860px' }}>
            {`Premium Full-Stack MERN & Next.js development by ${siteConfig.brand.founder}.`}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '24px',
            fontSize: '22px',
            color: '#6E6B78',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span>Next.js</span>
          <span style={{ color: '#E3A857' }}>·</span>
          <span>Performance</span>
          <span style={{ color: '#E3A857' }}>·</span>
          <span>Conversion</span>
        </div>
      </div>
    ),
    size,
  );
}
