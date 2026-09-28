export const orderPlacedEmail = ({ name, orderId, items, subtotal, deliveryCharge, tax, totalAmount, paymentMethod, shippingAddress }) => {
  const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`

  const itemRows = (items || [])
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding:12px 8px;
              border-bottom:1px solid #e3ded6;
              vertical-align:middle;
            "
          >
            <div
              style="
                font-size:14px;
                font-weight:700;
                color:#3f3a35;
                line-height:1.45;
                word-break:break-word;
              "
            >
              ${item.productName || 'Product'}
            </div>
          </td>

          <td
            style="
              padding:12px 5px;
              border-bottom:1px solid #e3ded6;
              text-align:center;
              vertical-align:middle;
              font-size:14px;
              font-weight:600;
              color:#6b6258;
              white-space:nowrap;
            "
          >
            ${item.quantity || 0}
          </td>

          <td
            style="
              padding:12px 8px;
              border-bottom:1px solid #e3ded6;
              text-align:right;
              vertical-align:middle;
              font-size:14px;
              font-weight:700;
              color:#3f3a35;
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
<html>
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
      background:#f4f2ee;
      font-family:Arial,Helvetica,sans-serif;
      color:#292725;
    }

    table {
      border-spacing:0;
      border-collapse:collapse;
    }

    img {
      border:0;
      display:block;
    }

    .email-wrapper {
      width:100%;
      padding:34px 12px;
      background:#f4f2ee;
    }

    .email-container {
      width:100%;
      max-width:640px;
      margin:0 auto;
      background:#ffffff;
      border:1px solid #e3ded6;
      border-radius:16px;
      overflow:hidden;
    }

    .email-header {
      padding:28px 24px;
      text-align:center;
      background:#6b6258;
    }

    .email-logo {
      font-size:30px;
      font-weight:800;
      color:#ffffff;
      letter-spacing:-.5px;
    }

    .email-content {
      padding:32px;
    }

    .email-title {
      margin:0 0 15px;
      font-size:27px;
      line-height:1.3;
      font-weight:800;
      color:#3f3a35;
    }

    .email-text {
      font-size:15px;
      line-height:1.7;
      color:#625b55;
    }

    .status-order-box {
      width:100%;
      margin-top:24px;
      padding:15px;
      background:#eef7f1;
      border:1px solid #cfe5d6;
      border-radius:12px;
    }

    .status-table {
      width:100%;
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
      border-left:1px solid #cfe5d6;
    }

    .status-icon {
      width:32px;
      height:32px;
      line-height:32px;
      text-align:center;
      border-radius:50%;
      background:#3e8b62;
      color:#ffffff;
      font-size:18px;
      font-weight:700;
    }

    .status-title {
      font-size:14px;
      font-weight:800;
      color:#3e8b62;
    }

    .status-subtitle {
      margin-top:3px;
      font-size:12px;
      line-height:1.4;
      color:#617066;
    }

    .order-label {
      font-size:10px;
      font-weight:800;
      letter-spacing:.8px;
      text-transform:uppercase;
      color:#7b746d;
    }

    .order-id {
      margin-top:4px;
      font-size:17px;
      font-weight:800;
      color:#3f3a35;
      white-space:nowrap;
    }

    .section {
      margin-top:26px;
    }

    .section-title {
      margin:0 0 12px;
      font-size:18px;
      line-height:1.3;
      font-weight:800;
      color:#3f3a35;
    }

    .items-table {
      width:100%;
      table-layout:fixed;
      border-collapse:collapse;
    }

    .items-table th {
      padding:11px 8px;
      background:#f7f4ef;
      color:#514a45;
      font-size:12px;
      font-weight:800;
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

    .summary-box {
      margin-top:26px;
      padding:18px;
      background:#fbfaf7;
      border:1px solid #e3ded6;
      border-radius:12px;
    }

    .summary-table {
      width:100%;
    }

    .summary-table td {
      padding:5px 0;
      font-size:14px;
      color:#6b6258;
    }

    .summary-price {
      text-align:right;
      font-weight:700;
      color:#3f3a35 !important;
      white-space:nowrap;
    }

    .grand-total {
      border-top:1px solid #e3ded6;
    }

    .grand-total td {
      padding-top:14px !important;
      font-size:18px !important;
      font-weight:800 !important;
      color:#3f3a35 !important;
    }

    .grand-total .total-price {
      text-align:right;
      color:#8e181f !important;
      white-space:nowrap;
      font-size:20px !important;
    }

    .address-box {
      margin-top:24px;
      padding:18px;
      background:#ffffff;
      border:1px solid #e3ded6;
      border-radius:12px;
    }

    .address-title {
      margin:0 0 9px;
      font-size:16px;
      font-weight:800;
      color:#3f3a35;
    }

    .address-text {
      margin:0;
      font-size:13px;
      line-height:1.7;
      color:#6b6258;
      word-break:break-word;
    }

    .payment-box {
      margin-top:16px;
      padding:15px 16px;
      background:#f7f4ef;
      border:1px solid #e5ded6;
      border-radius:10px;
    }

    .payment-label {
      font-size:11px;
      color:#8a8179;
    }

    .payment-value {
      margin-top:3px;
      font-size:14px;
      font-weight:800;
      color:#3f3a35;
    }

    .next-box {
      margin-top:20px;
      padding:15px 16px;
      background:#fff6f5;
      border:1px solid #f0d9d6;
      border-left:4px solid #a51d26;
      border-radius:9px;
    }

    .next-title {
      font-size:14px;
      font-weight:800;
      color:#8e181f;
    }

    .next-text {
      margin-top:5px;
      font-size:13px;
      line-height:1.65;
      color:#6b6258;
    }

    .email-footer {
      padding:22px 24px;
      text-align:center;
      background:#fbfaf7;
      border-top:1px solid #e3ded6;
    }

    .footer-text {
      margin:0;
      font-size:12px;
      line-height:1.5;
      color:#918980;
    }

    .footer-brand {
      margin:7px 0 0;
      font-size:13px;
      font-weight:800;
      color:#6b6258;
    }


    /* MOBILE */

    @media only screen and (max-width:480px) {

      .email-wrapper {
        padding:8px 5px !important;
      }

      .email-container {
        width:100% !important;
        max-width:none !important;
        border-radius:10px !important;
      }

      .email-header {
        padding:22px 14px !important;
      }

      .email-logo {
        font-size:26px !important;
      }

      .email-content {
        padding:22px 14px !important;
      }

      .email-title {
        font-size:23px !important;
        margin-bottom:13px !important;
      }

      .email-text {
        font-size:14px !important;
        line-height:1.65 !important;
      }

      /*
        IMPORTANT:
        Status + Order ID remain in ONE ROW.
        They will NOT become columns.
      */

      .status-order-box {
        margin-top:20px !important;
        padding:11px !important;
        border-radius:10px !important;
      }

      .status-cell {
        width:59% !important;
        padding-right:8px !important;
      }

      .order-id-cell {
        width:41% !important;
        padding-left:9px !important;
        border-left:1px solid #cfe5d6 !important;
      }

      .status-icon {
        width:29px !important;
        height:29px !important;
        line-height:29px !important;
        font-size:16px !important;
      }

      .status-title {
        font-size:12px !important;
      }

      .status-subtitle {
        margin-top:2px !important;
        font-size:10px !important;
      }

      .order-label {
        font-size:9px !important;
        letter-spacing:.5px !important;
      }

      .order-id {
        margin-top:3px !important;
        font-size:14px !important;
        white-space:nowrap !important;
      }

      .section {
        margin-top:22px !important;
      }

      .section-title {
        margin-bottom:10px !important;
        font-size:16px !important;
      }

      .items-table th {
        padding:9px 5px !important;
        font-size:11px !important;
      }

      .items-table td {
        padding:10px 5px !important;
      }

      .items-table td div {
        font-size:12px !important;
        line-height:1.4 !important;
      }

      .items-table td:nth-child(2) {
        font-size:12px !important;
      }

      .items-table td:nth-child(3) {
        font-size:12px !important;
      }

      .summary-box {
        margin-top:22px !important;
        padding:14px !important;
      }

      .summary-table td {
        font-size:13px !important;
        padding:4px 0 !important;
      }

      .grand-total td {
        padding-top:12px !important;
        font-size:16px !important;
      }

      .grand-total .total-price {
        font-size:18px !important;
      }

      .address-box {
        margin-top:20px !important;
        padding:14px !important;
      }

      .address-title {
        font-size:15px !important;
      }

      .address-text {
        font-size:12px !important;
      }

      .payment-box {
        margin-top:14px !important;
        padding:12px 13px !important;
      }

      .payment-value {
        font-size:13px !important;
      }

      .next-box {
        margin-top:16px !important;
        padding:13px !important;
      }

      .next-title {
        font-size:13px !important;
      }

      .next-text {
        font-size:12px !important;
      }

      .email-footer {
        padding:18px 12px !important;
      }

    }

  </style>

</head>


<body>

  <div class="email-wrapper">

    <div class="email-container">


      <!-- HEADER -->

      <div class="email-header">

        <div class="email-logo">
          MineKart
        </div>

        <div
          style="
            margin-top:6px;
            font-size:13px;
            color:#eeeae4;
            line-height:1.5;
          "
        >
          Your trusted shopping destination
        </div>

      </div>


      <!-- CONTENT -->

      <div class="email-content">


        <!-- TITLE -->

        <h1 class="email-title">
          Order Placed Successfully! 🛍️
        </h1>


        <!-- GREETING -->

        <p
          class="email-text"
          style="margin:0 0 7px;"
        >
          Hi ${name || 'Customer'},
        </p>


        <p
          class="email-text"
          style="margin:0;"
        >
          Thank you for shopping with MineKart.
          We have successfully received your order.
        </p>


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

              <!-- STATUS -->

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
                        width:37px;
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


              <!-- ORDER ID -->

              <td class="order-id-cell">

                <div class="order-label">
                  Order
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

                ${Number(deliveryCharge) === 0 ? '<span style="color:#3e8b62;font-weight:800;">FREE</span>' : formatPrice(deliveryCharge)}

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

          <h3 class="address-title">
            Delivery Address
          </h3>

          <p class="address-text">

            <strong style="color:#3f3a35;">
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

          <div class="payment-label">
            Payment Method
          </div>

          <div class="payment-value">
            ${paymentText}
          </div>

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
            margin:10px 0 0;
            font-size:13px;
          "
        >
          Happy Shopping! 🛍️
        </p>


      </div>


      <!-- FOOTER -->

      <div class="email-footer">

        <p class="footer-text">
          This is an automated email.
          Please do not reply directly.
        </p>

        <p class="footer-brand">
          © ${new Date().getFullYear()} MineKart
        </p>

      </div>


    </div>

  </div>

</body>
</html>
`
}
