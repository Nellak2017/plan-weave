import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
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