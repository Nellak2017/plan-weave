import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from "styled-components"

class MyDocument extends Document {
  // Used to eliminate a FOUC, where FOUC is a Flash of Unstyled Content, caused by styled components. https://nimblecode.dev/blog/fixing-fouc-nextjs-styled-components/
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet(), originalRenderPage = ctx.renderPage
    try {
      ctx.renderPage = () => originalRenderPage({ enhanceApp: App => props => sheet.collectStyles(<App {...props} />), })
      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      }
    } finally {
      sheet.seal()
    }
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          {/*icon*/}
          <link rel="icon" href="/Plan-Weave-Logo-Square.png" width='20px' height='27px' />
          {/*Facebook meta tags*/}
          <meta property="og:url" content="/" /> <meta property="og:image" content="/Plan-Weave-Logo-Square.png" /> <meta property="og:title" content="Plan Weave" /> <meta property="og:type" content="website" /> <meta property="og:locale" content="en_US" /> <meta property="og:description" content="Plan Weave: Your Ultimate Task Management Solution. Organize, prioritize, and conquer your daily tasks with ease." />
          {/*Twitter meta tags*/}
          <meta property="twitter:image" content="/Plan-Weave-Logo-Square.png" /> <meta property="twitter:card" content="summary_large_image" /> <meta property="twitter:title" content="Plan Weave" /> <meta property="twitter:description" content="Plan Weave: Your Ultimate Task Management Solution. Organize, prioritize, and conquer your daily tasks with ease."></meta>
          {/*Html meta tags*/}
          <meta httpEquiv="content-language" content="en" /><meta charSet="UTF-8" />
          {/*SEO meta tags*/}
          <meta name="keywords" content="task management, productivity, organization, time management" /> <meta name="author" content="Connor Keenum" /> <meta name="description" content="Plan Weave: Your Ultimate Task Management Solution. Organize, prioritize, and conquer your daily tasks with ease." /> <meta name="page-topic" content="Productivity" /> <meta name="page-type" content="Task Management" /> <meta name="audience" content="Everyone" /> <meta name="robots" content="index, follow" />
        </Head>
        <body><Main /><NextScript /></body>
      </Html>
    )
  }
}
export default MyDocument