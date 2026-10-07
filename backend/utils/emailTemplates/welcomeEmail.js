const { emailLayout } = require('./emailLayout')

const welcomeEmail = (name) => {
  const productsUrl = 'https://minekart.vercel.app/products'
  const profileUrl = 'https://minekart.vercel.app/profile'

  const content = `


    <p
      style="
        margin:17px 0 0;
        font-size:15px;
        line-height:1.55;
        color:#554640;
      "
    >
      Hi ${name || 'Customer'},
    </p>

    <p
      style="
        margin:7px 0 0;
        font-size:13px;
        line-height:1.7;
        color:#7B6B64;
      "
    >
      Thank you for creating your MineKart account. Your account is ready,
      and you can now explore products, discover great deals and enjoy a
      smooth shopping experience.
    </p>

    <!-- ACCOUNT STATUS -->

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        margin-top:24px;
        background:#FFF9F7;
        border:1px solid #EEDBD7;
        border-radius:15px;
      "
    >
      <tr>
        <td
          width="44"
          valign="top"
          style="width:44px;padding:14px 10px 14px 14px;"
        >
          <div
            style="
              width:38px;
              height:38px;
              line-height:38px;
              text-align:center;
              border-radius:10px;
              background:#9D2932;
              color:#FFFFFF;
              font-size:19px;
              font-weight:900;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            ✓
          </div>
        </td>

        <td
          valign="top"
          style="padding:14px 14px 14px 0;"
        >
          <div
            style="
              font-size:13px;
              line-height:18px;
              font-weight:900;
              color:#8E181F;
            "
          >
            Your account is ready
          </div>

          <div
            style="
              margin-top:2px;
              font-size:11px;
              line-height:17px;
              color:#806C63;
            "
          >
            You can start shopping on MineKart right away.
          </div>
        </td>
      </tr>
    </table>

    
          <!-- SHOPPING BENEFITS -->

          <h2 class="section-title" style="margin: 29px 0 7px; font-size: 18px; line-height: 1.35; font-weight: 900; color: #35231f">Everything is ready for you</h2>

          <p class="section-subtitle" style="margin: 0 0 15px; font-size: 11px; line-height: 1.6; color: #92827a">Start exploring, discover products and enjoy easy shopping.</p>

          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%">
            <tr>
              <td class="benefit-column" style="width: 33.33%; vertical-align: top; padding-right: 4px">
                <div class="benefit-card" style="min-height: 92px; padding: 14px; background: #fbf8f4; border: 1px solid #e8ddd4; border-radius: 14px">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%">
                    <tr>
                      <td class="benefit-icon-cell" style="width: 43px; vertical-align: top; padding-right: 10px">
                        <div class="benefit-icon" style="width: 38px; height: 38px; line-height: 38px; text-align: center; border-radius: 11px; background: #f2e2dc; color: #9d2932; font-size: 18px; font-weight: 700">🛍</div>
                      </td>

                      <td class="benefit-content" style="vertical-align: top">
                        <div class="benefit-title" style="font-size: 12px; line-height: 1.35; font-weight: 900; color: #35231f">Explore</div>

                        <div class="benefit-text" style="margin-top: 4px; font-size: 9px; line-height: 1.55; color: #806c63">Discover products you'll love.</div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>

              <td class="benefit-column" style="width: 33.33%; vertical-align: top; padding: 0 4px">
                <div class="benefit-card benefit-card-center" style="min-height: 92px; padding: 14px; background: #fff8f6; border: 1px solid #eedbd7; border-radius: 14px">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%">
                    <tr>
                      <td class="benefit-icon-cell" style="width: 43px; vertical-align: top; padding-right: 10px">
                        <div class="benefit-icon" style="width: 38px; height: 38px; line-height: 38px; text-align: center; border-radius: 11px; background: #f2e2dc; color: #9d2932; font-size: 18px; font-weight: 700">🛒</div>
                      </td>

                      <td class="benefit-content" style="vertical-align: top">
                        <div class="benefit-title" style="font-size: 12px; line-height: 1.35; font-weight: 900; color: #35231f">Add to Cart</div>

                        <div class="benefit-text" style="margin-top: 4px; font-size: 9px; line-height: 1.55; color: #806c63">Save your favorite products for later.</div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>

              <td class="benefit-column" style="width: 33.33%; vertical-align: top; padding-left: 4px">
                <div class="benefit-card" style="min-height: 92px; padding: 14px; background: #fbf8f4; border: 1px solid #e8ddd4; border-radius: 14px">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%">
                    <tr>
                      <td class="benefit-icon-cell" style="width: 43px; vertical-align: top; padding-right: 10px">
                        <div class="benefit-icon" style="width: 38px; height: 38px; line-height: 38px; text-align: center; border-radius: 11px; background: #f2e2dc; color: #9d2932; font-size: 18px; font-weight: 700">✦</div>
                      </td>

                      <td class="benefit-content" style="vertical-align: top">
                        <div class="benefit-title" style="font-size: 12px; line-height: 1.35; font-weight: 900; color: #35231f">Great Deals</div>

                        <div class="benefit-text" style="margin-top: 4px; font-size: 9px; line-height: 1.55; color: #806c63">Find offers and enjoy easy shopping.</div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>


    <!-- CTA -->

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        margin-top:22px;
        background:#F9F5F0;
        border:1px solid #E8DDD4;
        border-radius:15px;
      "
    >
      <tr>
        <td
          align="center"
          style="padding:20px 18px;"
        >
          <div
            style="
              font-size:15px;
              line-height:1.4;
              font-weight:900;
              color:#35231F;
            "
          >
            Ready to start shopping?
          </div>

          <div
            style="
              margin:5px 0 14px;
              font-size:10px;
              line-height:1.6;
              color:#806C63;
            "
          >
            Explore MineKart and find something made for you.
          </div>

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="margin:0 auto;"
          >
            <tr>
              <td
                align="center"
                style="padding:0 5px;"
              >
                <a
                  href="${productsUrl}"
                  style="
                    display:block;
                    width:130px;
                    padding:12px 0;
                    border-radius:9px;
                    background:#9D2932;
                    color:#FFFFFF;
                    font-size:11px;
                    line-height:16px;
                    font-weight:900;
                    text-align:center;
                    text-decoration:none;
                    font-family:Arial,Helvetica,sans-serif;
                    white-space:nowrap;
                  "
                >
                  Shop Products&nbsp;&nbsp;→
                </a>
              </td>

              <td
                align="center"
                style="padding:0 5px;"
              >
                <a
                  href="${profileUrl}"
                  style="
                    display:block;
                    width:130px;
                    padding:12px 0;
                    border-radius:9px;
                    background:#F7EEE7;
                    border:1px solid #DCCBC2;
                    color:#8E181F;
                    font-size:11px;
                    line-height:16px;
                    font-weight:900;
                    text-align:center;
                    text-decoration:none;
                    font-family:Arial,Helvetica,sans-serif;
                    white-space:nowrap;
                  "
                >
                  My Profile&nbsp;&nbsp;→
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- JOURNEY -->

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        margin-top:16px;
        background:#FFF9F7;
        border:1px solid #EEDBD7;
        border-radius:12px;
      "
    >
      <tr>
        <td style="padding:15px 16px;">
          <div
            style="
              font-size:12px;
              line-height:1.4;
              font-weight:900;
              color:#8E181F;
            "
          >
            Your MineKart journey starts here ✨
          </div>

          <div
            style="
              margin-top:5px;
              font-size:10px;
              line-height:1.6;
              color:#71635C;
            "
          >
            Explore our collection, discover products that match your needs,
            add your favorites to cart and enjoy a smooth shopping experience
            from browsing to checkout.
          </div>
        </td>
      </tr>
    </table>

    <!-- SECURITY -->

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        margin-top:12px;
        background:#F8F5F1;
        border:1px solid #E5DED6;
        border-radius:11px;
      "
    >
      <tr>
        <td
          width="36"
          valign="top"
          style="
            width:36px;
            padding:13px 8px 13px 13px;
          "
        >
          <div
            style="
              width:27px;
              height:27px;
              line-height:27px;
              text-align:center;
              border-radius:50%;
              background:#ECE5DD;
              color:#806C63;
              font-size:12px;
            "
          >
            🔒
          </div>
        </td>

        <td
          valign="top"
          style="padding:13px 13px 13px 0;"
        >
          <div
            style="
              font-size:10px;
              line-height:1.4;
              font-weight:900;
              color:#554B46;
            "
          >
            Didn't create this account?
          </div>

          <div
            style="
              margin-top:3px;
              font-size:9px;
              line-height:1.55;
              color:#80756E;
            "
          >
            You can safely ignore this email or contact MineKart support
            if you believe this account was created without your permission.
          </div>
        </td>
      </tr>
    </table>

    <!-- CLOSING -->

    <p
      style="
        margin:19px 0 0;
        font-size:11px;
        line-height:1.6;
        color:#756A64;
      "
    >
      We're happy to have you as part of the MineKart family.
    </p>

    <p
      style="
        margin:5px 0 0;
        font-size:11px;
        line-height:1.5;
        color:#756A64;
      "
    >
      Happy Shopping! 🛍️
    </p>
  `

  return emailLayout({
    preheader: 'Welcome to MineKart — your account is ready!',
     eyebrow: 'Your account is ready',
  title: 'Welcome to MineKart! 👋',
    children: content,
    footerNote: 'Your trusted shopping destination',
  })
}

module.exports = { welcomeEmail }
