// src/app/icon.tsx
import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Generate dynamic icon using Next.js og/ImageResponse
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: '#171544', // indigo-950
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff', // white text
          borderRadius: '6px',
          fontWeight: 'bold',
          fontFamily: 'sans-serif',
        }}
      >
        P
      </div>
    ),
    {
      ...size,
    }
  );
}
