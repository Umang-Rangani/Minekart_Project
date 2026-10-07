const { emailLayout } = require('./emailLayout')

const passwordResetOtpEmail = (userName, otp) => {
  const safeName = userName || 'there'

  const content = `
    <p style="margin:0;color:#5F4C45;font-size:14px;line-height:22px;">
      Hi <strong style="color:#351C18;">${safeName}</strong>,
    </p>

    <p style="margin:12px 0 0;color:#5F4C45;font-size:14px;line-height:22px;">
      We received a request to reset the password for your MineKart account.
      Use the verification code below to continue.
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
              color:#967E74;
              font-size:9px;
              line-height:13px;
              font-weight:800;
              letter-spacing:1.5px;
              text-transform:uppercase;
            "
          >
            Verification Code
          </div>

          <div
            style="
              margin-top:8px;
              color:#8E181F;
              font-size:30px;
              line-height:36px;
              font-weight:800;
              letter-spacing:7px;
            "
          >
            ${otp}
          </div>

          <div
            style="
              margin-top:7px;
              color:#967E74;
              font-size:10px;
              line-height:15px;
            "
          >
            This code is valid for a limited time.
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
            Never share this verification code with anyone.
            MineKart support will never ask you for your OTP or password.
          </p>
        </td>
      </tr>
    </table>

    <p
      style="
        margin:18px 0 0;
        color:#7A6962;
        font-size:11px;
        line-height:17px;
      "
    >
      If you did not request a password reset, you can safely ignore this
      email. Your account password will remain unchanged.
    </p>
  `

  return emailLayout({
    preheader: `Your MineKart password reset verification code is ${otp}.`,
    eyebrow: 'Account Security',
    title: 'Reset your password',
    children: content,
    footerNote: 'Keep your MineKart account safe and secure.',
  })
}

module.exports = { passwordResetOtpEmail }
