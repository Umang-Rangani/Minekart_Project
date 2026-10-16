const invoicePdfTemplate = require('./emailTemplates/invoicePdfTemplate').invoicePdfTemplate

const isVercel = process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)
 
const generateInvoicePdf = async (order, customerName = 'Customer') => {
  let browser

  try {
    let puppeteer

    if (isVercel) {
      const chromiumModule = await import('@sparticuz/chromium')
      const puppeteerModule = await import('puppeteer-core')

      const chromium = chromiumModule.default || chromiumModule
      puppeteer = puppeteerModule.default || puppeteerModule

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
      })
    } else {
      const puppeteerModule = await import('puppeteer')

      puppeteer = puppeteerModule.default || puppeteerModule

      browser = await puppeteer.launch({
        headless: true,
      })
    }

    const page = await browser.newPage()

    page.setDefaultTimeout(15000)

    const html = invoicePdfTemplate(order, customerName)

    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 15000,
    })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
    })

    console.log('Invoice PDF generated successfully')

    return Buffer.from(pdf)
  } catch (error) {
    console.error('Invoice PDF generation failed:', error)
    throw error
  } finally {
    if (browser) {
      await browser.close().catch((error) => {
        console.error('Invoice browser close failed:', error.message)
      })
    }
  }
}

module.exports = { generateInvoicePdf }
