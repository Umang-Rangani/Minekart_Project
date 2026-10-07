const passwordResetSuccessEmail = (userName) => {
  return `
    <div style="margin:0;padding:40px 20px;background:#f7f1ec;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:580px;margin:0 auto;background:#fffdfb;border:1px solid #eaded5;border-radius:24px;overflow:hidden;box-shadow:0 10px 35px rgba(73,54,49,0.10);">

        <div style="padding:26px 30px;background:linear-gradient(135deg,#7d171c 0%,#a51d26 55%,#b5262d 100%);color:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <div style="font-size:27px;font-weight:800;letter-spacing:-0.5px;">
                  MineKart
                </div>

                <div style="margin-top:6px;color:#f7deda;font-size:12px;">
                  Shop Everything You Love
                </div>
              </td>

              <td align="right" valign="middle">
                <div style="width:42px;height:42px;line-height:42px;text-align:center;background:rgba(255,255,255,0.14);border:1px solid rgba(255,255,255,0.20);border-radius:12px;font-size:20px;">
                  🛒
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div style="padding:34px 30px 30px;">

          <div style="display:inline-block;padding:7px 12px;background:#f8eee8;border-radius:999px;color:#8e181f;font-size:11px;font-weight:700;letter-spacing:0.4px;">
            ACCOUNT SECURITY
          </div>

          <div style="margin:22px 0 18px;text-align:center;">
            <div style="display:inline-block;width:64px;height:64px;line-height:64px;text-align:center;background:#f8eee8;border:1px solid #ead8ce;border-radius:50%;font-size:28px;">
              ✓
            </div>
          </div>

          <h2 style="margin:0 0 10px;text-align:center;color:#351c18;font-size:23px;font-weight:800;">
            Password Updated Successfully
          </h2>

          <p style="margin:0 0 24px;text-align:center;color:#806c63;font-size:14px;line-height:1.7;">
            Hi ${userName},<br>
            Your MineKart account password has been successfully changed.
          </p>

          <div style="padding:22px 20px;background:linear-gradient(145deg,#fbf3ee,#f7e9e2);border:1px solid #ead8ce;border-radius:18px;text-align:center;">

            <div style="font-size:12px;color:#806c63;font-weight:600;letter-spacing:0.4px;">
              PASSWORD RESET
            </div>

            <div style="margin:12px 0 8px;color:#8e181f;font-size:18px;font-weight:800;">
              Completed Successfully
            </div>

            <div style="color:#806c63;font-size:11px;line-height:1.6;">
              Your new password is now active and ready to use.
            </div>

          </div>

          <div style="margin-top:22px;padding:15px 16px;background:#fffaf7;border:1px solid #eee1d9;border-radius:14px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="30" valign="top">
                  <div style="width:25px;height:25px;line-height:25px;text-align:center;background:#f8eee8;border-radius:8px;color:#8e181f;font-size:13px;">
                    🔒
                  </div>
                </td>

                <td style="padding-left:10px;color:#806c63;font-size:11px;line-height:1.6;">
                  If you made this change, no further action is required.
                  Your MineKart account is secured with your new password.
                </td>
              </tr>
            </table>
          </div>

          <p style="margin:24px 0 0;color:#806c63;font-size:12px;line-height:1.7;">
            If you did not make this change, please contact MineKart support
            immediately and secure your account.
          </p>

        </div>

        <div style="padding:22px 30px;background:#faf6f2;border-top:1px solid #eaded5;text-align:center;">

          <div style="font-size:13px;font-weight:700;color:#493631;">
            MineKart
          </div>

          <div style="margin-top:5px;color:#9a857b;font-size:10px;">
            Shop Everything You Love
          </div>

          <div style="margin-top:14px;color:#b09e95;font-size:10px;">
            © ${new Date().getFullYear()} MineKart. All rights reserved.
          </div>

        </div>

      </div>
    </div>
  `
}

module.exports = {
  passwordResetSuccessEmail,
}
