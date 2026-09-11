import './globals.css';
import PromoBar from './components/PromoBar';
import Analytics from './components/Analytics';

export const metadata = {
  title: 'Oskelo — Video & Photo for Businesses, Individuals & Events',
  description:
    'Oskelo creates video and photography for businesses, individuals, and events — editing your footage or coming on-site to shoot it.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PromoBar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
