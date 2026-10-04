const orderPlacedEmail = ({ name, orderId, items, subtotal, deliveryCharge, tax, totalAmount, paymentMethod, shippingAddress }) => {
  const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`

  const itemRows = (items || [])
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding:14px 10px;
              border-bottom:1px solid #eadfd8;
              vertical-align:middle;
            "
          >
          <div
  style="
    font-size:14px;
    font-weight:800;
    color:#35231f;
    line-height:1.45;
    word-break:break-word;
  "
>
  ${
    String(item.productName || 'Product').length > 55
      ? `${String(item.productName || 'Product')
          .slice(0, 55)
          .trimEnd()}...`
      : item.productName || 'Product'
  }
</div>
          </td>

          <td
            style="
              padding:14px 6px;
              border-bottom:1px solid #eadfd8;
              text-align:center;
              vertical-align:middle;
              font-size:14px;
              font-weight:700;
              color:#806c63;
              white-space:nowrap;
            "
          >
            ${item.quantity || 0}
          </td>

          <td
            style="
              padding:14px 10px;
              border-bottom:1px solid #eadfd8;
              text-align:right;
              vertical-align:middle;
              font-size:14px;
              font-weight:900;
              color:#35231f;
              white-space:nowrap;
            "
          >
            ${formatPrice(item.totalPrice)}
          </td>
        </tr>
      `,
    )
    .join('')

  const paymentText = paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online on Delivery'

  return `
<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Order Placed - MineKart</title>

  <style>

    * {
      box-sizing:border-box;
    }

    html,
    body {
      margin:0;
      padding:0;
      width:100%;
    }

    body {
      background:#f6eee9;
      font-family:Arial,Helvetica,sans-serif;
      color:#35231f;
      -webkit-text-size-adjust:100%;
      -ms-text-size-adjust:100%;
    }

    table {
      border-spacing:0;
      border-collapse:collapse;
    }

    img {
      border:0;
      display:block;
    }

    a {
      text-decoration:none;
    }

    .email-wrapper {
      width:100%;
      padding:34px 12px;
      background:#f6eee9;
    }

    .email-container {
      width:100%;
      max-width:700px;
      margin:0 auto;
      background:#ffffff;
      border:1px solid #e8ddd4;
      border-radius:20px;
      overflow:hidden;
      box-shadow:0 8px 30px rgba(73,54,49,0.07);
    }

    /* HEADER */

    .email-header {
      padding:25px 28px;
      background:#fffaf7;
      border-bottom:1px solid #eadfd8;
    }

    .brand-row {
      width:100%;
    }

    .brand-logo {
      font-size:25px;
      line-height:1;
      font-weight:900;
      letter-spacing:-.7px;
      color:#35231f;
    }

    .brand-tagline {
      margin-top:7px;
      font-size:10px;
      line-height:1.5;
      font-weight:700;
      letter-spacing:.15em;
      color:#967e74;
      text-transform:uppercase;
    }

    .website-link {
      display:inline-block;
      padding:8px 13px;
      border:1px solid #ead7ce;
      border-radius:9px;
      background:#f8eee9;
      color:#8e181f;
      font-size:11px;
      font-weight:800;
    }

    /* HERO */

    .email-hero {
      padding:28px;
      background:linear-gradient(
        135deg,
        #351c18 0%,
        #4a2520 55%,
        #7d171c 100%
      );
    }

    .hero-badge {
      display:inline-block;
      padding:6px 10px;
      border:1px solid rgba(255,255,255,.15);
      border-radius:999px;
      background:rgba(255,255,255,.08);
      color:#f8e8df;
      font-size:9px;
      font-weight:800;
      letter-spacing:.08em;
      text-transform:uppercase;
    }

    .hero-title {
      margin:14px 0 0;
      font-size:27px;
      line-height:1.3;
      font-weight:900;
      color:#ffffff;
    }

    .hero-text {
      margin:9px 0 0;
      max-width:530px;
      font-size:13px;
      line-height:1.7;
      color:rgba(255,255,255,.72);
    }

    /* CONTENT */

    .email-content {
      padding:30px;
    }

    .email-text {
      font-size:14px;
      line-height:1.7;
      color:#756c65;
    }

    /* ORDER STATUS */

    .status-order-box {
      width:100%;
      margin-top:22px;
      padding:15px;
      background:#fff8f5;
      border:1px solid #ead9d2;
      border-radius:14px;
    }

    .status-table {
      width:100%;
      table-layout:fixed;
    }

    .status-cell {
      width:60%;
      vertical-align:middle;
      padding-right:14px;
    }

    .order-id-cell {
      width:40%;
      vertical-align:middle;
      padding-left:16px;
      border-left:1px solid #ead9d2;
    }

    .status-icon {
      width:34px;
      height:34px;
      line-height:34px;
      text-align:center;
      border-radius:50%;
      background:#8e181f;
      color:#ffffff;
      font-size:17px;
      font-weight:900;
    }

    .status-title {
      font-size:14px;
      font-weight:900;
      color:#8e181f;
    }

    .status-subtitle {
      margin-top:3px;
      font-size:11px;
      line-height:1.4;
      color:#806c63;
    }

    .order-label {
      font-size:9px;
      font-weight:900;
      letter-spacing:.9px;
      text-transform:uppercase;
      color:#a08d84;
    }

    .order-id {
      margin-top:4px;
      font-size:16px;
      font-weight:900;
      color:#35231f;
      word-break:break-word;
    }

    /* SECTION */

    .section {
      margin-top:27px;
    }

    .section-title {
      margin:0 0 12px;
      font-size:18px;
      line-height:1.3;
      font-weight:900;
      color:#35231f;
    }

    /* ITEMS */

    .items-card {
      overflow:hidden;
      border:1px solid #e8ddd4;
      border-radius:13px;
      background:#ffffff;
    }

    .items-table {
      width:100%;
      table-layout:fixed;
      border-collapse:collapse;
    }

    .items-table th {
      padding:11px 9px;
      background:#f8f1ec;
      color:#67544d;
      font-size:11px;
      font-weight:900;
      letter-spacing:.02em;
    }

    .items-table th:nth-child(1) {
      width:57%;
      text-align:left;
    }

    .items-table th:nth-child(2) {
      width:16%;
      text-align:center;
    }

    .items-table th:nth-child(3) {
      width:27%;
      text-align:right;
    }

    /* SUMMARY */

    .summary-box {
      margin-top:22px;
      padding:18px;
      background:#fbf7f2;
      border:1px solid #e8ddd4;
      border-radius:13px;
    }

    .summary-table {
      width:100%;
    }

    .summary-table td {
      padding:5px 0;
      font-size:13px;
      color:#806c63;
    }

    .summary-price {
      text-align:right;
      font-weight:800;
      color:#493631 !important;
      white-space:nowrap;
    }

    .grand-total td {
      padding-top:14px !important;
      border-top:1px solid #e5d9d1;
      font-size:17px !important;
      font-weight:900 !important;
      color:#35231f !important;
    }

    .grand-total .total-price {
      text-align:right;
      color:#9d2932 !important;
      white-space:nowrap;
      font-size:20px !important;
    }

    /* ADDRESS */

    .address-box {
      margin-top:20px;
      padding:18px;
      background:#ffffff;
      border:1px solid #e8ddd4;
      border-radius:13px;
    }

    .address-head {
      margin-bottom:12px;
    }

    .address-icon {
      width:30px;
      height:30px;
      line-height:30px;
      text-align:center;
      border-radius:9px;
      background:#f7eee7;
      color:#8e181f;
      font-size:13px;
      font-weight:900;
    }

    .address-title {
      margin:0;
      font-size:15px;
      font-weight:900;
      color:#35231f;
    }

    .address-text {
      margin:0;
      font-size:13px;
      line-height:1.7;
      color:#806c63;
      word-break:break-word;
    }

    /* PAYMENT */

    .payment-box {
      margin-top:16px;
      padding:15px 16px;
      background:#f8f3ef;
      border:1px solid #e8ddd4;
      border-radius:11px;
    }

    .payment-icon {
      width:30px;
      height:30px;
      line-height:30px;
      text-align:center;
      border-radius:9px;
      background:#eee1da;
      color:#8e181f;
      font-size:13px;
      font-weight:900;
    }

    .payment-label {
      font-size:10px;
      font-weight:700;
      color:#9a857b;
    }

    .payment-value {
      margin-top:3px;
      font-size:14px;
      font-weight:900;
      color:#35231f;
    }

    /* NEXT */

    .next-box {
      margin-top:18px;
      padding:16px;
      background:#fff7f5;
      border:1px solid #efd9d5;
      border-left:4px solid #9d2932;
      border-radius:10px;
    }

    .next-title {
      font-size:13px;
      font-weight:900;
      color:#8e181f;
    }

    .next-text {
      margin-top:5px;
      font-size:12px;
      line-height:1.7;
      color:#806c63;
    }

    /* CTA */

    .cta-box {
      margin-top:22px;
      text-align:center;
    }

    .cta-button {
      display:inline-block;
      padding:12px 22px;
      border-radius:10px;
      background:#9d2932;
      color:#ffffff !important;
      font-size:12px;
      font-weight:900;
      box-shadow:0 5px 15px rgba(157,41,50,.18);
    }

    .website-note {
      margin-top:9px;
      font-size:10px;
      color:#a08d84;
    }

    /* FOOTER */

    .email-footer {
      padding:23px 25px;
      text-align:center;
      background:#faf6f2;
      border-top:1px solid #e8ddd4;
    }

    .footer-links {
      margin-top:10px;
    }

    .footer-link {
      color:#9d2932 !important;
      font-size:11px;
      font-weight:800;
    }

    .footer-divider {
      margin:0 7px;
      color:#c7b7ae;
      font-size:11px;
    }

    .footer-text {
      margin:0;
      font-size:11px;
      line-height:1.6;
      color:#9a857b;
    }

    .footer-brand {
      margin:9px 0 0;
      font-size:13px;
      font-weight:900;
      color:#35231f;
    }

    /* MOBILE */

    @media only screen and (max-width:620px) {

      .email-wrapper {
        padding:10px 5px !important;
      }

      .email-container {
        width:100% !important;
        max-width:100% !important;
        border-radius:13px !important;
      }

      .email-header {
        padding:19px 14px !important;
      }

      .brand-logo {
        font-size:22px !important;
      }

      .brand-tagline {
        font-size:8px !important;
        letter-spacing:.12em !important;
      }

      .website-link {
        padding:7px 9px !important;
        font-size:9px !important;
      }

      .email-hero {
        padding:22px 15px !important;
      }

      .hero-title {
        font-size:22px !important;
      }

      .hero-text {
        font-size:12px !important;
        line-height:1.6 !important;
      }

      .email-content {
        padding:21px 14px !important;
      }

      .email-text {
        font-size:13px !important;
      }

      .status-order-box {
        margin-top:18px !important;
        padding:11px !important;
        border-radius:11px !important;
      }

      .status-cell {
        width:59% !important;
        padding-right:7px !important;
      }

      .order-id-cell {
        width:41% !important;
        padding-left:9px !important;
      }

      .status-icon {
        width:29px !important;
        height:29px !important;
        line-height:29px !important;
        font-size:15px !important;
      }

      .status-title {
        font-size:11px !important;
      }

      .status-subtitle {
        margin-top:2px !important;
        font-size:9px !important;
      }

      .order-label {
        font-size:8px !important;
      }

      .order-id {
        font-size:12px !important;
      }

      .section {
        margin-top:21px !important;
      }

      .section-title {
        margin-bottom:9px !important;
        font-size:16px !important;
      }

      .items-table th {
        padding:9px 5px !important;
        font-size:9px !important;
      }

      .items-table td {
        padding:10px 5px !important;
      }

      .items-table td div {
        font-size:11px !important;
      }

      .items-table td:nth-child(2),
      .items-table td:nth-child(3) {
        font-size:11px !important;
      }

      .summary-box {
        margin-top:19px !important;
        padding:14px !important;
      }

      .summary-table td {
        padding:4px 0 !important;
        font-size:12px !important;
      }

      .grand-total td {
        padding-top:11px !important;
        font-size:15px !important;
      }

      .grand-total .total-price {
        font-size:17px !important;
      }

      .address-box {
        margin-top:17px !important;
        padding:14px !important;
      }

      .address-title {
        font-size:14px !important;
      }

      .address-text {
        font-size:11px !important;
      }

      .payment-box {
        margin-top:13px !important;
        padding:12px 13px !important;
      }

      .payment-value {
        font-size:12px !important;
      }

      .next-box {
        margin-top:15px !important;
        padding:13px !important;
      }

      .next-title {
        font-size:12px !important;
      }

      .next-text {
        font-size:11px !important;
      }

      .cta-button {
        padding:11px 18px !important;
        font-size:11px !important;
      }

      .email-footer {
        padding:18px 12px !important;
      }

      .footer-text {
        font-size:10px !important;
      }

      .footer-brand {
        font-size:12px !important;
      }

    }

    @media only screen and (max-width:380px) {

      .brand-row td {
        display:block !important;
        width:100% !important;
        text-align:center !important;
      }

      .brand-row td:last-child {
        padding-top:12px !important;
      }

      .hero-title {
        font-size:20px !important;
      }

      .email-content {
        padding:19px 11px !important;
      }

      .status-title {
        font-size:10px !important;
      }

      .status-subtitle {
        font-size:8px !important;
      }

      .order-id {
        font-size:11px !important;
      }

    }

  </style>

</head>

<body>

  <div class="email-wrapper">

    <div class="email-container">

      <!-- HEADER -->

      <div class="email-header">

        <table
          class="brand-row"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
        >

          <tr>

            <td
              width="65%"
              align="left"
              valign="middle"
            >

              <a
                href="https://minekart.vercel.app"
                style="display:inline-block;text-decoration:none;"
              >

                <div class="brand-logo">
                  Mine
                  <span style="color:#9d2932;">
                    Kart
                  </span>
                </div>

                <div class="brand-tagline">
                  SHOP MORE • LIVE BETTER
                </div>

              </a>

            </td>

            <td
              width="35%"
              align="right"
              valign="middle"
            >

              <a
                href="https://minekart.vercel.app"
                class="website-link"
              >
                Visit MineKart
              </a>

            </td>

          </tr>

        </table>

      </div>


      <!-- HERO -->

      <div class="email-hero">

        <span class="hero-badge">
          Order Received
        </span>

        <h1 class="hero-title">
          Order Placed Successfully! 🛍️
        </h1>

        <p class="hero-text">
          Hi ${name || 'Customer'}, thank you for shopping with MineKart.
          We have successfully received your order and will keep you updated.
        </p>

      </div>


      <!-- CONTENT -->

      <div class="email-content">

        <!-- STATUS + ORDER -->

        <div class="status-order-box">

          <table
            class="status-table"
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
          >

            <tr>

              <td class="status-cell">

                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                >

                  <tr>

                    <td
                      style="
                        width:39px;
                        vertical-align:middle;
                      "
                    >

                      <div class="status-icon">
                        ✓
                      </div>

                    </td>

                    <td
                      style="
                        vertical-align:middle;
                      "
                    >

                      <div class="status-title">
                        Order received
                      </div>

                      <div class="status-subtitle">
                        Waiting for confirmation
                      </div>

                    </td>

                  </tr>

                </table>

              </td>


              <td class="order-id-cell">

                <div class="order-label">
                  Order ID
                </div>

                <div class="order-id">
                  ${orderId}
                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- ORDER ITEMS -->

        <div class="section">

          <h2 class="section-title">
            Order Items
          </h2>

          <div class="items-card">

            <table
              class="items-table"
              cellpadding="0"
              cellspacing="0"
              border="0"
              width="100%"
            >

              <thead>

                <tr>

                  <th>
                    Product
                  </th>

                  <th>
                    Qty
                  </th>

                  <th>
                    Total
                  </th>

                </tr>

              </thead>

              <tbody>
                ${itemRows}
              </tbody>

            </table>

          </div>

        </div>


        <!-- ORDER SUMMARY -->

        <div class="summary-box">

          <h2 class="section-title">
            Order Summary
          </h2>

          <table
            class="summary-table"
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
          >

            <tr>

              <td>
                Subtotal
              </td>

              <td class="summary-price">
                ${formatPrice(subtotal)}
              </td>

            </tr>

            <tr>

              <td>
                Delivery
              </td>

              <td class="summary-price">
                ${Number(deliveryCharge) === 0 ? '<span style="color:#3e8b62;font-weight:900;">FREE</span>' : formatPrice(deliveryCharge)}
              </td>

            </tr>

            <tr>

              <td>
                Tax
              </td>

              <td class="summary-price">
                ${formatPrice(tax)}
              </td>

            </tr>

            <tr class="grand-total">

              <td>
                Grand Total
              </td>

              <td class="total-price">
                ${formatPrice(totalAmount)}
              </td>

            </tr>

          </table>

        </div>


        <!-- DELIVERY ADDRESS -->

        <div class="address-box">

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
          >

            <tr>

              <td
                style="
                  width:40px;
                  vertical-align:top;
                "
              >

                <div class="address-icon">
                  ●
                </div>

              </td>

              <td
                style="
                  vertical-align:top;
                "
              >

                <h3 class="address-title">
                  Delivery Address
                </h3>

              </td>

            </tr>

          </table>

          <p class="address-text">

            <strong style="color:#35231f;">
              ${shippingAddress?.fullName || ''}
            </strong>

            <br />

            ${shippingAddress?.addressLine || ''}

            <br />

            ${shippingAddress?.city || ''}

            ${shippingAddress?.state ? `, ${shippingAddress.state}` : ''}

            ${shippingAddress?.pincode ? ` - ${shippingAddress.pincode}` : ''}

            ${shippingAddress?.phone ? `<br />Phone: ${shippingAddress.phone}` : ''}

          </p>

        </div>


        <!-- PAYMENT -->

        <div class="payment-box">

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
          >

            <tr>

              <td
                style="
                  width:40px;
                  vertical-align:middle;
                "
              >

                <div class="payment-icon">
                  ₹
                </div>

              </td>

              <td
                style="
                  vertical-align:middle;
                "
              >

                <div class="payment-label">
                  Payment Method
                </div>

                <div class="payment-value">
                  ${paymentText}
                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- NEXT STEP -->

        <div class="next-box">

          <div class="next-title">
            What's next?
          </div>

          <div class="next-text">
            Our team will review and confirm your order.
            You will receive another email once your order is confirmed.
          </div>

        </div>


        <!-- CTA -->

        <div class="cta-box">

          <a
            href="https://minekart.vercel.app"
            class="cta-button"
          >
            Continue Shopping
          </a>


        </div>


        <!-- CLOSING -->

        <p
          class="email-text"
          style="
            margin:22px 0 0;
            font-size:13px;
          "
        >
          We will keep you updated about your order status.
        </p>

        <p
          class="email-text"
          style="
            margin:9px 0 0;
            font-size:13px;
          "
        >
          Happy Shopping! 🛍️
        </p>

      </div>


      <!-- FOOTER -->

      <div class="email-footer">

        <p class="footer-text">
          This is an automated email from MineKart.
          Please do not reply directly.
        </p>

        <div class="footer-links">

          <a
            href="https://minekart.vercel.app"
            class="footer-link"
          >
            MineKart
          </a>

          <span class="footer-divider">
            •
          </span>

          <a
            href="https://minekart.vercel.app/terms"
            class="footer-link"
          >
            Terms
          </a>

          <span class="footer-divider">
            •
          </span>

          <a
            href="https://minekart.vercel.app/privacy"
            class="footer-link"
          >
            Privacy
          </a>

        </div>

        <p class="footer-brand">
          <span style="color:#35231f;">
            Mine
          </span>
          <span style="color:#9d2932;">
            Kart
          </span>
          © ${new Date().getFullYear()}
        </p>

      </div>

    </div>

  </div>

</body>
</html>
`
}

module.exports = { orderPlacedEmail }
