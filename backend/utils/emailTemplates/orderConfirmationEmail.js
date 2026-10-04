const orderConfirmationEmail = ({ name, orderId, items, subtotal, deliveryCharge, tax, totalAmount, paymentMethod, shippingAddress }) => {
  const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`

  const itemRows = (items || [])
    .map(
      (item) => `
        <tr>
          <td
            class="product-cell"
            style="
              padding:14px 10px;
              border-bottom:1px solid #eaded8;
              vertical-align:middle;
            "
          >
            <div
              class="product-name"
              style="
                font-size:14px;
                font-weight:800;
                color:#35231F;
                line-height:1.45;
                word-break:break-word;
              "
            >
              ${item.productName || 'Product'}
            </div>
          </td>

          <td
            class="qty-cell"
            style="
              padding:14px 6px;
              border-bottom:1px solid #eaded8;
              text-align:center;
              vertical-align:middle;
              font-size:13px;
              font-weight:700;
              color:#806C63;
              white-space:nowrap;
            "
          >
            ${item.quantity || 0}
          </td>

          <td
            class="price-cell"
            style="
              padding:14px 10px;
              border-bottom:1px solid #eaded8;
              text-align:right;
              vertical-align:middle;
              font-size:14px;
              font-weight:900;
              color:#35231F;
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

  <title>Order Confirmed | MineKart</title>

  <style>

    * {
      box-sizing:border-box;
    }

    html,
    body {
      margin:0;
      padding:0;
      width:100%;
      background:#f7eee7;
      font-family:Arial,Helvetica,sans-serif;
      color:#35231F;
    }

    body {
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
      max-width:100%;
    }

    a {
      text-decoration:none;
    }

    .email-wrapper {
      width:100%;
      padding:34px 12px;
      background:#f7eee7;
    }

    .email-container {
      width:100%;
      max-width:700px;
      margin:0 auto;
      overflow:hidden;
      background:#ffffff;
      border:1px solid #e8ddd4;
      border-radius:20px;
      box-shadow:0 12px 40px rgba(53,28,24,0.08);
    }

    .email-header {
      padding:25px 28px;
      background:#fffaf7;
      border-bottom:1px solid #eaded8;
    }

    .brand-logo {
      font-size:25px;
      line-height:1;
      font-weight:900;
      letter-spacing:-0.7px;
      color:#35231F;
    }

    .brand-kart {
      color:#9D2932;
    }

    .brand-tagline {
      margin-top:7px;
      font-size:8px;
      line-height:1;
      font-weight:800;
      letter-spacing:2px;
      color:#967E74;
    }

    .header-link {
      display:inline-block;
      margin-top:11px;
      padding:7px 12px;
      border-radius:8px;
      background:#f7eee7;
      color:#9D2932;
      font-size:10px;
      font-weight:800;
    }

    .email-content {
      padding:30px;
    }

    .eyebrow {
      margin:0 0 8px;
      font-size:10px;
      font-weight:900;
      letter-spacing:1.4px;
      text-transform:uppercase;
      color:#9D2932;
    }

    .email-title {
      margin:0;
      font-size:28px;
      line-height:1.25;
      font-weight:900;
      letter-spacing:-0.5px;
      color:#35231F;
    }

    .email-text {
      font-size:14px;
      line-height:1.7;
      color:#806C63;
    }

    .intro-box {
      margin-top:19px;
      padding:15px 16px;
      border:1px solid #eaded8;
      border-radius:12px;
      background:#fffaf7;
    }

    .status-order-box {
      margin-top:22px;
      padding:17px;
      border:1px solid #e6c8c9;
      border-radius:15px;
      background:linear-gradient(135deg,#fff5f3,#fdf0ed);
    }

    .status-cell {
      width:60%;
      vertical-align:middle;
      padding-right:14px;
    }

    .order-id-cell {
      width:40%;
      vertical-align:middle;
      border-left:1px solid #e6c8c9;
      padding-left:16px;
    }

    .status-icon {
      width:34px;
      height:34px;
      line-height:34px;
      text-align:center;
      border-radius:50%;
      background:#9D2932;
      color:#ffffff;
      font-size:17px;
      font-weight:900;
    }

    .status-title {
      font-size:14px;
      font-weight:900;
      color:#9D2932;
      white-space:nowrap;
    }

    .status-subtitle {
      margin-top:3px;
      font-size:11px;
      line-height:1.4;
      color:#806C63;
    }

    .order-label {
      font-size:9px;
      font-weight:900;
      letter-spacing:1px;
      text-transform:uppercase;
      color:#967E74;
    }

    .order-id {
      margin-top:5px;
      font-size:16px;
      line-height:1.35;
      font-weight:900;
      color:#35231F;
      word-break:break-word;
    }

    .section {
      margin-top:27px;
    }

    .section-title {
      margin:0 0 12px;
      font-size:18px;
      line-height:1.3;
      font-weight:900;
      color:#35231F;
    }

    .section-heading-row {
      margin-bottom:12px;
    }

    .items-card {
      overflow:hidden;
      border:1px solid #e8ddd4;
      border-radius:14px;
      background:#ffffff;
    }

    .items-table {
      width:100%;
      table-layout:fixed;
    }

    .items-table th {
      padding:12px 10px;
      background:#f7eee7;
      color:#67544D;
      font-size:11px;
      font-weight:900;
      letter-spacing:.3px;
    }

    .items-table th:first-child {
      text-align:left;
      width:58%;
    }

    .items-table th:nth-child(2) {
      text-align:center;
      width:17%;
    }

    .items-table th:last-child {
      text-align:right;
      width:25%;
    }

    .summary-box {
      margin-top:22px;
      padding:18px;
      border:1px solid #e8ddd4;
      border-radius:14px;
      background:#fffaf7;
    }

    .summary-table {
      width:100%;
    }

    .summary-table td {
      padding:6px 0;
      font-size:13px;
      color:#806C63;
    }

    .summary-value {
      text-align:right;
      font-weight:800;
      color:#493631 !important;
      white-space:nowrap;
    }

    .total-divider {
      margin-top:12px;
      padding-top:14px;
      border-top:1px solid #e5d8d1;
    }

    .grand-total-label {
      font-size:17px;
      font-weight:900;
      color:#35231F;
    }

    .grand-total-price {
      text-align:right;
      font-size:21px;
      font-weight:900;
      color:#9D2932;
      white-space:nowrap;
    }

    .address-box {
      margin-top:20px;
      padding:18px;
      border:1px solid #e8ddd4;
      border-radius:14px;
      background:#ffffff;
    }

    .address-icon {
      width:30px;
      height:30px;
      line-height:30px;
      text-align:center;
      border-radius:9px;
      background:#f7eee7;
      color:#9D2932;
      font-size:13px;
      font-weight:900;
    }

    .address-title {
      margin:0 0 8px;
      font-size:16px;
      font-weight:900;
      color:#35231F;
    }

    .address-text {
      margin:0;
      font-size:13px;
      line-height:1.7;
      color:#806C63;
      word-break:break-word;
    }

    .address-text strong {
      color:#35231F;
    }

    .payment-box {
      margin-top:15px;
      padding:15px 17px;
      border:1px solid #e8ddd4;
      border-radius:12px;
      background:#fdf9f6;
    }

    .payment-icon {
      width:30px;
      height:30px;
      line-height:30px;
      text-align:center;
      border-radius:9px;
      background:#f7eee7;
      color:#9D2932;
      font-size:13px;
      font-weight:900;
    }

    .payment-label {
      font-size:10px;
      color:#967E74;
    }

    .payment-value {
      margin-top:3px;
      font-size:13px;
      font-weight:900;
      color:#35231F;
    }

    .next-box {
      margin-top:20px;
      padding:16px;
      border:1px solid #e7c8c9;
      border-radius:13px;
      background:#fff6f5;
    }

    .next-title {
      font-size:13px;
      font-weight:900;
      color:#9D2932;
    }

    .next-text {
      margin-top:5px;
      font-size:12px;
      line-height:1.65;
      color:#806C63;
    }

    .cta-wrap {
      margin-top:23px;
      text-align:center;
    }

    .cta-button {
      display:inline-block;
      padding:12px 22px;
      border-radius:10px;
      background:#9D2932;
      color:#ffffff !important;
      font-size:12px;
      font-weight:900;
      box-shadow:0 5px 14px rgba(157,41,50,0.18);
    }

    .closing {
      margin:22px 0 0;
      font-size:13px;
      line-height:1.6;
      color:#806C63;
    }

    .email-footer {
      padding:23px 25px;
      text-align:center;
      background:#351C18;
    }

    .footer-brand {
      font-size:18px;
      line-height:1;
      font-weight:900;
      letter-spacing:-.4px;
      color:#ffffff;
    }

    .footer-brand span {
      color:#E17B7F;
    }

    .footer-text {
      margin:8px 0 0;
      font-size:10px;
      line-height:1.6;
      color:#d8c6bd;
    }

    .footer-links {
      margin-top:12px;
    }

    .footer-link {
      color:#f2d8d5 !important;
      font-size:10px;
      font-weight:700;
    }

    .footer-separator {
      padding:0 7px;
      color:#80645c;
    }

    .copyright {
      margin:13px 0 0;
      font-size:9px;
      color:#a98f86;
    }

    @media only screen and (max-width:620px) {

      .email-wrapper {
        padding:10px 5px !important;
      }

      .email-container {
        width:100% !important;
        max-width:100% !important;
        border-radius:14px !important;
        box-shadow:none !important;
      }

      .email-header {
        padding:20px 15px !important;
      }

      .brand-logo {
        font-size:23px !important;
      }

      .brand-tagline {
        font-size:7px !important;
        letter-spacing:1.5px !important;
      }

      .email-content {
        padding:22px 15px !important;
      }

      .eyebrow {
        font-size:9px !important;
      }

      .email-title {
        font-size:23px !important;
        line-height:1.3 !important;
      }

      .email-text {
        font-size:13px !important;
      }

      .intro-box {
        padding:13px !important;
      }

      .status-order-box {
        padding:13px !important;
      }

      .status-cell {
        width:60% !important;
        padding-right:8px !important;
      }

      .order-id-cell {
        width:40% !important;
        padding-left:10px !important;
      }

      .status-icon {
        width:30px !important;
        height:30px !important;
        line-height:30px !important;
        font-size:15px !important;
      }

      .status-title {
        font-size:11px !important;
      }

      .status-subtitle {
        font-size:9px !important;
      }

      .order-label {
        font-size:8px !important;
      }

      .order-id {
        font-size:13px !important;
      }

      .section {
        margin-top:22px !important;
      }

      .section-title {
        font-size:16px !important;
      }

      .items-table th {
        padding:9px 5px !important;
        font-size:9px !important;
      }

      .items-table td {
        padding:11px 5px !important;
      }

      .product-name {
        font-size:11px !important;
      }

      .qty-cell {
        font-size:11px !important;
      }

      .price-cell {
        font-size:11px !important;
      }

      .summary-box {
        padding:14px !important;
      }

      .summary-table td {
        padding:5px 0 !important;
        font-size:12px !important;
      }

      .grand-total-label {
        font-size:15px !important;
      }

      .grand-total-price {
        font-size:18px !important;
      }

      .address-box {
        padding:14px !important;
      }

      .address-title {
        font-size:14px !important;
      }

      .address-text {
        font-size:12px !important;
      }

      .payment-box {
        padding:13px !important;
      }

      .next-box {
        padding:13px !important;
      }

      .next-title {
        font-size:12px !important;
      }

      .next-text {
        font-size:11px !important;
      }

      .cta-button {
        display:block !important;
        padding:12px 15px !important;
        font-size:11px !important;
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
  >

    <div
      class="email-container"
    >

      <!-- HEADER -->

      <div
        class="email-header"
      >

        <a
          href="https://minekart.vercel.app"
          style="display:inline-block;text-decoration:none;"
        >

          <div
            class="brand-logo"
          >
            Mine<span class="brand-kart">Kart</span>
          </div>

          <div
            class="brand-tagline"
          >
            SHOP MORE • LIVE BETTER
          </div>

        </a>

        <div>

          <a
            href="https://minekart.vercel.app"
            class="header-link"
          >
            Visit MineKart
          </a>

        </div>

      </div>


      <!-- CONTENT -->

      <div
        class="email-content"
      >

        <div
          class="eyebrow"
        >
          Order Update
        </div>

        <h1
          class="email-title"
        >
          Order Confirmed! 🎉
        </h1>


        <p
          class="email-text"
          style="margin:13px 0 0;"
        >
          Hi ${name || 'Customer'},
        </p>

        <div
          class="intro-box"
        >

          <p
            class="email-text"
            style="margin:0;"
          >
            Thank you for shopping with
            <strong style="color:#9D2932;">
              MineKart
            </strong>.
            Your order has been successfully confirmed and is now being processed.
          </p>

        </div>


        <!-- STATUS + ORDER ID -->

        <div
          class="status-order-box"
        >

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="width:100%;table-layout:fixed;"
          >

            <tr>

              <td
                class="status-cell"
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
                      style="width:40px;vertical-align:middle;"
                    >

                      <div
                        class="status-icon"
                      >
                        ✓
                      </div>

                    </td>

                    <td
                      style="vertical-align:middle;"
                    >

                      <div
                        class="status-title"
                      >
                        Order confirmed
                      </div>

                      <div
                        class="status-subtitle"
                      >
                        Your order is being processed
                      </div>

                    </td>

                  </tr>

                </table>

              </td>


              <td
                class="order-id-cell"
              >

                <div
                  class="order-label"
                >
                  Order ID
                </div>

                <div
                  class="order-id"
                >
                  ${orderId}
                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- ORDER ITEMS -->

        <div
          class="section"
        >

          <h2
            class="section-title"
          >
            Order Items
          </h2>

          <div
            class="items-card"
          >

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

        <div
          class="summary-box"
        >

          <h2
            class="section-title"
          >
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

              <td class="summary-value">
                ${formatPrice(subtotal)}
              </td>

            </tr>

            <tr>

              <td>
                Delivery
              </td>

              <td class="summary-value">

                ${Number(deliveryCharge) === 0 ? '<span style="color:#3e8b62;font-weight:900;">FREE</span>' : formatPrice(deliveryCharge)}

              </td>

            </tr>

            <tr>

              <td>
                Tax
              </td>

              <td class="summary-value">
                ${formatPrice(tax)}
              </td>

            </tr>

            <tr>

              <td colspan="2">

                <div
                  class="total-divider"
                >

                  <table
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    width="100%"
                  >

                    <tr>

                      <td
                        class="grand-total-label"
                      >
                        Grand Total
                      </td>

                      <td
                        class="grand-total-price"
                      >
                        ${formatPrice(totalAmount)}
                      </td>

                    </tr>

                  </table>

                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- DELIVERY ADDRESS -->

        <div
          class="address-box"
        >

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
          >

            <tr>

              <td
                style="width:40px;vertical-align:top;"
              >

                <div
                  class="address-icon"
                >
                  ●
                </div>

              </td>

              <td
                style="vertical-align:top;"
              >

                <h3
                  class="address-title"
                >
                  Delivery Address
                </h3>

                <p
                  class="address-text"
                >

                  <strong>
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

              </td>

            </tr>

          </table>

        </div>


        <!-- PAYMENT -->

        <div
          class="payment-box"
        >

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
          >

            <tr>

              <td
                style="width:40px;vertical-align:middle;"
              >

                <div
                  class="payment-icon"
                >
                  ₹
                </div>

              </td>

              <td
                style="vertical-align:middle;"
              >

                <div
                  class="payment-label"
                >
                  Payment Method
                </div>

                <div
                  class="payment-value"
                >
                  ${paymentText}
                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- WHAT'S NEXT -->

        <div
          class="next-box"
        >

          <div
            class="next-title"
          >
            What's next?
          </div>

          <div
            class="next-text"
          >
            Your order is now confirmed and our team is preparing it.
            We will keep you updated as your order moves through each stage.
          </div>

        </div>


        <!-- CTA -->

        <div
          class="cta-wrap"
        >

          <a
            href="https://minekart.vercel.app"
            class="cta-button"
          >
            Continue Shopping →
          </a>

        </div>


        <!-- CLOSING -->

        <p
          class="closing"
        >
          Thank you for choosing
          <strong style="color:#9D2932;">
            MineKart
          </strong>.
        </p>

        <p
          class="closing"
          style="margin-top:6px;"
        >
          Happy Shopping! 🛍️
        </p>

      </div>


      <!-- FOOTER -->

      <div
        class="email-footer"
      >

        <div
          class="footer-brand"
        >
          Mine<span>Kart</span>
        </div>

        <p
          class="footer-text"
        >
          Your trusted shopping destination.
          Shop products you love with MineKart.
        </p>

        <div
          class="footer-links"
        >

          <a
            href="https://minekart.vercel.app"
            class="footer-link"
          >
            MineKart
          </a>

          <span class="footer-separator">
            •
          </span>

          <a
            href="https://minekart.vercel.app/terms"
            class="footer-link"
          >
            Terms
          </a>

          <span class="footer-separator">
            •
          </span>

          <a
            href="https://minekart.vercel.app/privacy"
            class="footer-link"
          >
            Privacy
          </a>

        </div>

        <p
          class="copyright"
        >
          This is an automated email. Please do not reply directly.
          <br />
          © ${new Date().getFullYear()} MineKart. All rights reserved.
        </p>

      </div>

    </div>

  </div>

</body>

</html>
`
}

module.exports = { orderConfirmationEmail }
