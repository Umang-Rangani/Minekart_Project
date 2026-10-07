const { emailLayout } = require('./emailLayout')

const passwordResetSuccessEmail = (userName) => {
  const safeName = userName || 'there'

  const content = `
    <p style="margin:0;color:#5F4C45;font-size:14px;line-height:22px;">
      Hi <strong style="color:#351C18;">${safeName}</strong>,
    </p>

    <p style="margin:12px 0 0;color:#5F4C45;font-size:14px;line-height:22px;">
      Your MineKart account password has been successfully changed.
      You can now use your new password to sign in to your account.
    </p>

    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="margin-top:20px;"
    >
      <tr>
        <td
          align="center"
          style="
            background:#F7EEE7;
            border:1px solid #E8DDD4;
            border-radius:12px;
            padding:18px 12px;
          "
        >
          <div
            style="
              width:44px;
              height:44px;
              margin:0 auto;
              border-radius:50%;
              background:#8E181F;
              color:#FFFFFF;
              font-size:22px;
              line-height:44px;
              font-weight:700;
            "
          >
            ✓
          </div>

          <div
            style="
              margin-top:10px;
              color:#351C18;
              font-size:15px;
              line-height:21px;
              font-weight:800;
            "
          >
            Password updated successfully
          </div>

          <div
            style="
              margin-top:5px;
              color:#7A6962;
              font-size:10px;
              line-height:16px;
            "
          >
            Your account is ready to use.
          </div>
        </td>
      </tr>
    </table>

    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="margin-top:18px;"
    >
      <tr>
        <td
          style="
            border-left:3px solid #8E181F;
            background:#FBF7F2;
            padding:12px 13px;
          "
        >
          <p
            style="
              margin:0;
              color:#351C18;
              font-size:11px;
              line-height:17px;
              font-weight:700;
            "
          >
            Security notice
          </p>

          <p
            style="
              margin:4px 0 0;
              color:#6F5B54;
              font-size:10px;
              line-height:16px;
            "
          >
            If you made this change, no further action is required.
            If you did not change your password, please secure your account
            immediately.
          </p>
        </td>
      </tr>
    </table>

    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="margin-top:20px;"
    >
      <tr>
        <td align="center">

          <a
            href="https://minekart.vercel.app/"
            target="_blank"
            style="
              display:inline-block;
              background:#8E181F;
              color:#FFFFFF;
              text-decoration:none;
              font-size:12px;
              line-height:16px;
              font-weight:700;
              padding:11px 22px;
              border-radius:9px;
            "
          >
            Continue Shopping
          </a>

        </td>
      </tr>
    </table>

    <p
      style="
        margin:18px 0 0;
        color:#7A6962;
        font-size:11px;
        line-height:17px;
        text-align:center;
      "
    >
      Thank you for choosing MineKart.
    </p>
  `

  return emailLayout({
    preheader: 'Your MineKart password has been changed successfully.',
    eyebrow: 'Account Security',
    title: 'Password updated',
    children: content,
    footerNote: 'Your MineKart account is now secured with your new password.',
  })
}

module.exports = { passwordResetSuccessEmail }
