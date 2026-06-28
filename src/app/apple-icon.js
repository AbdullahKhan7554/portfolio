import { ImageResponse } from 'next/og';

/** Apple touch icon (180×180 PNG). iOS applies its own rounded mask. */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0B',
          backgroundImage:
            'radial-gradient(circle at 50% 28%, rgba(227,168,87,0.40), transparent 62%)',
          color: '#E3A857',
          fontSize: 104,
          fontWeight: 700,
          fontFamily: 'sans-serif',
        }}
      >
        A
      </div>
    ),
    size,
  );
}
