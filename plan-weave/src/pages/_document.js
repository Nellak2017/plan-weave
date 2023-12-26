import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/Plan-Weave-Logo-Square.png" width='20px' height='27px' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
          <link href='https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' rel='stylesheet' />
          <link href="https://fonts.googleapis.com/css2?family=Courier+Prime&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:wght@500&display=swap" rel="stylesheet"></link>
          <meta httpEquiv="content-language" content="en" />
          <meta charSet="UTF-8" />
          <meta name="keywords" content="task management, productivity, organization, time management" />
          <meta name="author" content="Your Name" />
          <meta name="publisher" content="Your Name" />
          <meta name="copyright" content="Your Name" />
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