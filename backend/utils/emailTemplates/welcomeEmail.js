export const welcomeEmail = (name) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Welcome to MineKart</title>

  <style>

    * {
      box-sizing:border-box;
    }

    body {
      margin:0;
      padding:0;
      background:#f2eee9;
      font-family:Arial,Helvetica,sans-serif;
      color:#292725;
    }

    table {
      border-spacing:0;
    }

    @media only screen and (max-width:620px) {

      .email-wrapper {
        padding:10px 5px !important;
      }

      .email-container {
        width:100% !important;
        max-width:100% !important;
        border-radius:12px !important;
      }

      .email-header {
        padding:24px 15px !important;
      }

      .email-logo {
        font-size:28px !important;
      }

      .email-content {
        padding:24px 15px !important;
      }

      .email-title {
        font-size:23px !important;
        line-height:1.3 !important;
      }

      .email-text {
        font-size:14px !important;
        line-height:1.65 !important;
      }

      .welcome-box {
        padding:16px !important;
      }

      .welcome-icon {
        width:40px !important;
        height:40px !important;
        line-height:40px !important;
        font-size:21px !important;
      }

      .welcome-heading {
        font-size:14px !important;
      }

      .welcome-subtitle {
        font-size:11px !important;
      }

      .benefit-box {
        padding:14px !important;
      }

      .benefit-title {
        font-size:13px !important;
      }

      .benefit-text {
        font-size:11px !important;
      }

      .button {
        display:block !important;
        width:100% !important;
        padding:14px 15px !important;
      }

      .security-box {
        padding:14px !important;
      }

      .email-footer {
        padding:20px 15px !important;
      }

    }

  </style>

</head>


<body>

  <div
    class="email-wrapper"
    style="padding:35px 10px;background:#f2eee9;"
  >

    <div
      class="email-container"
      style="width:100%;max-width:700px;margin:0 auto;background:#ffffff;border:1px solid #e2dbd3;border-radius:18px;overflow:hidden;"
    >


      <!-- ================================= -->
      <!-- HEADER -->
      <!-- ================================= -->

      <div
        class="email-header"
        style="padding:30px 25px;text-align:center;background:#6b6258;"
      >

        <div
          class="email-logo"
          style="font-size:32px;font-weight:800;letter-spacing:-.5px;color:#ffffff;"
        >
          MineKart
        </div>

        <div
          style="margin-top:7px;font-size:13px;color:#eeeae4;line-height:1.5;"
        >
          Your trusted shopping destination
        </div>

      </div>


      <!-- ================================= -->
      <!-- CONTENT -->
      <!-- ================================= -->

      <div
        class="email-content"
        style="padding:34px;"
      >


        <!-- ================================= -->
        <!-- TITLE -->
        <!-- ================================= -->

        <h1
          class="email-title"
          style="margin:0 0 14px;font-size:28px;line-height:1.3;color:#3f3a35;font-weight:800;"
        >
          Welcome to MineKart! 👋
        </h1>


        <!-- GREETING -->

        <p
          class="email-text"
          style="margin:0 0 8px;font-size:16px;line-height:1.6;color:#5f5a55;"
        >
          Hi ${name || 'Customer'},
        </p>


        <p
          class="email-text"
          style="margin:0;font-size:14px;line-height:1.7;color:#756c65;"
        >
          Thank you for creating your MineKart account.
          We're excited to have you with us and look forward to
          making your shopping experience simple and enjoyable.
        </p>


        <!-- ================================= -->
        <!-- ACCOUNT READY -->
        <!-- ================================= -->

        <div
          class="welcome-box"
          style="margin-top:24px;padding:18px;background:#eef7f1;border:1px solid #cfe5d6;border-radius:14px;"
        >

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="width:100%;"
          >

            <tr>

              <!-- ICON -->

              <td
                style="width:48px;vertical-align:middle;"
              >

                <div
                  class="welcome-icon"
                  style="width:40px;height:40px;line-height:40px;text-align:center;border-radius:50%;background:#3e8b62;color:#ffffff;font-size:21px;font-weight:800;"
                >
                  ✓
                </div>

              </td>


              <!-- TEXT -->

              <td
                style="vertical-align:middle;"
              >

                <div
                  class="welcome-heading"
                  style="font-size:15px;font-weight:800;color:#3e8b62;"
                >
                  Your account is ready
                </div>

                <div
                  class="welcome-subtitle"
                  style="margin-top:4px;font-size:12px;line-height:1.5;color:#5f6f63;"
                >
                  You can start shopping on MineKart now.
                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- ================================= -->
        <!-- SHOPPING BENEFITS -->
        <!-- ================================= -->

        <div
          style="margin-top:27px;"
        >

          <h2
            style="margin:0 0 13px;font-size:18px;font-weight:800;color:#3f3a35;"
          >
            Everything is ready for you
          </h2>


          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="width:100%;table-layout:fixed;"
          >

            <tr>

              <!-- PRODUCT -->

              <td
                class="benefit-box"
                style="width:33.33%;vertical-align:top;padding:14px 10px;background:#fbfaf7;border:1px solid #e5ded6;"
              >

                <div
                  style="font-size:21px;"
                >
                  🛍️
                </div>

                <div
                  class="benefit-title"
                  style="margin-top:8px;font-size:13px;font-weight:800;color:#3f3a35;"
                >
                  Explore
                </div>

                <div
                  class="benefit-text"
                  style="margin-top:4px;font-size:11px;line-height:1.5;color:#7a716a;"
                >
                  Discover products you'll love.
                </div>

              </td>


              <!-- CART -->

              <td
                class="benefit-box"
                style="width:33.33%;vertical-align:top;padding:14px 10px;background:#fff8f6;border-top:1px solid #ead8d4;border-bottom:1px solid #ead8d4;"
              >

                <div
                  style="font-size:21px;"
                >
                  🛒
                </div>

                <div
                  class="benefit-title"
                  style="margin-top:8px;font-size:13px;font-weight:800;color:#3f3a35;"
                >
                  Add to Cart
                </div>

                <div
                  class="benefit-text"
                  style="margin-top:4px;font-size:11px;line-height:1.5;color:#7a716a;"
                >
                  Save your favorites for later.
                </div>

              </td>


              <!-- DEALS -->

              <td
                class="benefit-box"
                style="width:33.33%;vertical-align:top;padding:14px 10px;background:#fbfaf7;border:1px solid #e5ded6;"
              >

                <div
                  style="font-size:21px;"
                >
                  ✨
                </div>

                <div
                  class="benefit-title"
                  style="margin-top:8px;font-size:13px;font-weight:800;color:#3f3a35;"
                >
                  Great Deals
                </div>

                <div
                  class="benefit-text"
                  style="margin-top:4px;font-size:11px;line-height:1.5;color:#7a716a;"
                >
                  Enjoy a simple shopping experience.
                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- ================================= -->
        <!-- CTA -->
        <!-- ================================= -->

        <div
          style="margin-top:28px;text-align:center;"
        >

          <a
            href="http://localhost:5173"
            class="button"
            style="display:inline-block;padding:14px 32px;background:#a51d26;color:#ffffff !important;text-decoration:none;border-radius:9px;font-size:14px;font-weight:800;line-height:1.2;"
          >
            Start Shopping&nbsp; →
          </a>

        </div>


        <!-- ================================= -->
        <!-- SHOPPING MESSAGE -->
        <!-- ================================= -->

        <div
          style="margin-top:25px;padding:16px;background:#fff6f5;border-left:4px solid #a51d26;border-radius:9px;"
        >

          <div
            style="font-size:13px;font-weight:800;color:#8e181f;"
          >
            Your MineKart journey starts here ✨
          </div>

          <div
            style="margin-top:5px;font-size:12px;line-height:1.65;color:#6b6258;"
          >
            Explore our collection, find products that match your needs,
            and enjoy a smooth shopping experience from browsing to checkout.
          </div>

        </div>


        <!-- ================================= -->
        <!-- SECURITY NOTICE -->
        <!-- ================================= -->

        <div
          class="security-box"
          style="margin-top:18px;padding:16px;background:#f7f4ef;border:1px solid #e5ded6;border-radius:10px;"
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
                style="width:36px;vertical-align:top;"
              >

                <div
                  style="width:28px;height:28px;line-height:28px;text-align:center;border-radius:50%;background:#e9e4dc;color:#6b6258;font-size:13px;font-weight:800;"
                >
                  🔒
                </div>

              </td>

              <td
                style="vertical-align:top;"
              >

                <div
                  style="font-size:12px;font-weight:800;color:#4f4944;"
                >
                  Didn't create this account?
                </div>

                <div
                  style="margin-top:4px;font-size:11px;line-height:1.6;color:#7b726b;"
                >
                  You can safely ignore this email or contact
                  MineKart support if you believe this account was
                  created without your permission.
                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- ================================= -->
        <!-- CLOSING -->
        <!-- ================================= -->

        <p
          class="email-text"
          style="margin:25px 0 0;font-size:13px;line-height:1.6;color:#756c65;"
        >
          We're happy to have you as part of the MineKart family.
        </p>


        <p
          class="email-text"
          style="margin:9px 0 0;font-size:13px;color:#756c65;"
        >
          Happy Shopping! 🛍️
        </p>


      </div>


      <!-- ================================= -->
      <!-- FOOTER -->
      <!-- ================================= -->

      <div
        class="email-footer"
        style="padding:24px 25px;text-align:center;background:#f7f4ef;border-top:1px solid #e3ded6;"
      >

        <p
          style="margin:0;font-size:12px;line-height:1.5;color:#938980;"
        >
          This is an automated email.
          Please do not reply directly.
        </p>

        <p
          style="margin:8px 0 0;font-size:13px;font-weight:800;color:#6b6258;"
        >
          © ${new Date().getFullYear()} MineKart
        </p>

      </div>


    </div>

  </div>

</body>
</html>
`
}
