import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
  * Root HTML layout for web rendering.
  * Ensures body and root container backgrounds match dark/light theme to eliminate white borders.
  */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
html, body, #root {
  background-color: #0F172A;
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
@media (prefers-color-scheme: light) {
  html, body, #root {
    background-color: #F0F8FF;
  }
}
`;
