const invoicePdfTemplate = require('./emailTemplates/invoicePdfTemplate').invoicePdfTemplate

const isVercel = process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)

const generateInvoicePdf = async (order, customerName = 'Customer') => {
  let browser

  try {
    let puppeteer

    if (isVercel) {
      const chromium = require('@sparticuz/chromium')
      puppeteer = require('puppeteer-core')

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
      })
    } else {
      puppeteer = require('puppeteer')

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

    return Buffer.from(pdf)
  } catch (error) {
    console.error('Invoice PDF generation failed:', error.message)
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
