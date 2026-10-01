const orderConfirmationEmail = ({ name, orderId, items, subtotal, deliveryCharge, tax, totalAmount, paymentMethod, shippingAddress }) => {
  const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`

  const itemRows = (items || [])
    .map(
      (item) => `
        <tr>
          <td style="padding:13px 8px;border-bottom:1px solid #e7e0d8;vertical-align:middle;">
            <div style="font-size:14px;font-weight:700;color:#3f3a35;line-height:1.45;word-break:break-word;">
              ${item.productName || 'Product'}
            </div>
          </td>

          <td style="padding:13px 5px;border-bottom:1px solid #e7e0d8;text-align:center;vertical-align:middle;font-size:14px;color:#6b6258;white-space:nowrap;">
            ${item.quantity || 0}
          </td>

          <td style="padding:13px 8px;border-bottom:1px solid #e7e0d8;text-align:right;vertical-align:middle;font-size:14px;font-weight:800;color:#3f3a35;white-space:nowrap;">
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

  <title>Order Confirmed - MineKart</title>

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

    img {
      border:0;
      display:block;
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
        padding:22px 15px !important;
      }

      .email-logo {
        font-size:27px !important;
      }

      .email-content {
        padding:22px 15px !important;
      }

      .email-title {
        font-size:23px !important;
        line-height:1.3 !important;
      }

      .email-text {
        font-size:14px !important;
      }

      /*
        IMPORTANT:
        Status + Order ID stay in one row on mobile.
        Do NOT make these display:block.
      */

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
        font-size:17px !important;
      }

      .status-title {
        font-size:12px !important;
      }

      .status-subtitle {
        font-size:10px !important;
      }

      .order-label {
        font-size:9px !important;
      }

      .order-id {
        font-size:14px !important;
        word-break:break-word !important;
      }

      .section-title {
        font-size:17px !important;
      }

      .items-table {
        font-size:12px !important;
      }

      .items-table th {
        padding:10px 5px !important;
        font-size:11px !important;
      }

      .items-table td {
        padding:11px 5px !important;
      }

      .product-name {
        font-size:12px !important;
      }

      .qty-cell {
        font-size:12px !important;
      }

      .price-cell {
        font-size:12px !important;
      }

      .address-box {
        padding:15px !important;
      }

      .address-title {
        font-size:15px !important;
      }

      .address-text {
        font-size:13px !important;
      }

      .summary-box {
        padding:15px !important;
      }

      .summary-table td {
        padding:5px 0 !important;
        font-size:13px !important;
      }

      .grand-total-label {
        font-size:16px !important;
      }

      .grand-total-price {
        font-size:18px !important;
      }

      .payment-box {
        padding:14px !important;
      }

      .next-box {
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
        style="padding:28px 25px;text-align:center;background:#6b6258;"
      >

        <div
          class="email-logo"
          style="font-size:31px;font-weight:800;letter-spacing:-.5px;color:#ffffff;"
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
        style="padding:32px;"
      >

        <!-- TITLE -->

        <h1
          class="email-title"
          style="margin:0 0 14px;font-size:27px;line-height:1.3;color:#3f3a35;font-weight:800;"
        >
          Order Confirmed! 🎉
        </h1>


        <!-- GREETING -->

        <p
          class="email-text"
          style="margin:0 0 7px;font-size:16px;line-height:1.6;color:#5f5a55;"
        >
          Hi ${name || 'Customer'},
        </p>


        <p
          class="email-text"
          style="margin:0;font-size:14px;line-height:1.7;color:#756c65;"
        >
          Thank you for shopping with MineKart.
          Your order has been successfully confirmed.
        </p>


        <!-- ================================= -->
        <!-- CONFIRMED + ORDER ID -->
        <!-- ================================= -->

        <div
          class="status-order-box"
          style="margin-top:24px;padding:16px;background:#eef7f1;border:1px solid #cfe5d6;border-radius:14px;"
        >

          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="width:100%;table-layout:fixed;"
          >

            <tr>

              <!-- STATUS -->

              <td
                class="status-cell"
                style="width:60%;vertical-align:middle;padding-right:14px;"
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
                        style="width:32px;height:32px;line-height:32px;text-align:center;border-radius:50%;background:#3e8b62;color:#ffffff;font-size:18px;font-weight:800;"
                      >
                        ✓
                      </div>

                    </td>

                    <td
                      style="vertical-align:middle;"
                    >

                      <div
                        class="status-title"
                        style="font-size:14px;font-weight:800;color:#3e8b62;white-space:nowrap;"
                      >
                        Order confirmed
                      </div>

                      <div
                        class="status-subtitle"
                        style="margin-top:3px;font-size:12px;line-height:1.4;color:#5f6f63;"
                      >
                        Your order is being processed
                      </div>

                    </td>

                  </tr>

                </table>

              </td>


              <!-- ORDER ID -->

              <td
                class="order-id-cell"
                style="width:40%;vertical-align:middle;border-left:1px solid #cfe5d6;padding-left:16px;"
              >

                <div
                  class="order-label"
                  style="font-size:10px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:#6b6258;"
                >
                  Order ID
                </div>

                <div
                  class="order-id"
                  style="margin-top:4px;font-size:17px;font-weight:800;color:#3f3a35;word-break:break-word;"
                >
                  ${orderId}
                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- ================================= -->
        <!-- ORDER ITEMS -->
        <!-- ================================= -->

        <div
          style="margin-top:28px;"
        >

          <h2
            class="section-title"
            style="margin:0 0 12px;font-size:18px;color:#3f3a35;font-weight:800;"
          >
            Order Items
          </h2>


          <table
            class="items-table"
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="width:100%;border-collapse:collapse;table-layout:fixed;"
          >

            <thead>

              <tr
                style="background:#f5f2ed;"
              >

                <th
                  style="width:58%;padding:12px 8px;text-align:left;color:#514a45;font-size:12px;font-weight:800;"
                >
                  Product
                </th>

                <th
                  style="width:17%;padding:12px 5px;text-align:center;color:#514a45;font-size:12px;font-weight:800;"
                >
                  Qty
                </th>

                <th
                  style="width:25%;padding:12px 8px;text-align:right;color:#514a45;font-size:12px;font-weight:800;"
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


        <!-- ================================= -->
        <!-- ORDER SUMMARY -->
        <!-- ================================= -->

        <div
          class="summary-box"
          style="margin-top:25px;padding:18px;background:#fbfaf7;border:1px solid #e4ddd5;border-radius:12px;"
        >

          <h2
            class="section-title"
            style="margin:0 0 12px;font-size:17px;color:#3f3a35;font-weight:800;"
          >
            Order Summary
          </h2>


          <table
            class="summary-table"
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="width:100%;border-collapse:collapse;"
          >

            <tr>

              <td
                style="padding:5px 0;font-size:14px;color:#716861;"
              >
                Subtotal
              </td>

              <td
                style="padding:5px 0;text-align:right;font-size:14px;font-weight:700;color:#3f3a35;white-space:nowrap;"
              >
                ${formatPrice(subtotal)}
              </td>

            </tr>


            <tr>

              <td
                style="padding:5px 0;font-size:14px;color:#716861;"
              >
                Delivery
              </td>

              <td
                style="padding:5px 0;text-align:right;font-size:14px;font-weight:700;color:#3f3a35;white-space:nowrap;"
              >
                ${Number(deliveryCharge) === 0 ? '<span style="color:#3e8b62;">FREE</span>' : formatPrice(deliveryCharge)}
              </td>

            </tr>


            <tr>

              <td
                style="padding:5px 0;font-size:14px;color:#716861;"
              >
                Tax
              </td>

              <td
                style="padding:5px 0;text-align:right;font-size:14px;font-weight:700;color:#3f3a35;white-space:nowrap;"
              >
                ${formatPrice(tax)}
              </td>

            </tr>


            <!-- GRAND TOTAL -->

            <tr>

              <td
                colspan="2"
                style="padding:0;"
              >

                <div
                  style="margin-top:13px;padding-top:14px;border-top:1px solid #e3dcd4;"
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
                        class="grand-total-label"
                        style="font-size:17px;font-weight:800;color:#3f3a35;"
                      >
                        Grand Total
                      </td>

                      <td
                        class="grand-total-price"
                        style="text-align:right;font-size:20px;font-weight:800;color:#8e181f;white-space:nowrap;"
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


        <!-- ================================= -->
        <!-- DELIVERY ADDRESS -->
        <!-- ================================= -->

        <div
          class="address-box"
          style="margin-top:22px;padding:18px;background:#ffffff;border:1px solid #e3ded6;border-radius:12px;"
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
                  style="width:28px;height:28px;line-height:28px;text-align:center;border-radius:50%;background:#eeeae4;color:#6b6258;font-size:13px;font-weight:800;"
                >
                  ●
                </div>

              </td>

              <td
                style="vertical-align:top;"
              >

                <h3
                  class="address-title"
                  style="margin:0 0 9px;color:#3f3a35;font-size:16px;font-weight:800;"
                >
                  Delivery Address
                </h3>

                <p
                  class="address-text"
                  style="margin:0;line-height:1.7;color:#6b6258;font-size:13px;word-break:break-word;"
                >

                  <strong
                    style="color:#3f3a35;"
                  >
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


        <!-- ================================= -->
        <!-- PAYMENT -->
        <!-- ================================= -->

        <div
          class="payment-box"
          style="margin-top:18px;padding:15px;background:#f7f4ef;border:1px solid #e5ded6;border-radius:10px;"
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
                style="width:36px;vertical-align:middle;"
              >

                <div
                  style="width:28px;height:28px;line-height:28px;text-align:center;border-radius:50%;background:#e9e4dc;color:#6b6258;font-size:13px;font-weight:800;"
                >
                  ₹
                </div>

              </td>

              <td
                style="vertical-align:middle;"
              >

                <div
                  style="font-size:11px;color:#8a8179;"
                >
                  Payment Method
                </div>

                <div
                  style="margin-top:2px;font-size:14px;font-weight:800;color:#3f3a35;"
                >
                  ${paymentText}
                </div>

              </td>

            </tr>

          </table>

        </div>


        <!-- ================================= -->
        <!-- WHAT'S NEXT -->
        <!-- ================================= -->

        <div
          class="next-box"
          style="margin-top:20px;padding:15px;background:#fff6f5;border-left:4px solid #a51d26;border-radius:9px;"
        >

          <div
            style="font-size:13px;font-weight:800;color:#8e181f;"
          >
            What's next?
          </div>

          <div
            style="margin-top:5px;font-size:12px;line-height:1.65;color:#6b6258;"
          >
            Your order is now confirmed and our team is preparing it.
            We will keep you updated as your order moves through each stage.
          </div>

        </div>


        <!-- CLOSING -->

        <p
          class="email-text"
          style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#756c65;"
        >
          Thank you for choosing MineKart.
        </p>

        <p
          class="email-text"
          style="margin:8px 0 0;font-size:13px;color:#756c65;"
        >
          Happy Shopping! 🛍️
        </p>

      </div>


      <!-- ================================= -->
      <!-- FOOTER -->
      <!-- ================================= -->

      <div
        class="email-footer"
        style="padding:23px 25px;text-align:center;background:#f7f4ef;border-top:1px solid #e3ded6;"
      >

        <p
          style="margin:0;font-size:12px;line-height:1.5;color:#938980;"
        >
          This is an automated email.
          Please do not reply directly.
        </p>

        <p
          style="margin:7px 0 0;font-size:13px;font-weight:800;color:#6b6258;"
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

module.exports = { orderConfirmationEmail }
