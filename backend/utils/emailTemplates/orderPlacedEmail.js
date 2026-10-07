const { emailLayout } = require('./emailLayout')

const orderPlacedEmail = ({ name, orderId, items, subtotal, deliveryCharge, tax, totalAmount, paymentMethod, shippingAddress }) => {
  const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`

  const itemRows = (items || [])
    .map((item) => {
      const productName = String(item.productName || 'Product')

      const displayName = productName.length > 55 ? `${productName.slice(0, 55).trimEnd()}...` : productName

      return `
        <tr>
          <td
            style="
              width:57%;
              padding:12px 8px;
              border-bottom:1px solid #E8DDD4;
              vertical-align:middle;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            <div
              style="
                color:#35231F;
                font-size:12px;
                line-height:18px;
                font-weight:800;
                word-break:break-word;
                font-family:Arial,Helvetica,sans-serif;
              "
            >
              ${displayName}
            </div>
          </td>

          <td
            align="center"
            style="
              width:16%;
              padding:12px 4px;
              border-bottom:1px solid #E8DDD4;
              vertical-align:middle;
              color:#806C63;
              font-size:12px;
              line-height:18px;
              font-weight:700;
              white-space:nowrap;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            ${item.quantity || 0}
          </td>

          <td
            align="right"
            style="
              width:27%;
              padding:12px 8px;
              border-bottom:1px solid #E8DDD4;
              vertical-align:middle;
              color:#35231F;
              font-size:12px;
              line-height:18px;
              font-weight:900;
              white-space:nowrap;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            ${formatPrice(item.totalPrice)}
          </td>
        </tr>
      `
    })
    .join('')

  const paymentText = paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online on Delivery'

  const orderSuccessUrl =
    `https://minekart.vercel.app/order-success` +
    `?orderId=${encodeURIComponent(orderId)}` +
    `&paymentMethod=${encodeURIComponent(paymentMethod)}` +
    `&paymentStatus=Pending` +
    `&orderStatus=Pending` +
    `&totalAmount=${encodeURIComponent(totalAmount)}`

  const content = `
    <!-- Greeting -->

    <p
      style="
        margin:0;
        color:#35231F;
        font-size:14px;
        line-height:22px;
        font-weight:800;
        font-family:Arial,Helvetica,sans-serif;
      "
    >
      Hi ${name || 'Customer'},
    </p>

    <p
      style="
        margin:8px 0 0;
        color:#806C63;
        font-size:13px;
        line-height:21px;
        font-family:Arial,Helvetica,sans-serif;
      "
    >
      Thank you for shopping with MineKart. We have successfully received
      your order and will keep you updated about its status.
    </p>


    <!-- Order Status -->

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        margin-top:20px;
        background:#FFF8F5;
        border:1px solid #EAD9D2;
        border-radius:12px;
      "
    >
      <tr>

        <td
          width="58%"
          style="
            width:58%;
            padding:13px 11px;
            vertical-align:middle;
            font-family:Arial,Helvetica,sans-serif;
          "
        >
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
          >
            <tr>

              <td
                width="38"
                style="
                  width:38px;
                  vertical-align:middle;
                  font-family:Arial,Helvetica,sans-serif;
                "
              >
                <div
                  style="
                    width:30px;
                    height:30px;
                    line-height:30px;
                    text-align:center;
                    border-radius:50%;
                    background:#8E181F;
                    color:#FFFFFF;
                    font-size:15px;
                    font-weight:900;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  ✓
                </div>
              </td>

              <td style="vertical-align:middle;">

                <div
                  style="
                    color:#8E181F;
                    font-size:12px;
                    line-height:17px;
                    font-weight:900;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  Order received
                </div>

                <div
                  style="
                    margin-top:2px;
                    color:#806C63;
                    font-size:9px;
                    line-height:14px;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  Waiting for confirmation
                </div>

              </td>

            </tr>
          </table>
        </td>

        <td
          width="42%"
          style="
            width:42%;
            padding:13px 11px 13px 12px;
            vertical-align:middle;
            border-left:1px solid #EAD9D2;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <div
            style="
              color:#A08D84;
              font-size:8px;
              line-height:12px;
              font-weight:900;
              letter-spacing:.7px;
              text-transform:uppercase;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            Order ID
          </div>

          <div
            style="
              margin-top:4px;
              color:#35231F;
              font-size:12px;
              line-height:17px;
              font-weight:900;
              word-break:break-word;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            ${orderId}
          </div>

        </td>

      </tr>
    </table>


    <!-- Order Items -->

    <div style="margin-top:24px;">

      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
      >
        <tr>

          <td
            style="
              vertical-align:middle;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            <div
              style="
                color:#35231F;
                font-size:17px;
                line-height:22px;
                font-weight:900;
                font-family:Arial,Helvetica,sans-serif;
              "
            >
              Order Items
            </div>

            <div
              style="
                margin-top:2px;
                color:#A08D84;
                font-size:9px;
                line-height:14px;
                font-family:Arial,Helvetica,sans-serif;
              "
            >
              Products included in your order
            </div>
          </td>

        </tr>
      </table>


      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
          width:100%;
          margin-top:10px;
          table-layout:fixed;
          border:1px solid #E8DDD4;
          border-radius:11px;
          overflow:hidden;
        "
      >

        <thead>
          <tr>

            <th
              width="57%"
              align="left"
              style="
                width:57%;
                padding:10px 8px;
                background:#F8F1EC;
                color:#67544D;
                font-size:10px;
                line-height:14px;
                font-weight:900;
                font-family:Arial,Helvetica,sans-serif;
              "
            >
              Product
            </th>

            <th
              width="16%"
              align="center"
              style="
                width:16%;
                padding:10px 4px;
                background:#F8F1EC;
                color:#67544D;
                font-size:10px;
                line-height:14px;
                font-weight:900;
                font-family:Arial,Helvetica,sans-serif;
              "
            >
              Qty
            </th>

            <th
              width="27%"
              align="right"
              style="
                width:27%;
                padding:10px 8px;
                background:#F8F1EC;
                color:#67544D;
                font-size:10px;
                line-height:14px;
                font-weight:900;
                font-family:Arial,Helvetica,sans-serif;
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


    <!-- Order Summary -->

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        margin-top:20px;
        background:#FBF7F2;
        border:1px solid #E8DDD4;
        border-radius:11px;
      "
    >
      <tr>

        <td
          style="
            padding:15px;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
          >
            <tr>

              <td style="vertical-align:middle;">

                <div
                  style="
                    color:#35231F;
                    font-size:16px;
                    line-height:21px;
                    font-weight:900;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  Order Summary
                </div>

                <div
                  style="
                    margin-top:2px;
                    color:#A08D84;
                    font-size:9px;
                    line-height:14px;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  Payment breakdown
                </div>

              </td>

              <td
                align="right"
                style="
                  vertical-align:middle;
                  color:#9D2932;
                  font-size:16px;
                  line-height:21px;
                  font-weight:900;
                  white-space:nowrap;
                  font-family:Arial,Helvetica,sans-serif;
                "
              >
                ${formatPrice(totalAmount)}
              </td>

            </tr>
          </table>


          <div
            style="
              height:1px;
              margin:12px 0 8px;
              background:#E5D9D1;
              line-height:1px;
              font-size:1px;
            "
          >
            &nbsp;
          </div>


          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
          >

            <tr>

              <td
                style="
                  padding:4px 0;
                  color:#806C63;
                  font-size:12px;
                  line-height:18px;
                  font-family:Arial,Helvetica,sans-serif;
                "
              >
                Subtotal
              </td>

              <td
                align="right"
                style="
                  padding:4px 0;
                  color:#493631;
                  font-size:12px;
                  line-height:18px;
                  font-weight:800;
                  white-space:nowrap;
                  font-family:Arial,Helvetica,sans-serif;
                "
              >
                ${formatPrice(subtotal)}
              </td>

            </tr>


            <tr>

              <td
                style="
                  padding:4px 0;
                  color:#806C63;
                  font-size:12px;
                  line-height:18px;
                  font-family:Arial,Helvetica,sans-serif;
                "
              >
                Delivery
              </td>

              <td
                align="right"
                style="
                  padding:4px 0;
                  color:#493631;
                  font-size:12px;
                  line-height:18px;
                  font-weight:800;
                  white-space:nowrap;
                  font-family:Arial,Helvetica,sans-serif;
                "
              >
                ${Number(deliveryCharge) === 0 ? '<span style="color:#3E8B62;font-weight:900;">FREE</span>' : formatPrice(deliveryCharge)}
              </td>

            </tr>


            <tr>

              <td
                style="
                  padding:4px 0;
                  color:#806C63;
                  font-size:12px;
                  line-height:18px;
                  font-family:Arial,Helvetica,sans-serif;
                "
              >
                Tax
              </td>

              <td
                align="right"
                style="
                  padding:4px 0;
                  color:#493631;
                  font-size:12px;
                  line-height:18px;
                  font-weight:800;
                  white-space:nowrap;
                  font-family:Arial,Helvetica,sans-serif;
                "
              >
                ${formatPrice(tax)}
              </td>

            </tr>


            <tr>

              <td
                style="
                  padding:12px 0 2px;
                  border-top:1px solid #E5D9D1;
                  color:#35231F;
                  font-size:14px;
                  line-height:20px;
                  font-weight:900;
                  font-family:Arial,Helvetica,sans-serif;
                "
              >
                Grand Total
              </td>

              <td
                align="right"
                style="
                  padding:12px 0 2px;
                  border-top:1px solid #E5D9D1;
                  color:#9D2932;
                  font-size:18px;
                  line-height:22px;
                  font-weight:900;
                  white-space:nowrap;
                  font-family:Arial,Helvetica,sans-serif;
                "
              >
                ${formatPrice(totalAmount)}
              </td>

            </tr>

          </table>

        </td>

      </tr>
    </table>


    <!-- Delivery Address -->

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        margin-top:18px;
        background:#FFFFFF;
        border:1px solid #E8DDD4;
        border-radius:12px;
      "
    >
      <tr>

        <td
          style="
            padding:15px;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <!-- Address Header -->

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
          >
            <tr>

              <td
                width="42"
                style="
                  width:42px;
                  padding-right:10px;
                  vertical-align:middle;
                "
              >

                <div
                  style="
                    width:32px;
                    height:32px;
                    line-height:32px;
                    text-align:center;
                    border-radius:9px;
                    background:#F7EEE7;
                    color:#8E181F;
                    font-size:16px;
                    font-weight:900;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  &#x1F4CD;
                </div>

              </td>

              <td style="vertical-align:middle;">

                <div
                  style="
                    color:#35231F;
                    font-size:14px;
                    line-height:19px;
                    font-weight:900;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  Delivery Address
                </div>

                <div
                  style="
                    margin-top:2px;
                    color:#A08D84;
                    font-size:9px;
                    line-height:13px;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  Your order will be delivered here
                </div>

              </td>

            </tr>
          </table>


          <!-- Address Details -->

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              width:100%;
              margin-top:13px;
              background:#FBF7F2;
              border:1px solid #EDE2DB;
              border-radius:9px;
            "
          >
            <tr>

              <td
                style="
                  padding:13px;
                  vertical-align:top;
                  font-family:Arial,Helvetica,sans-serif;
                "
              >

                <div
                  style="
                    color:#35231F;
                    font-size:12px;
                    line-height:18px;
                    font-weight:900;
                    word-break:break-word;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  ${shippingAddress?.fullName || ''}
                </div>

                <div
                  style="
                    margin-top:4px;
                    color:#806C63;
                    font-size:11px;
                    line-height:18px;
                    word-break:break-word;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  ${shippingAddress?.addressLine || ''}
                </div>

                <div
                  style="
                    margin-top:1px;
                    color:#806C63;
                    font-size:11px;
                    line-height:18px;
                    word-break:break-word;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  ${shippingAddress?.city || ''}
                  ${shippingAddress?.state ? `, ${shippingAddress.state}` : ''}
                  ${shippingAddress?.pincode ? ` - ${shippingAddress.pincode}` : ''}
                </div>


                ${
                  shippingAddress?.phone
                    ? `
                      <div
                        style="
                          margin-top:8px;
                          padding-top:8px;
                          border-top:1px solid #E8DDD4;
                          color:#806C63;
                          font-size:10px;
                          line-height:16px;
                          font-family:Arial,Helvetica,sans-serif;
                        "
                      >
                        <span
                          style="
                            display:inline-block;
                            width:18px;
                            color:#8E181F;
                            font-weight:900;
                            font-family:Arial,Helvetica,sans-serif;
                          "
                        >
                          &#9742;
                        </span>

                        ${shippingAddress.phone}
                      </div>
                    `
                    : ''
                }

              </td>

            </tr>
          </table>

        </td>

      </tr>
    </table>


    <!-- Payment Method -->

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        margin-top:14px;
        background:#F8F3EF;
        border:1px solid #E8DDD4;
        border-radius:10px;
      "
    >
      <tr>

        <td
          width="42"
          style="
            width:42px;
            padding:13px 0 13px 14px;
            vertical-align:middle;
          "
        >

          <div
            style="
              width:28px;
              height:28px;
              line-height:28px;
              text-align:center;
              border-radius:8px;
              background:#EEE1DA;
              color:#8E181F;
              font-size:12px;
              font-weight:900;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            ₹
          </div>

        </td>

        <td
          style="
            padding:13px 14px 13px 7px;
            vertical-align:middle;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <div
            style="
              color:#9A857B;
              font-size:9px;
              line-height:13px;
              font-weight:700;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            Payment Method
          </div>

          <div
            style="
              margin-top:2px;
              color:#35231F;
              font-size:12px;
              line-height:17px;
              font-weight:900;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            ${paymentText}
          </div>

        </td>

      </tr>
    </table>


    <!-- What's Next -->

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        margin-top:15px;
        background:#FFF7F5;
        border:1px solid #EFD9D5;
        border-left:4px solid #9D2932;
        border-radius:9px;
      "
    >
      <tr>

        <td
          style="
            padding:13px;
            font-family:Arial,Helvetica,sans-serif;
          "
        >

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
          >
            <tr>

              <td
                width="27"
                style="
                  width:27px;
                  vertical-align:top;
                  padding-top:1px;
                "
              >

                <div
                  style="
                    width:20px;
                    height:20px;
                    line-height:20px;
                    text-align:center;
                    border-radius:50%;
                    background:#F2D9D6;
                    color:#9D2932;
                    font-size:11px;
                    font-weight:900;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  !
                </div>

              </td>

              <td style="vertical-align:top;">

                <div
                  style="
                    color:#8E181F;
                    font-size:12px;
                    line-height:17px;
                    font-weight:900;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  What's next?
                </div>

                <div
                  style="
                    margin-top:4px;
                    color:#806C63;
                    font-size:11px;
                    line-height:18px;
                    font-family:Arial,Helvetica,sans-serif;
                  "
                >
                  Our team will review and confirm your order.
                  You will receive another email once your order is confirmed.
                </div>

              </td>

            </tr>
          </table>

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
    margin-top:20px;
  "
>
  <tr>

    <td
      align="center"
      style="
        padding:0;
        font-family:Arial,Helvetica,sans-serif;
      "
    >

      <table
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
          margin:0 auto;
        "
      >
        <tr>

          <!-- View Order -->

          <td
            align="center"
            style="
              padding:0 5px;
            "
          >
            <a
              href="${orderSuccessUrl}"
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
              View Order&nbsp;&nbsp;→
            </a>
          </td>


          <!-- Continue Shopping -->

          <td
            align="center"
            style="
              padding:0 5px;
            "
          >
            <a
              href="https://minekart.vercel.app"
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
              Continue Shopping&nbsp;&nbsp;→
            </a>
          </td>

        </tr>
      </table>

    </td>

  </tr>
</table>


    <!-- Trust Row -->

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        margin-top:20px;
      "
    >
      <tr>

        <td
          align="center"
          style="
            padding:10px 5px;
            background:#FBF7F2;
            border:1px solid #E8DDD4;
            border-radius:9px;
            color:#806C63;
            font-size:9px;
            line-height:14px;
            font-weight:700;
            font-family:Arial,Helvetica,sans-serif;
          "
        >
          ✓ Genuine Products
          &nbsp;&nbsp;•&nbsp;&nbsp;
          ✓ Secure Shopping
          &nbsp;&nbsp;•&nbsp;&nbsp;
          ✓ Easy Returns
        </td>

      </tr>
    </table>


    <!-- Closing -->

    <p
      style="
        margin:20px 0 0;
        color:#806C63;
        font-size:12px;
        line-height:19px;
        font-family:Arial,Helvetica,sans-serif;
      "
    >
      We will keep you updated about your order status.
    </p>

    <p
      style="
        margin:7px 0 0;
        color:#806C63;
        font-size:12px;
        line-height:19px;
        font-family:Arial,Helvetica,sans-serif;
      "
    >
      Happy Shopping! 🛍️
    </p>
  `

  return emailLayout({
    preheader: `Your MineKart order ${orderId} has been received.`,
    eyebrow: 'Order Update',
    title: 'Order placed successfully',
    children: content,
    footerNote: 'Thank you for shopping with MineKart.',
  })
}

module.exports = { orderPlacedEmail }
