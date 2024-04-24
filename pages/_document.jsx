import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Forum&family=Josefin+Sans:ital,wght@0,200;0,300;1,200;1,300&family=Koulen&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="text-color-accent-2 bg-accent-1">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
