import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClientProvider } from '@/components/providers/ClientProvider';
import '@/styles/_reset.scss';
import './globals.scss';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Reviewer Finder',
  description:
    'Найдите лучших рецензентов для вашего проекта. Платформа для поиска и взаимодействия с экспертами.',
  keywords: ['рецензент', 'код', 'review', 'эксперт'],
  creator: 'Mauzek',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://reviewer-finder.vercel.app',
    siteName: 'Reviewer Finder',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
