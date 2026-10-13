const escapeHtml = (value = '') =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const formatPrice = (value) =>
  Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const formatDate = (value) => {
  const date = value ? new Date(value) : new Date()

  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleDateString('en-IN')
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const invoicePdfTemplate = (order, customerName = 'Customer') => {
  const items = Array.isArray(order?.items) ? order.items : []

  const totalItems = items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0)

  const subtotal = Number(order?.subtotal || 0)
  const deliveryCharge = Number(order?.deliveryCharge || 0)
  const tax = Number(order?.tax || 0)

  const grandTotal = Number(order?.totalAmount ?? subtotal + deliveryCharge + tax)

  const invoiceDate = formatDate(order?.createdAt || order?.orderDate)
  const orderId = order?.orderId || order?._id || 'N/A'

  const address = order?.shippingAddress || {}

  const addressName = address.fullName || address.name || customerName || 'Customer'

  const addressLine = [address.addressLine || address.address || address.street, address.landmark ? `Landmark: ${address.landmark}` : '', address.city, address.state, address.pincode || address.zipCode].filter(Boolean).join(', ')

  const phone = address.phone || address.mobile || ''
  const paymentMethod = order?.paymentMethod || 'Not specified'

  const itemRows = items
    .map((item, index) => {
      const product = item.productId && typeof item.productId === 'object' ? item.productId : {}

      const productName = product.productName || item.productName || 'Product'

      const brandName = product.brand?.brandName || item.brand?.brandName || 'MineKart'

      const unitPrice = Number(item.discountPrice ?? product.discountPrice ?? item.price ?? product.price ?? 0)

      const quantity = Math.max(0, Number(item.quantity) || 0)

      const amount = Number(item.totalPrice ?? unitPrice * quantity)

      const size = item.size ? `<div class="product-meta">Size: ${escapeHtml(item.size)}</div>` : ''

      return `
        <tr>
          <td class="serial">${index + 1}</td>
          <td class="product-cell">
            <div class="product-name">${escapeHtml(productName)}</div>
            <div class="product-meta">${escapeHtml(brandName)}</div>
            ${size}
          </td>
          <td class="qty">${quantity}</td>
          <td class="money">₹${formatPrice(unitPrice)}</td>
          <td class="money amount">₹${formatPrice(amount)}</td>
        </tr>
      `
    })
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MineKart Invoice ${escapeHtml(orderId)}</title>

  <style>
    @page {
      size: A4;
      margin: 12mm;
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #35231F;
      font-family: Arial, Helvetica, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-size: 10px;
      line-height: 1.5;
    }

    .invoice {
      width: 100%;
      overflow: hidden;
      border: 1px solid #E8DDD4;
      border-radius: 10px;
      background: #ffffff;
    }

    /* HEADER */

    .invoice-header {
      padding: 18px 20px 14px;
      background: #FFFCFA;
      border-bottom: 1px solid #E8DDD4;
    }

    .header-main {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    .brand-block,
    .invoice-info {
      display: table-cell;
      vertical-align: middle;
    }

    .brand-block {
      width: 65%;
    }

    .brand-logo {
      display: inline-block;
      width: 46px;
      height: 46px;
      padding: 4px;
      margin-right: 9px;
      vertical-align: middle;
      border: 1px solid #E8DDD4;
      border-radius: 8px;
      background: #ffffff;
    }

    .logo-image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .brand-copy {
      display: inline-block;
      vertical-align: middle;
    }

    .brand-name {
      margin: 0;
      color: #35231F;
      font-size: 24px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -0.7px;
    }

    .brand-name-highlight {
      color: #9D2932;
    }

    .tagline {
      margin: 4px 0 0;
      color: #9D2932;
      font-size: 7px;
      font-weight: 800;
      letter-spacing: 1.3px;
    }

    .invoice-info {
      text-align: right;
    }

    .invoice-title {
      margin: 0;
      color: #9D2932;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 1.5px;
    }

    .invoice-date {
      margin-top: 5px;
      color: #806C63;
      font-size: 9px;
      white-space: nowrap;
    }

    .order-strip {
      display: table;
      width: 100%;
      margin-top: 14px;
      padding: 9px 11px;
      border: 1px solid #F0E5DC;
      border-radius: 7px;
      background: #F7EEE7;
    }

    .order-thanks,
    .order-items {
      display: table-cell;
      vertical-align: middle;
    }

    .order-thanks {
      color: #67544D;
      font-size: 9px;
      font-weight: 600;
    }

    .order-items {
      color: #9D2932;
      font-size: 9px;
      font-weight: 800;
      text-align: right;
      white-space: nowrap;
    }

    /* MAIN CONTENT */

    .content {
      padding: 16px 20px 14px;
    }

    .section-heading {
      margin: 0;
      color: #35231F;
      font-size: 13px;
      font-weight: 800;
    }

    .section-subtitle {
      margin: 3px 0 0;
      color: #806C63;
      font-size: 9px;
    }

    /* ORDER DETAILS */

    .order-meta {
      margin-top: 12px;
      padding: 10px 12px;
      border: 1px solid #E8DDD4;
      border-radius: 7px;
      background: #FFFCFA;
    }

    .meta-row {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    .meta-cell {
      display: table-cell;
      width: 50%;
      vertical-align: top;
    }

    .meta-cell:last-child {
      text-align: right;
    }

    .meta-label {
      margin-bottom: 3px;
      color: #806C63;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .meta-value {
      color: #35231F;
      font-size: 10px;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    /* PRODUCT TABLE */

    .items-table-wrap {
      margin-top: 13px;
      overflow: hidden;
      border: 1px solid #E8DDD4;
      border-radius: 7px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    col.serial-col {
      width: 7%;
    }

    col.product-col {
      width: 41%;
    }

    col.qty-col {
      width: 10%;
    }

    col.price-col {
      width: 19%;
    }

    col.amount-col {
      width: 23%;
    }

    thead {
      display: table-header-group;
    }

    thead th {
      padding: 9px 7px;
      background: #F7EEE7;
      color: #67544D;
      font-size: 8px;
      font-weight: 800;
      text-align: left;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    thead th.qty,
    tbody td.qty {
      text-align: center;
    }

    thead th.money,
    tbody td.money {
      text-align: right;
    }

    tbody tr {
      border-top: 1px solid #EEE5DF;
      page-break-inside: avoid;
    }

    tbody tr:nth-child(even) {
      background: #FFFCFA;
    }

    tbody td {
      padding: 10px 7px;
      vertical-align: middle;
    }

    .serial {
      color: #806C63;
      font-size: 9px;
    }

    .product-name {
      color: #35231F;
      font-size: 9px;
      font-weight: 800;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }

    .product-meta {
      margin-top: 2px;
      color: #806C63;
      font-size: 8px;
      overflow-wrap: anywhere;
    }

    .qty {
      color: #35231F;
      font-size: 9px;
      font-weight: 700;
    }

    .money {
      color: #67544D;
      font-size: 9px;
      white-space: nowrap;
    }

    .amount {
      color: #35231F;
      font-weight: 800;
    }

    /* ADDRESS AND PAYMENT CARDS */

    .bottom-grid {
      display: table;
      width: 100%;
      margin-top: 14px;
      table-layout: fixed;
      border-spacing: 0;
    }

    .address-column,
    .summary-column {
      display: table-cell;
      width: 50%;
      vertical-align: top;
    }

    .address-column {
      padding-right: 6px;
    }

    .summary-column {
      padding-left: 6px;
    }

    .info-card {
      padding: 12px;
      border: 1px solid #E8DDD4;
      border-radius: 8px;
      background: #FFFCFA;
    }

    .summary-card {
      background: #FBF7F2;
    }

    .card-heading {
      margin: 0;
      color: #35231F;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.45px;
    }

    .card-caption {
      margin-top: 4px;
      color: #806C63;
      font-size: 8px;
    }

    .card-divider {
      margin: 10px 0;
      border-top: 1px dashed #E8DDD4;
    }

    .address-name {
      margin: 0 0 5px;
      color: #35231F;
      font-size: 10px;
      font-weight: 800;
      overflow-wrap: anywhere;
    }

    .address-text {
      margin: 0;
      color: #67544D;
      font-size: 9px;
      line-height: 1.65;
      overflow-wrap: anywhere;
    }

    .phone {
      margin: 8px 0 0;
      color: #67544D;
      font-size: 9px;
      font-weight: 700;
      overflow-wrap: anywhere;
    }

    /* PAYMENT ROWS */

    .summary-row {
      display: table;
      width: 100%;
      margin-top: 9px;
      table-layout: fixed;
      font-size: 9px;
    }

    .summary-label,
    .summary-value {
      display: table-cell;
      vertical-align: top;
    }

    .summary-label {
      width: 55%;
      padding-right: 4px;
      color: #806C63;
    }

    .summary-value {
      width: 45%;
      color: #35231F;
      font-weight: 700;
      text-align: right;
      white-space: nowrap;
    }

    .free {
      color: #34704F;
      font-weight: 800;
    }

    /* GRAND TOTAL SUB-CARD */

    .grand-total {
      margin-top: 12px;
      padding: 11px;
      border: 1px solid #E8DDD4;
      border-radius: 7px;
      background: #FFFFFF;
    }

    .grand-label {
      color: #806C63;
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.7px;
    }

    .grand-amount {
      margin-top: 5px;
      color: #9D2932;
      font-size: 21px;
      font-weight: 900;
      line-height: 1.2;
      letter-spacing: -0.4px;
      overflow-wrap: anywhere;
    }

    .grand-items {
      margin-top: 4px;
      color: #806C63;
      font-size: 8px;
    }

    .secure-note {
      margin: 9px 0 0;
      color: #34704F;
      font-size: 8px;
      font-weight: 700;
    }

    /* FOOTER */

    .footer {
      display: table;
      width: 100%;
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid #E8DDD4;
    }

    .footer-left,
    .footer-right {
      display: table-cell;
      vertical-align: middle;
      font-size: 8px;
    }

    .footer-left {
      color: #67544D;
      font-weight: 700;
    }

    .footer-right {
      color: #9A857B;
      text-align: right;
    }

    .footer-note {
      margin: 7px 0 0;
      color: #9A857B;
      font-size: 7px;
      text-align: center;
    }

    @media print {
      .invoice,
      .info-card,
      .grand-total,
      .items-table-wrap {
        break-inside: avoid;
      }

      tbody tr {
        break-inside: avoid;
      }
    }
  </style>
</head>

<body>
  <main class="invoice">
    <header class="invoice-header">
      <div class="header-main">
        <div class="brand-block">
          <span class="brand-logo">
            <img
              class="logo-image"
              src="https://minekart.vercel.app/cart_image.jpg"
              alt="MineKart"
            />
          </span>

          <span class="brand-copy">
            <h1 class="brand-name">
              Mine<span class="brand-name-highlight">Kart</span>
            </h1>

            <p class="tagline">SHOP MORE • LIVE BETTER</p>
          </span>
        </div>

        <div class="invoice-info">
          <h2 class="invoice-title">INVOICE</h2>
          <div class="invoice-date">${escapeHtml(invoiceDate)}</div>
        </div>
      </div>

      <div class="order-strip">
        <div class="order-thanks">
          Thank you for shopping with MineKart!
        </div>

        <div class="order-items">
          ${totalItems} ${totalItems === 1 ? 'ITEM' : 'ITEMS'}
        </div>
      </div>
    </header>

    <section class="content">
      <h3 class="section-heading">Order Items</h3>

      <p class="section-subtitle">
        Product details and pricing
      </p>

      <div class="order-meta">
        <div class="meta-row">
          <div class="meta-cell">
            <div class="meta-label">Order ID</div>
            <div class="meta-value">${escapeHtml(orderId)}</div>
          </div>

          <div class="meta-cell">
            <div class="meta-label">Payment Method</div>
            <div class="meta-value">${escapeHtml(paymentMethod)}</div>
          </div>
        </div>
      </div>

      <div class="items-table-wrap">
        <table>
          <colgroup>
            <col class="serial-col" />
            <col class="product-col" />
            <col class="qty-col" />
            <col class="price-col" />
            <col class="amount-col" />
          </colgroup>

          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th class="qty">Qty</th>
              <th class="money">Price</th>
              <th class="money">Amount</th>
            </tr>
          </thead>

          <tbody>
            ${
              itemRows ||
              `
                <tr>
                  <td colspan="5">No items found.</td>
                </tr>
              `
            }
          </tbody>
        </table>
      </div>

      <div class="bottom-grid">
        <div class="address-column">
          <div class="info-card">
            <h3 class="card-heading">Delivery Address</h3>

            <p class="card-caption">
              Billing &amp; shipping address
            </p>

            <div class="card-divider"></div>

            <p class="address-name">
              ${escapeHtml(addressName)}
            </p>

            <p class="address-text">
              ${escapeHtml(addressLine || 'Address not available')}
            </p>

            ${phone ? `<p class="phone">Phone: ${escapeHtml(phone)}</p>` : ''}
          </div>
        </div>

        <div class="summary-column">
          <div class="info-card summary-card">
            <h3 class="card-heading">Payment Summary</h3>

            <div class="summary-row">
              <div class="summary-label">Subtotal</div>
              <div class="summary-value">
                ₹${formatPrice(subtotal)}
              </div>
            </div>

            <div class="summary-row">
              <div class="summary-label">Delivery Charges</div>
              <div class="summary-value">
                ${deliveryCharge === 0 ? '<span class="free">FREE</span>' : `₹${formatPrice(deliveryCharge)}`}
              </div>
            </div>

            <div class="summary-row">
              <div class="summary-label">Tax</div>
              <div class="summary-value">
                ₹${formatPrice(tax)}
              </div>
            </div>

            <div class="grand-total">
              <div class="grand-label">Grand Total</div>

              <div class="grand-amount">
                ₹${formatPrice(grandTotal)}
              </div>

              <div class="grand-items">
                ${totalItems} ${totalItems === 1 ? 'item' : 'items'}
              </div>
            </div>

            <p class="secure-note">
              ✓ Secure order summary
            </p>
          </div>
        </div>
      </div>

      <footer class="footer">
        <div class="footer-left">
          Thank you for choosing MineKart.
        </div>

        <div class="footer-right">
          ${escapeHtml(invoiceDate)}
        </div>
      </footer>

      <p class="footer-note">
        This invoice was generated electronically by MineKart.
      </p>
    </section>
  </main>
</body>
</html>
  `
}

module.exports = { invoicePdfTemplate }
