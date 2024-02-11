import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from "styled-components"

class MyDocument extends Document {
  // Used to eliminate a FOUC, where FOUC is a Flash of Unstyled Content, caused by styled components
  // https://nimblecode.dev/blog/fixing-fouc-nextjs-styled-components/
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

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
          <link rel="icon" href="/Plan-Weave-Logo-Square.png" width='20px' height='27px' />
          <meta httpEquiv="content-language" content="en" />
          <meta charSet="UTF-8" />
          <meta name="keywords" content="task management, productivity, organization, time management" />
          <meta name="author" content="Connor Keenum" />
          <meta name="description" content="Plan Weave: Your Ultimate Task Management Solution. Organize, prioritize, and conquer your daily tasks with ease." />
          <meta name="page-topic" content="Productivity" />
          <meta name="page-type" content="Task Management" />
          <meta name="audience" content="Everyone" />
          <meta name="robots" content="index, follow" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument