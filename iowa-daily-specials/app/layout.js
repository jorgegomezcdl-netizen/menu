import { Playfair_Display, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '600'],
  display: 'swap',
});

export const metadata = {
  title: 'Iowa Daily Specials — Happy Hour & Food Deals',
  description:
    'Find today\'s best food specials and happy hour deals at bars and restaurants across Iowa — Des Moines, Cedar Rapids, Iowa City, Waterloo, Cedar Falls, Ames, and Dubuque.',
  keywords: 'Iowa happy hour, food specials Iowa, Des Moines deals, Cedar Rapids specials',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
