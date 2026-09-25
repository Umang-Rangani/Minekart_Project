export const welcomeEmail = (name) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Welcome to MineKart</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      background-color: #f4f2ee;
      font-family: Arial, Helvetica, sans-serif;
      color: #292725;
    }

    .email-wrapper {
      width: 100%;
      padding: 40px 15px;
      background-color: #f4f2ee;
    }

    .email-container {
      max-width: 620px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e3ded6;
      border-radius: 16px;
      overflow: hidden;
    }

    .header {
      background-color: #6b6258;
      padding: 28px 30px;
      text-align: center;
    }

    .logo {
      color: #ffffff;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .tagline {
      color: #eeeae4;
      font-size: 14px;
    }

    .content {
      padding: 40px 35px;
    }

    .welcome-title {
      font-size: 28px;
      line-height: 1.3;
      color: #3f3a35;
      margin-bottom: 18px;
    }

    .text {
      font-size: 16px;
      line-height: 1.7;
      color: #5f5a55;
      margin-bottom: 18px;
    }

    .highlight-box {
      margin: 28px 0;
      padding: 20px;
      background-color: #f8f6f2;
      border: 1px solid #e3ded6;
      border-radius: 12px;
    }

    .highlight-title {
      font-size: 17px;
      font-weight: 700;
      color: #3f3a35;
      margin-bottom: 8px;
    }

    .highlight-text {
      font-size: 14px;
      line-height: 1.6;
      color: #6b6258;
    }

    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }

    .button {
      display: inline-block;
      padding: 14px 30px;
      background-color: #6b6258;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
    }

    .footer {
      padding: 24px 30px;
      background-color: #fbfaf7;
      border-top: 1px solid #e3ded6;
      text-align: center;
    }

    .footer-text {
      font-size: 13px;
      line-height: 1.6;
      color: #8a847d;
    }

    .footer-brand {
      margin-top: 8px;
      color: #6b6258;
      font-size: 14px;
      font-weight: 700;
    }

    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px;
      }

      .content {
        padding: 30px 22px;
      }

      .header {
        padding: 24px 20px;
      }

      .welcome-title {
        font-size: 24px;
      }

      .text {
        font-size: 15px;
      }
    }
  </style>
</head>

<body>
  <div class="email-wrapper">
    <div class="email-container">

      <div class="header">
        <div class="logo">
          MineKart
        </div>

        <div class="tagline">
          Your trusted shopping destination
        </div>
      </div>

      <div class="content">

        <h1 class="welcome-title">
          Welcome to MineKart! 👋
        </h1>

        <p class="text">
          Thank you for creating your account with us.
          We're excited to have you as a part of the MineKart family.
        </p>

        <p class="text">
          Your account has been successfully created.
          You can now explore products, discover great deals,
          add your favorite items to your cart, and enjoy a simple
          shopping experience.
        </p>

        <div class="highlight-box">

          <div class="highlight-title">
            Your account is ready 🎉
          </div>

          <div class="highlight-text">
            Start exploring MineKart and find something you love.
            We're happy to have you shopping with us.
          </div>

        </div>

        <div class="button-wrapper">

          <a
            href="http://localhost:5173"
            class="button"
          >
            Start Shopping
          </a>

        </div>

        <p class="text">
          If you did not create this account, you can safely ignore
          this email or contact our support team.
        </p>

        <p class="text">
          Happy Shopping! 🛍️
        </p>

      </div>

      <div class="footer">

        <div class="footer-text">
          This is an automated email. Please do not reply directly
          to this message.
        </div>

        <div class="footer-brand">
          © ${new Date().getFullYear()} MineKart
        </div>

      </div>

    </div>
  </div>
</body>
</html>
`
}
