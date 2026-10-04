const welcomeEmail = (name) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <meta
    name="color-scheme"
    content="light"
  />

  <meta
    name="supported-color-schemes"
    content="light"
  />

  <title>Welcome to MineKart</title>

  <style>

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      background: #f6f1ec;
      font-family: Arial, Helvetica, sans-serif;
      color: #35231f;
    }

    body {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table {
      border-spacing: 0;
      border-collapse: collapse;
    }

    a {
      text-decoration: none;
    }

    .email-wrapper {
      width: 100%;
      padding: 28px 12px;
      background: #f6f1ec;
    }

    .email-container {
      width: 100%;
      max-width: 720px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e8ddd4;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 28px rgba(73, 54, 49, 0.06);
    }

    .email-header {
      padding: 22px 30px;
      background: #ffffff;
      border-bottom: 1px solid #eee5de;
    }

    .brand-logo {
      margin: 0;
      font-size: 24px;
      line-height: 1;
      font-weight: 900;
      letter-spacing: -0.7px;
      color: #35231f;
    }

    .brand-logo span {
      color: #9d2932;
    }

    .brand-tagline {
      margin-top: 6px;
      font-size: 10px;
      line-height: 1.5;
      color: #8a7770;
    }

    .header-badge {
      display: inline-block;
      padding: 7px 11px;
      border-radius: 20px;
      background: #fff5f3;
      border: 1px solid #eedbd7;
      color: #9d2932;
      font-size: 8px;
      line-height: 1;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .email-content {
      padding: 34px 34px 30px;
    }

    .eyebrow {
      margin: 0 0 8px;
      font-size: 9px;
      line-height: 1.4;
      font-weight: 800;
      letter-spacing: 1.1px;
      text-transform: uppercase;
      color: #9d2932;
    }

    .email-title {
      margin: 0;
      font-size: 29px;
      line-height: 1.22;
      font-weight: 900;
      letter-spacing: -0.7px;
      color: #35231f;
    }

    .greeting {
      margin: 17px 0 0;
      font-size: 15px;
      line-height: 1.55;
      color: #554640;
    }

    .intro-text {
      margin: 7px 0 0;
      font-size: 13px;
      line-height: 1.7;
      color: #7b6b64;
    }

    .account-box {
      margin-top: 24px;
      padding: 14px;
      background: #fff9f7;
      border: 1px solid #eedbd7;
      border-radius: 15px;
    }

    .account-icon-cell {
      width: 44px;
      vertical-align: top;
      padding-right: 10px;
    }

    .account-icon {
      width: 38px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      border-radius: 10px;
      background: #9d2932;
      color: #ffffff;
      font-size: 19px;
      font-weight: 900;
      font-family: Arial, Helvetica, sans-serif;
    }

    .account-content {
      vertical-align: top;
      padding: 0;
    }

    .account-title {
      font-size: 13px;
      line-height: 18px;
      font-weight: 900;
      color: #8e181f;
      padding: 0;
      margin: 0;
    }

    .account-text {
      margin-top: 2px;
      font-size: 11px;
      line-height: 17px;
      color: #806c63;
      padding: 0;
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

    .cta-wrapper {
      margin-top: 22px;
      padding: 20px 18px;
      text-align: center;
      background: #f9f5f0;
      border: 1px solid #e8ddd4;
      border-radius: 15px;
    }

    .cta-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.4;
      font-weight: 900;
      color: #35231f;
    }

    .cta-text {
      margin: 5px 0 14px;
      font-size: 10px;
      line-height: 1.6;
      color: #806c63;
    }

    .button {
      display: inline-block;
      padding: 12px 28px;
      background: #9d2932;
      border-radius: 9px;
      color: #ffffff !important;
      font-size: 12px;
      line-height: 1.2;
      font-weight: 900;
      box-shadow: 0 5px 14px rgba(157, 41, 50, 0.16);
    }

    .button-subtext {
      margin: 8px 0 0;
      font-size: 8px;
      line-height: 1.5;
      color: #a09289;
    }

    .journey-box {
      margin-top: 16px;
      padding: 15px 16px;
      background: #fff9f7;
      border: 1px solid #eedbd7;
      border-radius: 12px;
    }

    .journey-title {
      font-size: 12px;
      line-height: 1.4;
      font-weight: 900;
      color: #8e181f;
    }

    .journey-text {
      margin-top: 5px;
      font-size: 10px;
      line-height: 1.6;
      color: #71635c;
    }

    .security-box {
      margin-top: 12px;
      padding: 13px;
      background: #f8f5f1;
      border: 1px solid #e5ded6;
      border-radius: 11px;
    }

    .security-icon-cell {
      width: 36px;
      vertical-align: top;
      padding-right: 8px;
    }

    .security-icon {
      width: 27px;
      height: 27px;
      line-height: 27px;
      text-align: center;
      border-radius: 50%;
      background: #ece5dd;
      color: #806c63;
      font-size: 12px;
    }

    .security-title {
      font-size: 10px;
      line-height: 1.4;
      font-weight: 900;
      color: #554b46;
    }

    .security-text {
      margin-top: 3px;
      font-size: 9px;
      line-height: 1.55;
      color: #80756e;
    }

    .closing-text {
      margin: 19px 0 0;
      font-size: 11px;
      line-height: 1.6;
      color: #756a64;
    }

    .closing-small {
      margin: 5px 0 0;
      font-size: 11px;
      line-height: 1.5;
      color: #756a64;
    }

    .email-footer {
      padding: 20px 28px;
      text-align: center;
      background: #f7f3ee;
      border-top: 1px solid #e3ded6;
    }

    .footer-links {
      margin: 0;
      font-size: 9px;
      line-height: 1.7;
      color: #948880;
    }

    .footer-links a {
      color: #806c63;
      font-weight: 700;
    }

    .copyright {
      margin: 7px 0 0;
      font-size: 10px;
      line-height: 1.5;
      font-weight: 900;
      color: #6b6258;
    }

    .footer-brand {
      margin: 4px 0 0;
      font-size: 8px;
      line-height: 1.5;
      color: #a09289;
    }

    @media only screen and (max-width: 620px) {

      html,
      body {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }

      .email-wrapper {
        width: 100% !important;
        padding: 0 !important;
        background: #ffffff !important;
      }

      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        overflow: hidden !important;
      }

      .email-header {
        padding: 17px 14px !important;
      }

      .brand-logo {
        font-size: 21px !important;
      }

      .brand-tagline {
        margin-top: 5px !important;
        font-size: 9px !important;
      }

      .header-badge-cell {
        width: 105px !important;
      }

      .header-badge {
        padding: 6px 8px !important;
        font-size: 7px !important;
      }

      .email-content {
        padding: 23px 13px 23px !important;
      }

      .eyebrow {
        margin-bottom: 6px !important;
        font-size: 8px !important;
        letter-spacing: 0.8px !important;
      }

      .email-title {
        font-size: 23px !important;
        line-height: 1.3 !important;
      }

      .greeting {
        margin-top: 14px !important;
        font-size: 13px !important;
      }

      .intro-text {
        margin-top: 5px !important;
        font-size: 11px !important;
        line-height: 1.65 !important;
      }

      .account-box {
        margin-top: 18px !important;
        padding: 11px !important;
        border-radius: 12px !important;
      }

      .account-icon-cell {
        width: 41px !important;
        padding-right: 8px !important;
      }

      .account-icon {
        width: 34px !important;
        height: 34px !important;
        line-height: 34px !important;
        border-radius: 9px !important;
        font-size: 16px !important;
      }

      .account-title {
        font-size: 12px !important;
        line-height: 16px !important;
      }

      .account-text {
        margin-top: 1px !important;
        font-size: 9px !important;
        line-height: 14px !important;
      }

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

      .cta-wrapper {
        margin-top: 17px !important;
        padding: 16px 12px !important;
        border-radius: 11px !important;
      }

      .cta-title {
        font-size: 13px !important;
      }

      .cta-text {
        margin: 4px 0 11px !important;
        font-size: 9px !important;
      }

      .button {
        display: block !important;
        width: 100% !important;
        padding: 12px !important;
        border-radius: 8px !important;
        font-size: 12px !important;
      }

      .button-subtext {
        margin-top: 7px !important;
        font-size: 7px !important;
      }

      .journey-box {
        margin-top: 13px !important;
        padding: 12px !important;
        border-radius: 10px !important;
      }

      .journey-title {
        font-size: 10px !important;
      }

      .journey-text {
        font-size: 9px !important;
      }

      .security-box {
        margin-top: 9px !important;
        padding: 10px !important;
        border-radius: 9px !important;
      }

      .security-icon-cell {
        width: 33px !important;
        padding-right: 7px !important;
      }

      .security-icon {
        width: 24px !important;
        height: 24px !important;
        line-height: 24px !important;
        font-size: 11px !important;
      }

      .security-title {
        font-size: 10px !important;
      }

      .security-text {
        font-size: 8px !important;
      }

      .closing-text {
        margin-top: 16px !important;
        font-size: 10px !important;
      }

      .closing-small {
        font-size: 10px !important;
      }

      .email-footer {
        padding: 16px 11px !important;
      }

      .footer-links {
        font-size: 8px !important;
      }

      .copyright {
        font-size: 9px !important;
      }

      .footer-brand {
        font-size: 7px !important;
      }
    }

    @media only screen and (max-width: 380px) {

      .email-header {
        padding: 15px 11px !important;
      }

      .brand-logo {
        font-size: 19px !important;
      }

      .brand-tagline {
        font-size: 8px !important;
      }

      .header-badge-cell {
        width: 92px !important;
      }

      .header-badge {
        padding: 5px 6px !important;
        font-size: 6px !important;
      }

      .email-content {
        padding: 21px 11px 21px !important;
      }

      .email-title {
        font-size: 21px !important;
      }

      .greeting {
        font-size: 12px !important;
      }

      .intro-text {
        font-size: 10px !important;
      }

      .account-box {
        padding: 10px !important;
      }

      .account-icon-cell {
        width: 40px !important;
        padding-right: 7px !important;
      }

      .account-icon {
        width: 33px !important;
        height: 33px !important;
        line-height: 33px !important;
        border-radius: 9px !important;
        font-size: 15px !important;
      }

      .account-title {
        font-size: 11px !important;
        line-height: 15px !important;
      }

      .account-text {
        font-size: 8.5px !important;
        line-height: 13px !important;
      }

      .section-title {
        font-size: 15px !important;
      }

      .benefit-card {
        padding: 10px !important;
      }

      .cta-wrapper {
        padding: 14px 10px !important;
      }

      .journey-box {
        padding: 10px !important;
      }

      .security-box {
        padding: 9px !important;
      }

      .email-footer {
        padding: 14px 9px !important;
      }
    }

  </style>

</head>

<body>

  <div
    class="email-wrapper"
    style="width:100%;padding:28px 12px;background:#f6f1ec;"
  >

    <div
      class="email-container"
      style="width:100%;max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e8ddd4;border-radius:20px;overflow:hidden;"
    >

      <!-- HEADER -->

      <div
        class="email-header"
        style="padding:22px 30px;background:#ffffff;border-bottom:1px solid #eee5de;"
      >

        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          width="100%"
          style="width:100%;"
        >

          <tr>

            <td style="vertical-align:middle;">

              <div
                class="brand-logo"
                style="margin:0;font-size:24px;line-height:1;font-weight:900;letter-spacing:-.7px;color:#35231f;"
              >
                Mine<span style="color:#9d2932;">Kart</span>
              </div>

              <div
                class="brand-tagline"
                style="margin-top:6px;font-size:10px;line-height:1.5;color:#8a7770;"
              >
                Your trusted shopping destination
              </div>

            </td>

            <td
              class="header-badge-cell"
              style="width:145px;text-align:right;vertical-align:middle;"
            >

              <div
                class="header-badge"
                style="display:inline-block;padding:7px 11px;border-radius:20px;background:#fff5f3;border:1px solid #eedbd7;color:#9d2932;font-size:8px;line-height:1;font-weight:800;letter-spacing:.5px;"
              >
                ACCOUNT READY
              </div>

            </td>

          </tr>

        </table>

      </div>

      <!-- CONTENT -->

      <div
        class="email-content"
        style="padding:34px 34px 30px;"
      >

        <p
          class="eyebrow"
          style="margin:0 0 8px;font-size:9px;line-height:1.4;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;color:#9d2932;"
        >
          Welcome to MineKart
        </p>

        <h1
          class="email-title"
          style="margin:0;font-size:29px;line-height:1.22;font-weight:900;letter-spacing:-.7px;color:#35231f;"
        >
          Welcome to MineKart! 👋
        </h1>

        <p
          class="greeting"
          style="margin:17px 0 0;font-size:15px;line-height:1.55;color:#554640;"
        >
          Hi ${name || 'Customer'},
        </p>

        <p
          class="intro-text"
          style="margin:7px 0 0;font-size:13px;line-height:1.7;color:#7b6b64;"
        >
          Thank you for creating your MineKart account.
          Your account is ready, and you can now explore products,
          discover great deals and enjoy a smooth shopping experience.
        </p>

        <!-- ACCOUNT STATUS -->

        <div
          class="account-box"
          style="margin-top:24px;padding:14px;background:#fff9f7;border:1px solid #eedbd7;border-radius:15px;"
        >

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="width:100%;"
          >

            <tr>

              <td
                class="account-icon-cell"
                style="width:44px;vertical-align:top;padding-right:10px;"
              >

                <div
                  class="account-icon"
                  style="width:38px;height:38px;line-height:38px;text-align:center;border-radius:10px;background:#9d2932;color:#ffffff;font-size:19px;font-weight:900;font-family:Arial,Helvetica,sans-serif;"
                >
                  ✓
                </div>

              </td>

              <td
                class="account-content"
                style="vertical-align:top;padding:0;"
              >

                <div
                  class="account-title"
                  style="font-size:13px;line-height:18px;font-weight:900;color:#8e181f;padding:0;margin:0;"
                >
                  Your account is ready
                </div>

                <div
                  class="account-text"
                  style="margin-top:2px;font-size:11px;line-height:17px;color:#806c63;padding:0;"
                >
                  You can start shopping on MineKart right away.
                </div>

              </td>

            </tr>

          </table>

        </div>

        <!-- SHOPPING BENEFITS -->

        <h2
          class="section-title"
          style="margin:29px 0 7px;font-size:18px;line-height:1.35;font-weight:900;color:#35231f;"
        >
          Everything is ready for you
        </h2>

        <p
          class="section-subtitle"
          style="margin:0 0 15px;font-size:11px;line-height:1.6;color:#92827a;"
        >
          Start exploring, discover products and enjoy easy shopping.
        </p>

        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          width="100%"
          style="width:100%;"
        >

          <tr>

            <td
              class="benefit-column"
              style="width:33.33%;vertical-align:top;padding-right:4px;"
            >

              <div
                class="benefit-card"
                style="min-height:92px;padding:14px;background:#fbf8f4;border:1px solid #e8ddd4;border-radius:14px;"
              >

                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="width:100%;"
                >

                  <tr>

                    <td
                      class="benefit-icon-cell"
                      style="width:43px;vertical-align:top;padding-right:10px;"
                    >

                      <div
                        class="benefit-icon"
                        style="width:38px;height:38px;line-height:38px;text-align:center;border-radius:11px;background:#f2e2dc;color:#9d2932;font-size:18px;font-weight:700;"
                      >
                        🛍
                      </div>

                    </td>

                    <td
                      class="benefit-content"
                      style="vertical-align:top;"
                    >

                      <div
                        class="benefit-title"
                        style="font-size:12px;line-height:1.35;font-weight:900;color:#35231f;"
                      >
                        Explore
                      </div>

                      <div
                        class="benefit-text"
                        style="margin-top:4px;font-size:9px;line-height:1.55;color:#806c63;"
                      >
                        Discover products you'll love.
                      </div>

                    </td>

                  </tr>

                </table>

              </div>

            </td>

            <td
              class="benefit-column"
              style="width:33.33%;vertical-align:top;padding:0 4px;"
            >

              <div
                class="benefit-card benefit-card-center"
                style="min-height:92px;padding:14px;background:#fff8f6;border:1px solid #eedbd7;border-radius:14px;"
              >

                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="width:100%;"
                >

                  <tr>

                    <td
                      class="benefit-icon-cell"
                      style="width:43px;vertical-align:top;padding-right:10px;"
                    >

                      <div
                        class="benefit-icon"
                        style="width:38px;height:38px;line-height:38px;text-align:center;border-radius:11px;background:#f2e2dc;color:#9d2932;font-size:18px;font-weight:700;"
                      >
                        🛒
                      </div>

                    </td>

                    <td
                      class="benefit-content"
                      style="vertical-align:top;"
                    >

                      <div
                        class="benefit-title"
                        style="font-size:12px;line-height:1.35;font-weight:900;color:#35231f;"
                      >
                        Add to Cart
                      </div>

                      <div
                        class="benefit-text"
                        style="margin-top:4px;font-size:9px;line-height:1.55;color:#806c63;"
                      >
                        Save your favorite products for later.
                      </div>

                    </td>

                  </tr>

                </table>

              </div>

            </td>

            <td
              class="benefit-column"
              style="width:33.33%;vertical-align:top;padding-left:4px;"
            >

              <div
                class="benefit-card"
                style="min-height:92px;padding:14px;background:#fbf8f4;border:1px solid #e8ddd4;border-radius:14px;"
              >

                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="width:100%;"
                >

                  <tr>

                    <td
                      class="benefit-icon-cell"
                      style="width:43px;vertical-align:top;padding-right:10px;"
                    >

                      <div
                        class="benefit-icon"
                        style="width:38px;height:38px;line-height:38px;text-align:center;border-radius:11px;background:#f2e2dc;color:#9d2932;font-size:18px;font-weight:700;"
                      >
                        ✦
                      </div>

                    </td>

                    <td
                      class="benefit-content"
                      style="vertical-align:top;"
                    >

                      <div
                        class="benefit-title"
                        style="font-size:12px;line-height:1.35;font-weight:900;color:#35231f;"
                      >
                        Great Deals
                      </div>

                      <div
                        class="benefit-text"
                        style="margin-top:4px;font-size:9px;line-height:1.55;color:#806c63;"
                      >
                        Find offers and enjoy easy shopping.
                      </div>

                    </td>

                  </tr>

                </table>

              </div>

            </td>

          </tr>

        </table>

        <!-- CTA -->

        <div
          class="cta-wrapper"
          style="margin-top:22px;padding:20px 18px;text-align:center;background:#f9f5f0;border:1px solid #e8ddd4;border-radius:15px;"
        >

          <p
            class="cta-title"
            style="margin:0;font-size:15px;line-height:1.4;font-weight:900;color:#35231f;"
          >
            Ready to start shopping?
          </p>

          <p
            class="cta-text"
            style="margin:5px 0 14px;font-size:10px;line-height:1.6;color:#806c63;"
          >
            Explore MineKart and find something made for you.
          </p>

          <a
            href="https://minekart.vercel.app"
            class="button"
            style="display:inline-block;padding:12px 28px;background:#9d2932;border-radius:9px;color:#ffffff !important;font-size:12px;line-height:1.2;font-weight:900;"
          >
            Start Shopping&nbsp; →
          </a>

          <p
            class="button-subtext"
            style="margin:8px 0 0;font-size:8px;line-height:1.5;color:#a09289;"
          >
            minekart.vercel.app
          </p>

        </div>

        <!-- JOURNEY -->

        <div
          class="journey-box"
          style="margin-top:16px;padding:15px 16px;background:#fff9f7;border:1px solid #eedbd7;border-radius:12px;"
        >

          <div
            class="journey-title"
            style="font-size:12px;line-height:1.4;font-weight:900;color:#8e181f;"
          >
            Your MineKart journey starts here ✨
          </div>

          <div
            class="journey-text"
            style="margin-top:5px;font-size:10px;line-height:1.6;color:#71635c;"
          >
            Explore our collection, discover products that match your needs,
            add your favorites to cart and enjoy a smooth shopping experience
            from browsing to checkout.
          </div>

        </div>

        <!-- SECURITY -->

        <div
          class="security-box"
          style="margin-top:12px;padding:13px;background:#f8f5f1;border:1px solid #e5ded6;border-radius:11px;"
        >

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="width:100%;"
          >

            <tr>

              <td
                class="security-icon-cell"
                style="width:36px;vertical-align:top;padding-right:8px;"
              >

                <div
                  class="security-icon"
                  style="width:27px;height:27px;line-height:27px;text-align:center;border-radius:50%;background:#ece5dd;color:#806c63;font-size:12px;"
                >
                  🔒
                </div>

              </td>

              <td style="vertical-align:top;">

                <div
                  class="security-title"
                  style="font-size:10px;line-height:1.4;font-weight:900;color:#554b46;"
                >
                  Didn't create this account?
                </div>

                <div
                  class="security-text"
                  style="margin-top:3px;font-size:9px;line-height:1.55;color:#80756e;"
                >
                  You can safely ignore this email or contact
                  MineKart support if you believe this account was
                  created without your permission.
                </div>

              </td>

            </tr>

          </table>

        </div>

        <!-- CLOSING -->

        <p
          class="closing-text"
          style="margin:19px 0 0;font-size:11px;line-height:1.6;color:#756a64;"
        >
          We're happy to have you as part of the MineKart family.
        </p>

        <p
          class="closing-small"
          style="margin:5px 0 0;font-size:11px;line-height:1.5;color:#756a64;"
        >
          Happy Shopping! 🛍️
        </p>

      </div>

      <!-- FOOTER -->

      <div
        class="email-footer"
        style="padding:20px 28px;text-align:center;background:#f7f3ee;border-top:1px solid #e3ded6;"
      >

        <p
          class="footer-links"
          style="margin:0;font-size:9px;line-height:1.7;color:#948880;"
        >

          <a
            href="https://minekart.vercel.app"
            style="color:#806c63;font-weight:700;"
          >
            Visit MineKart
          </a>

          &nbsp;&nbsp;•&nbsp;&nbsp;

          <a
            href="https://minekart.vercel.app/terms"
            style="color:#806c63;font-weight:700;"
          >
            Terms
          </a>

          &nbsp;&nbsp;•&nbsp;&nbsp;

          <a
            href="https://minekart.vercel.app/privacy"
            style="color:#806c63;font-weight:700;"
          >
            Privacy
          </a>

        </p>

        <p
          class="copyright"
          style="margin:7px 0 0;font-size:10px;line-height:1.5;font-weight:900;color:#6b6258;"
        >
          © ${new Date().getFullYear()} MineKart
        </p>

        <p
          class="footer-brand"
          style="margin:4px 0 0;font-size:8px;line-height:1.5;color:#a09289;"
        >
          Your trusted shopping destination
        </p>

      </div>

    </div>

  </div>

</body>

</html>
`
}

module.exports = { welcomeEmail }
