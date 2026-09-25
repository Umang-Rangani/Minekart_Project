export const orderConfirmationEmail = ({ name, orderId, items, subtotal, deliveryCharge, tax, totalAmount, paymentMethod, shippingAddress }) => {
  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e3ded6;">
            ${item.productName}
          </td>

          <td style="padding:12px;border-bottom:1px solid #e3ded6;text-align:center;">
            ${item.quantity}
          </td>

          <td style="padding:12px;border-bottom:1px solid #e3ded6;text-align:right;">
            ₹${Number(item.totalPrice).toLocaleString('en-IN')}
          </td>
        </tr>
      `,
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed - MineKart</title>
</head>

<body style="margin:0;padding:0;background:#f4f2ee;font-family:Arial,Helvetica,sans-serif;color:#292725;">

  <div style="padding:40px 15px;background:#f4f2ee;">

    <div style="max-width:620px;margin:auto;background:#ffffff;border:1px solid #e3ded6;border-radius:16px;overflow:hidden;">

      <!-- HEADER -->
      <div style="padding:28px 30px;text-align:center;background:#6b6258;">
        <div style="font-size:30px;font-weight:700;color:#ffffff;">
          MineKart
        </div>

        <div style="margin-top:8px;font-size:14px;color:#eeeae4;">
          Your trusted shopping destination
        </div>
      </div>

      <!-- CONTENT -->
      <div style="padding:35px;">

        <h1 style="margin:0 0 16px;color:#3f3a35;font-size:26px;">
          Order Confirmed! 🎉
        </h1>

        <p style="font-size:16px;line-height:1.7;color:#5f5a55;">
          Hi ${name},
        </p>

        <p style="font-size:15px;line-height:1.7;color:#5f5a55;">
          Thank you for shopping with MineKart.
          Your order has been successfully placed.
        </p>

        <!-- ORDER ID -->
        <div style="margin:25px 0;padding:18px;background:#f8f6f2;border:1px solid #e3ded6;border-radius:12px;">
          <div style="font-size:12px;color:#8a847d;">
            Order ID
          </div>

          <div style="margin-top:6px;font-size:18px;font-weight:700;color:#3f3a35;">
            ${orderId}
          </div>
        </div>

        <!-- ITEMS -->
        <h2 style="font-size:17px;color:#3f3a35;">
          Order Items
        </h2>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#f8f6f2;">
              <th style="padding:12px;text-align:left;">Product</th>
              <th style="padding:12px;text-align:center;">Qty</th>
              <th style="padding:12px;text-align:right;">Total</th>
            </tr>
          </thead>

          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <!-- ADDRESS -->
        <div style="margin-top:25px;padding:18px;background:#fbfaf7;border:1px solid #e3ded6;border-radius:12px;">

          <h3 style="margin:0 0 10px;color:#3f3a35;font-size:16px;">
            Delivery Address
          </h3>

          <p style="margin:0;line-height:1.6;color:#6b6258;font-size:14px;">
            <strong>${shippingAddress.fullName}</strong><br/>
            ${shippingAddress.addressLine}<br/>
            ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}<br/>
            Phone: ${shippingAddress.phone}
          </p>

        </div>

        <!-- SUMMARY -->
        <div style="margin-top:25px;border-top:1px solid #e3ded6;padding-top:18px;">

          <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
            <span>Subtotal</span>
            <strong>₹${Number(subtotal).toLocaleString('en-IN')}</strong>
          </div>

          <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
            <span>Delivery</span>
            <strong>
              ${deliveryCharge === 0 ? 'FREE' : `₹${Number(deliveryCharge).toLocaleString('en-IN')}`}
            </strong>
          </div>

          <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
            <span>Tax</span>
            <strong>₹${Number(tax).toLocaleString('en-IN')}</strong>
          </div>

          <div style="margin-top:15px;padding-top:15px;border-top:1px solid #e3ded6;display:flex;justify-content:space-between;">
            <strong style="font-size:18px;">Grand Total</strong>

            <strong style="font-size:20px;color:#8e181f;">
              ₹${Number(totalAmount).toLocaleString('en-IN')}
            </strong>
          </div>

        </div>

        <div style="margin-top:25px;padding:15px;background:#f8f6f2;border-radius:10px;">
          <strong>Payment Method:</strong>
          ${paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online on Delivery'}
        </div>

        <p style="margin-top:25px;font-size:14px;line-height:1.6;color:#6b6258;">
          We will keep you updated about your order status.
        </p>

        <p style="font-size:14px;color:#6b6258;">
          Happy Shopping! 🛍️
        </p>

      </div>

      <!-- FOOTER -->
      <div style="padding:24px 30px;text-align:center;background:#fbfaf7;border-top:1px solid #e3ded6;">

        <p style="margin:0;font-size:13px;color:#8a847d;">
          This is an automated email. Please do not reply directly.
        </p>

        <p style="margin:8px 0 0;font-size:14px;font-weight:700;color:#6b6258;">
          © ${new Date().getFullYear()} MineKart
        </p>

      </div>

    </div>

  </div>

</body>
</html>
`
}
