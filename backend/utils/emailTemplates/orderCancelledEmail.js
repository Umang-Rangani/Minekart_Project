const orderCancelledEmail = ({ name, orderId, items, subtotal, deliveryCharge, tax, totalAmount, paymentMethod, shippingAddress, cancellationReason, cancelledBy }) => {
  const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`

  const itemRows = (items || [])
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding:13px 8px;
              border-bottom:1px solid #e7e0d8;
              vertical-align:middle;
            "
          >
            <div
              style="
                font-size:13px;
                font-weight:700;
                line-height:1.45;
                color:#3f3a35;
                word-break:break-word;
              "
            >
              ${item.productName || 'Product'}
            </div>

            ${
              item.size
                ? `
                  <div
                    style="
                      margin-top:3px;
                      font-size:11px;
                      color:#8a8179;
                    "
                  >
                    Size: ${item.size}
                  </div>
                `
                : ''
            }
          </td>

          <td
            style="
              padding:13px 5px;
              border-bottom:1px solid #e7e0d8;
              text-align:center;
              vertical-align:middle;
              font-size:13px;
              font-weight:700;
              color:#6b6258;
              white-space:nowrap;
            "
          >
            ${item.quantity || 0}
          </td>

          <td
            style="
              padding:13px 7px;
              border-bottom:1px solid #e7e0d8;
              text-align:right;
              vertical-align:middle;
              font-size:13px;
              font-weight:800;
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

  const cancelledByText = cancelledBy === 'Admin' ? 'Cancelled by MineKart Admin' : `Cancelled by ${name || 'You'}`

  const cancellationText = cancellationReason?.trim() || 'This order was cancelled by MineKart. No additional details are available at this time.'

  const paymentText = paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online on Delivery'

  const paymentInfo = paymentMethod === 'COD' ? 'No payment refund is required because this order was placed with Cash on Delivery.' : 'If any payment was already processed, the applicable refund will be handled according to MineKart payment policy.'

  return `
<!DOCTYPE html>
<html>
<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <meta
    name="format-detection"
    content="telephone=no"
  />

  <title>Order Cancelled - MineKart</title>

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
      background:#f3f0ec;
      font-family:Arial,Helvetica,sans-serif;
      color:#292725;
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

    .email-wrapper {
      width:100%;
      padding:32px 14px;
      background:#f3f0ec;
    }

    .email-container {
      width:100%;
      max-width:680px;
      margin:0 auto;
      background:#ffffff;
      border:1px solid #e1dbd4;
      border-radius:18px;
      overflow:hidden;
    }

    .email-content {
      padding:32px;
    }

    .email-header {
      padding:27px 24px;
      background:#625b53;
      text-align:center;
    }

    .email-logo {
      font-size:30px;
      line-height:1;
      font-weight:800;
      letter-spacing:-0.6px;
      color:#ffffff;
    }

    .email-title {
      margin:0;
      font-size:29px;
      line-height:1.25;
      font-weight:800;
      color:#342f2c;
    }

    .email-text {
      font-size:15px;
      line-height:1.65;
      color:#706861;
    }

    .status-order-box {
      width:100%;
      margin-top:24px;
      padding:17px;
      background:#fff7f5;
      border:1px solid #ead9d4;
      border-radius:14px;
    }

    .status-cell {
      width:58%;
      vertical-align:middle;
      padding-right:16px;
    }

    .order-id-cell {
      width:42%;
      vertical-align:middle;
      padding-left:17px;
      border-left:1px solid #ead9d4;
    }

    .status-icon {
      width:34px;
      height:34px;
      line-height:32px;
      text-align:center;
      border-radius:50%;
      background:#a44a3f;
      color:#ffffff;
      font-size:22px;
      font-weight:700;
    }

    .reason-box {
      width:100%;
      margin-top:18px;
      padding:16px 17px;
      background:#fffaf8;
      border:1px solid #eadfd8;
      border-left:4px solid #a44a3f;
      border-radius:11px;
    }

    .reason-icon {
      width:28px;
      height:28px;
      line-height:28px;
      text-align:center;
      border-radius:50%;
      background:#f2e5e2;
      color:#a44a3f;
      font-size:15px;
      font-weight:800;
    }

    .section {
      margin-top:27px;
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
      background:#f3f0eb;
      color:#514a45;
      font-size:12px;
      font-weight:800;
    }

    .summary-box {
      margin-top:24px;
      padding:18px;
      background:#faf9f6;
      border:1px solid #e3ddd6;
      border-radius:12px;
    }

    .summary-table {
      width:100%;
      border-collapse:collapse;
    }

    .summary-table td {
      padding:5px 0;
      font-size:13px;
      color:#716861;
    }

    .address-box {
      margin-top:20px;
      padding:18px;
      background:#ffffff;
      border:1px solid #e2ddd6;
      border-radius:12px;
    }

    .payment-box {
      margin-top:15px;
      padding:15px;
      background:#f7f4ef;
      border:1px solid #e5ded6;
      border-radius:10px;
    }

    .info-box {
      margin-top:15px;
      padding:15px;
      background:#f4f7f4;
      border:1px solid #dce7df;
      border-left:4px solid #6b6258;
      border-radius:10px;
    }

    .support-box {
      margin-top:20px;
      padding:15px;
      background:#f7f4f0;
      border-radius:10px;
      text-align:center;
    }

    .email-footer {
      padding:22px 24px;
      background:#f5f2ed;
      border-top:1px solid #e3ded6;
      text-align:center;
    }


    /* ========================================= */
    /* MOBILE */
    /* ========================================= */

    @media only screen and (max-width:620px) {

      .email-wrapper {
        padding:10px 6px !important;
      }

      .email-container {
        width:100% !important;
        max-width:none !important;
        border-radius:12px !important;
      }

      .email-header {
        padding:22px 14px !important;
      }

      .email-logo {
        font-size:27px !important;
      }

      .email-content {
        padding:22px 15px !important;
      }

      .email-title {
        font-size:25px !important;
      }

      .email-text {
        font-size:14px !important;
      }


      /* KEEP STATUS + ORDER ID IN ONE ROW */

      .status-order-box {
        padding:13px !important;
        margin-top:20px !important;
      }

      .status-cell {
        width:58% !important;
        padding-right:9px !important;
      }

      .order-id-cell {
        width:42% !important;
        padding-left:10px !important;
        border-left:1px solid #ead9d4 !important;
        border-top:0 !important;
      }

      .status-icon {
        width:29px !important;
        height:29px !important;
        line-height:27px !important;
        font-size:19px !important;
      }

      .status-icon-cell {
        width:36px !important;
      }

      .cancel-title {
        font-size:12px !important;
      }

      .cancel-by {
        margin-top:2px !important;
        font-size:10px !important;
        line-height:1.35 !important;
      }

      .order-label {
        font-size:9px !important;
        letter-spacing:.7px !important;
      }

      .order-id {
        margin-top:4px !important;
        font-size:15px !important;
      }


      /* REASON */

      .reason-box {
        padding:14px !important;
        margin-top:15px !important;
      }

      .reason-icon {
        width:27px !important;
        height:27px !important;
        line-height:27px !important;
      }

      .reason-title {
        font-size:12px !important;
      }

      .reason-text {
        font-size:12px !important;
        line-height:1.55 !important;
      }


      /* SECTIONS */

      .section {
        margin-top:23px !important;
      }

      .section-title {
        font-size:17px !important;
      }


      /* ITEMS */

      .items-table th {
        padding:10px 6px !important;
        font-size:11px !important;
      }

      .items-table td {
        padding:11px 6px !important;
      }

      .product-name {
        font-size:12px !important;
      }

      .product-size {
        font-size:10px !important;
      }

      .item-qty,
      .item-total {
        font-size:12px !important;
      }


      /* SUMMARY */

      .summary-box {
        padding:15px !important;
        margin-top:21px !important;
      }

      .summary-table td {
        font-size:13px !important;
      }

      .grand-total-label {
        font-size:16px !important;
      }

      .grand-total-price {
        font-size:18px !important;
      }


      /* ADDRESS */

      .address-box {
        padding:15px !important;
        margin-top:18px !important;
      }

      .address-title {
        font-size:15px !important;
      }

      .address-text {
        font-size:12px !important;
      }


      /* PAYMENT */

      .payment-box {
        padding:13px !important;
      }

      .payment-label {
        font-size:11px !important;
      }

      .payment-value {
        font-size:13px !important;
      }


      /* INFO */

      .info-box {
        padding:13px !important;
      }

      .info-title {
        font-size:12px !important;
      }

      .info-text {
        font-size:11px !important;
      }


      /* SUPPORT */

      .support-box {
        padding:14px !important;
      }

      .support-title {
        font-size:12px !important;
      }

      .support-text {
        font-size:11px !important;
      }


      /* FOOTER */

      .email-footer {
        padding:19px 14px !important;
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
            margin-top:7px;
            font-size:12px;
            line-height:1.5;
            color:#eeeae4;
          "
        >
          Your trusted shopping destination
        </div>

      </div>


      <!-- CONTENT -->

      <div class="email-content">


        <!-- TITLE -->

        <h1 class="email-title">
          Order Cancelled
        </h1>


        <!-- GREETING -->

        <p
          class="email-text"
          style="margin:13px 0 5px;"
        >
          Hi ${name || 'Customer'},
        </p>

        <p
          class="email-text"
          style="margin:0;"
        >
          Your MineKart order has been cancelled.
          Here are the complete details of your cancelled order.
        </p>


        <!-- STATUS + ORDER ID -->

        <div class="status-order-box">

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="width:100%;"
          >

            <tr>

              <!-- STATUS -->

              <td class="status-cell">

                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="100%"
                  style="width:100%;"
                >

                  <tr>

                    <td
                      class="status-icon-cell"
                      style="
                        width:42px;
                        vertical-align:middle;
                      "
                    >

                      <div class="status-icon">
                        ×
                      </div>

                    </td>

                    <td
                      style="
                        vertical-align:middle;
                        padding-left:3px;
                      "
                    >

                      <div
                        class="cancel-title"
                        style="
                          font-size:14px;
                          font-weight:800;
                          color:#a44a3f;
                        "
                      >
                        Order cancelled
                      </div>

                      <div
                        class="cancel-by"
                        style="
                          margin-top:3px;
                          font-size:11px;
                          line-height:1.4;
                          color:#79625d;
                        "
                      >
                        ${cancelledByText}
                      </div>

                    </td>

                  </tr>

                </table>

              </td>


              <!-- ORDER ID -->

              <td class="order-id-cell">

                <div
                  class="order-label"
                  style="
                    font-size:10px;
                    font-weight:800;
                    letter-spacing:1px;
                    text-transform:uppercase;
                    color:#8a8179;
                  "
                >
                  Order ID
                </div>

                <div
                  class="order-id"
                  style="
                    margin-top:5px;
                    font-size:17px;
                    font-weight:800;
                    color:#3f3a35;
                    word-break:break-word;
                  "
                >
                  ${orderId}
                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- CANCELLATION REASON -->

        <div class="reason-box">

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="width:100%;"
          >

            <tr>

              <td
                style="
                  width:36px;
                  vertical-align:top;
                "
              >

                <div class="reason-icon">
                  !
                </div>

              </td>

              <td
                style="
                  vertical-align:top;
                  padding-left:1px;
                "
              >

                <div
                  class="reason-title"
                  style="
                    font-size:13px;
                    font-weight:800;
                    color:#8e181f;
                  "
                >
                  Cancellation Reason
                </div>

                <div
                  class="reason-text"
                  style="
                    margin-top:5px;
                    font-size:13px;
                    line-height:1.6;
                    color:#6b6258;
                    word-break:break-word;
                  "
                >
                  ${cancellationText}
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

                <th
                  style="
                    width:58%;
                    text-align:left;
                  "
                >
                  Product
                </th>

                <th
                  style="
                    width:17%;
                    text-align:center;
                  "
                >
                  Qty
                </th>

                <th
                  style="
                    width:25%;
                    text-align:right;
                  "
                >
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

              <td
                style="
                  text-align:right;
                  font-weight:700;
                  color:#3f3a35;
                "
              >
                ${formatPrice(subtotal)}
              </td>

            </tr>

            <tr>

              <td>
                Delivery
              </td>

              <td
                style="
                  text-align:right;
                  font-weight:700;
                  color:#3f3a35;
                "
              >
                ${Number(deliveryCharge) === 0 ? '<span style="color:#3e8b62;">FREE</span>' : formatPrice(deliveryCharge)}
              </td>

            </tr>

            <tr>

              <td>
                Tax
              </td>

              <td
                style="
                  text-align:right;
                  font-weight:700;
                  color:#3f3a35;
                "
              >
                ${formatPrice(tax)}
              </td>

            </tr>

            <tr>

              <td
                colspan="2"
                style="padding:0;"
              >

                <div
                  style="
                    margin-top:12px;
                    padding-top:13px;
                    border-top:1px solid #e3dcd4;
                  "
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
                        style="
                          font-size:17px;
                          font-weight:800;
                          color:#3f3a35;
                        "
                      >
                        Grand Total
                      </td>

                      <td
                        class="grand-total-price"
                        style="
                          text-align:right;
                          font-size:20px;
                          font-weight:800;
                          color:#8e181f;
                          white-space:nowrap;
                        "
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
                  width:36px;
                  vertical-align:top;
                "
              >

                <div
                  style="
                    width:28px;
                    height:28px;
                    line-height:28px;
                    text-align:center;
                    border-radius:50%;
                    background:#eeeae4;
                    color:#6b6258;
                    font-size:13px;
                  "
                >
                  ●
                </div>

              </td>

              <td
                style="
                  vertical-align:top;
                  padding-left:1px;
                "
              >

                <h3
                  class="address-title"
                  style="
                    margin:0 0 9px;
                    font-size:16px;
                    font-weight:800;
                    color:#3f3a35;
                  "
                >
                  Delivery Address
                </h3>

                <p
                  class="address-text"
                  style="
                    margin:0;
                    font-size:13px;
                    line-height:1.7;
                    color:#6b6258;
                    word-break:break-word;
                  "
                >

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

              </td>

            </tr>

          </table>

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
                  width:36px;
                  vertical-align:middle;
                "
              >

                <div
                  style="
                    width:28px;
                    height:28px;
                    line-height:28px;
                    text-align:center;
                    border-radius:50%;
                    background:#e9e4dc;
                    color:#6b6258;
                    font-size:13px;
                    font-weight:800;
                  "
                >
                  ₹
                </div>

              </td>

              <td
                style="
                  vertical-align:middle;
                "
              >

                <div
                  class="payment-label"
                  style="
                    font-size:11px;
                    color:#8a8179;
                  "
                >
                  Payment Method
                </div>

                <div
                  class="payment-value"
                  style="
                    margin-top:2px;
                    font-size:14px;
                    font-weight:800;
                    color:#3f3a35;
                  "
                >
                  ${paymentText}
                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- PAYMENT INFO -->

        <div class="info-box">

          <div
            class="info-title"
            style="
              font-size:13px;
              font-weight:800;
              color:#4e5b52;
            "
          >
            Payment & Refund Information
          </div>

          <div
            class="info-text"
            style="
              margin-top:5px;
              font-size:12px;
              line-height:1.65;
              color:#6b756e;
            "
          >
            ${paymentInfo}
          </div>

        </div>


        <!-- SUPPORT -->

        <div class="support-box">

          <div
            class="support-title"
            style="
              font-size:13px;
              font-weight:700;
              color:#5f574f;
            "
          >
            Need help with this cancellation?
          </div>

          <div
            class="support-text"
            style="
              margin-top:4px;
              font-size:12px;
              line-height:1.6;
              color:#81776e;
            "
          >
            Please contact MineKart support for assistance.
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
          Thank you for shopping with MineKart.
        </p>


      </div>


      <!-- FOOTER -->

      <div class="email-footer">

        <p
          style="
            margin:0;
            font-size:11px;
            line-height:1.5;
            color:#938980;
          "
        >
          This is an automated email. Please do not reply directly.
        </p>

        <p
          style="
            margin:7px 0 0;
            font-size:12px;
            font-weight:800;
            color:#6b6258;
          "
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

module.exports = { orderCancelledEmail }
