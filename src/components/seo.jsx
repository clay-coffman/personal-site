import Head from 'next/head';

export default function SEO({ title, description, image }) {
  const defaultTitle = "Clay Coffman - Product Manager & Entrepreneur";
  const defaultDescription = "Product manager and entrepreneur based in Los Angeles. Previously co-founded Zego, led product at Cryptoslam, and now building TradeFoundry.";
  
  return (
    <Head>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content="Clay Coffman, Product Management, TradeFoundry, Los Angeles" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || HOME_OG_IMAGE_URL} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Clay_Coffman" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || HOME_OG_IMAGE_URL} />
    </Head>
  );
}
