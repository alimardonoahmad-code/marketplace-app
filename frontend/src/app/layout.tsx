import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import AppShell from '@/components/layout/AppShell';
import ThemeProvider from '@/components/ui/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Market — Маркетплейс',
  description: 'Маркетплейси онлайн — харид ва фурӯш мисли Ozon',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Market',
  },
};

export const viewport: Viewport = {
  themeColor: '#005BFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tg" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider />
        <AppShell>{children}</AppShell>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              background: '#111827',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
              padding: '12px 20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            },
            success: { iconTheme: { primary: '#005BFF', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
