import type { Metadata } from 'next';
import './globals.css';
import { ListingFilterProvider } from '@/context/ListingFilterContext';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Hostiggo - Find Your Perfect Stay',
  description: 'Discover unique homestays and stays across India',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ListingFilterProvider>
          <Toaster position="top-center" richColors closeButton />
          {children}
        </ListingFilterProvider>
      </body>
    </html>
  );
}
