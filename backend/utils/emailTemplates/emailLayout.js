const emailLayout = ({ preheader = '', eyebrow = '', title, children, footerNote = 'Thank you for shopping with MineKart.' }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title || 'MineKart'}</title>

  <style>
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background: #F7EEE7;
      font-family: Arial, Helvetica, sans-serif;
      color: #351C18;
    }

    table {
      border-spacing: 0;
      border-collapse: collapse;
    }

    img {
      border: 0;
      display: block;
      max-width: 100%;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .email-wrapper {
      width: 100%;
      background: #F7EEE7;
      padding: 28px 12px;
    }

    .email-container {
      width: 100%;
      max-width: 620px;
      margin: 0 auto;
    }

    .email-card {
      width: 100%;
      background: #FFFCFA;
      border: 1px solid #E8DDD4;
      border-radius: 18px;
      overflow: hidden;
    }

    .header {
      background: #351C18;
      padding: 18px 22px;
    }

    .logo {
      width: 42px;
      height: 42px;
      border-radius: 11px;
      background: #F6E9E0;
    }

    .brand {
      color: #FFFFFF;
      font-size: 21px;
      line-height: 24px;
      font-weight: 800;
      letter-spacing: -0.4px;
    }

    .brand-red {
      color: #E17B7F;
    }

    .tagline {
      margin-top: 4px;
      color: #D4C4BD;
      font-size: 8px;
      line-height: 11px;
      font-weight: 700;
      letter-spacing: 1.4px;
    }

    .content {
      padding: 26px 24px 28px;
    }

    .eyebrow {
      margin: 0 0 7px;
      color: #8E181F;
      font-size: 9px;
      line-height: 13px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .title {
      margin: 0;
      color: #351C18;
      font-size: 24px;
      line-height: 30px;
      font-weight: 800;
      letter-spacing: -0.4px;
    }

    .footer {
      background: #351C18;
      color: #D4C4BD;
    }

    .footer-trust {
      background: #2C1714;
      border-top: 1px solid rgba(255,255,255,0.08);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 12px 18px;
      text-align: center;
    }

    .footer-trust-text {
      margin: 0;
      color: #BFAEA6;
      font-size: 10px;
      line-height: 16px;
    }

    .footer-main {
      padding: 17px 18px 19px;
      text-align: center;
    }

    .footer-brand {
      color: #FFFFFF;
      font-size: 17px;
      line-height: 21px;
      font-weight: 800;
    }

    .footer-note {
      margin: 5px 0 0;
      color: #BFAEA6;
      font-size: 10px;
      line-height: 15px;
    }

    .footer-copy {
      margin: 11px 0 0;
      color: #8F817B;
      font-size: 9px;
      line-height: 14px;
    }

      .section-title {
        margin: 29px 0 7px;
        font-size: 18px;
        line-height: 1.35;
        font-weight: 900;
        color: #35231f;
      }


     .section-subtitle {
        margin: 0 0 15px;
        font-size: 11px;
        line-height: 1.6;
        color: #92827a;
      }


  .benefit-column {
        width: 33.33%;
        vertical-align: top;
      }


            .benefit-card {
        min-height: 92px;
        padding: 14px;
        background: #fbf8f4;
        border: 1px solid #e8ddd4;
        border-radius: 14px;
      }

      .benefit-card-center {
        background: #fff8f6;
        border-color: #eedbd7;
      }

      .benefit-icon-cell {
        width: 43px;
        vertical-align: top;
        padding-right: 10px;
      }

      .benefit-icon {
        width: 38px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        border-radius: 11px;
        background: #f2e2dc;
        color: #9d2932;
        font-size: 18px;
        font-weight: 700;
      }

      .benefit-content {
        vertical-align: top;
      }

      .benefit-title {
        font-size: 12px;
        line-height: 1.35;
        font-weight: 900;
        color: #35231f;
      }

      .benefit-text {
        margin-top: 4px;
        font-size: 9px;
        line-height: 1.55;
        color: #806c63;
      }

@media only screen and (max-width: 620px) {
   .section-title {
          margin: 23px 0 6px !important;
          font-size: 16px !important;
        }



        .section-subtitle {
          margin-bottom: 10px !important;
          font-size: 9px !important;
        }


    .benefit-column {
          display: block !important;
          width: 100% !important;
          padding: 0 !important;
        }


        
        .benefit-card {
          width: 100% !important;
          min-height: 0 !important;
          margin: 0 0 8px !important;
          padding: 12px !important;
          border-radius: 11px !important;
        }

        .benefit-icon-cell {
          width: 44px !important;
          padding-right: 10px !important;
        }

        .benefit-icon {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          border-radius: 10px !important;
          font-size: 17px !important;
        }

        .benefit-title {
          font-size: 12px !important;
        }

        .benefit-text {
          margin-top: 3px !important;
          font-size: 9px !important;
          line-height: 1.5 !important;
        }

}

@media only screen and (max-width: 380px) {
  .section-title {
          font-size: 15px !important;
        }


          .benefit-card {
          padding: 10px !important;
        }
}

    @media only screen and (max-width: 480px) {
      .email-wrapper {
        padding: 12px 7px !important;
      }

      .email-card {
        border-radius: 14px !important;
      }

      .header {
        padding: 16px 15px !important;
      }

      .logo {
        width: 38px !important;
        height: 38px !important;
      }

      .brand {
        font-size: 19px !important;
        line-height: 22px !important;
      }

      .tagline {
        font-size: 7px !important;
        letter-spacing: 1.1px !important;
      }

      .content {
        padding: 22px 15px 24px !important;
      }

      .title {
        font-size: 21px !important;
        line-height: 27px !important;
      }

      .footer-main {
        padding: 15px 12px 17px !important;
      }
    }
  </style>
</head>

<body>

  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${preheader}
  </div>

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
  >
    <tr>
      <td align="center">

        <div class="email-wrapper">

          <table
            role="presentation"
            class="email-container"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
          >
            <tr>
              <td>

                <table
                  role="presentation"
                  class="email-card"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >

                  <!-- Header -->
                  <tr>
                    <td class="header">

                      <table
                        role="presentation"
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                      >
                        <tr>

                          <td width="46" valign="middle">

                            <a
                              href="https://minekart.vercel.app/"
                              target="_blank"
                              style="display:block;text-decoration:none;"
                            >
                              <img
                                src="https://minekart.vercel.app/cart_image.jpg"
                                width="42"
                                height="42"
                                class="logo"
                                style="width:42px;height:42px;border-radius:11px;object-fit:contain;"
                              >
                            </a>

                          </td>

                          <td
                            valign="middle"
                            style="padding-left:10px;"
                          >

                            <div class="brand">
                              <a
                                href="https://minekart.vercel.app/"
                                target="_blank"
                                style="color:#FFFFFF;text-decoration:none;"
                              >
                                Mine<span class="brand-red">Kart</span>
                              </a>
                            </div>

                            <div class="tagline">
                              SHOP MORE • LIVE BETTER
                            </div>

                          </td>

                        </tr>
                      </table>

                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td class="content">

                      ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}

                      ${title ? `<h1 class="title">${title}</h1>` : ''}

                      <div style="margin-top:18px;">
                        ${children}
                      </div>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td class="footer">

                      <div class="footer-trust">
                        <p class="footer-trust-text">
                          Genuine Products&nbsp; • &nbsp;Secure Shopping&nbsp; • &nbsp;Easy Returns
                        </p>
                      </div>

                      <div class="footer-main">

                        <div class="footer-brand">
                          <a
                            href="https://minekart.vercel.app/"
                            target="_blank"
                            style="color:#FFFFFF;text-decoration:none;"
                          >
                            Mine<span style="color:#E17B7F;">Kart</span>
                          </a>
                        </div>

                        <p class="footer-note">
                          ${footerNote}
                        </p>

                        <p class="footer-copy">
                          © 2026 MineKart. All rights reserved.
                        </p>

                      </div>

                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </div>

      </td>
    </tr>
  </table>

</body>
</html>
  `
}

module.exports = { emailLayout }
