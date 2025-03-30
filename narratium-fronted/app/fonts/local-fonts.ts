import localFont from 'next/font/local';
export const notoSansSC = localFont({
  src: [
    {
      path: '../../public/fonts/noto-sans-sc/NotoSansSC-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/noto-sans-sc/NotoSansSC-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/noto-sans-sc/NotoSansSC-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});

export const notoSerifSC = localFont({
  src: [
    {
      path: '../../public/fonts/noto-serif-sc/NotoSerifSC-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/noto-serif-sc/NotoSerifSC-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-noto-serif-sc',
  display: 'swap',
});

// Inter 字体本地化
export const inter = localFont({
  src: [
    {
      path: '../../public/fonts/inter/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const playfair = localFont({
  src: [
    {
      path: '../../public/fonts/playfair/PlayfairDisplay-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/playfair/PlayfairDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
});

// Raleway 字体本地化
export const raleway = localFont({
  src: [
    {
      path: '../../public/fonts/raleway/Raleway-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/raleway/Raleway-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/raleway/Raleway-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-raleway',
  display: 'swap',
});
