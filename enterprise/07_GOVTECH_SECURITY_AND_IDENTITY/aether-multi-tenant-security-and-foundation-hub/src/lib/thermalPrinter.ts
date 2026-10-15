import { Order, Shop } from '../types/database';
import JsBarcode from 'jsbarcode';

/**
 * Generates and triggers a 58mm thermal printer Kitchen Order Ticket (KOT) (MRC-05)
 * Opens an isolated print window formatted precisely for standard 58mm POS receipt printers.
 * Includes: Token, Time, Items, Total Amount, Payment: VERIFIED PAID / UNVERIFIED, Wait Time, and Barcode.
 */
export function printThermalKOT(order: Order, shopOrName?: Shop | string, waitTimeMins?: number): void {
  if (typeof window === 'undefined') return;

  const shopName = typeof shopOrName === 'string' ? shopOrName : (shopOrName?.name || 'Aether Storefront');

  // Generate barcode data URL using JsBarcode
  let barcodeDataUrl = '';
  try {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, order.token || 'K-00', {
      format: 'CODE128',
      lineColor: '#000000',
      width: 2,
      height: 42,
      displayValue: true,
      font: 'monospace',
      fontSize: 11,
      margin: 4,
    });
    barcodeDataUrl = canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('JsBarcode generation warning:', err);
  }

  const printWindow = window.open('', '_blank', 'width=380,height=600');
  if (!printWindow) {
    alert('Pop-up blocked. Please allow pop-ups for KOT printing.');
    return;
  }

  const itemsHtml = order.items
    .map(
      (item) => `
    <div class="item-row">
      <div class="item-header">
        <span class="qty">${item.quantity}x</span>
        <span class="item-name">${item.name}</span>
        <span class="price">$${((item.price_cents * item.quantity) / 100).toFixed(2)}</span>
      </div>
      ${
        item.selected_add_ons && item.selected_add_ons.length > 0
          ? `<div class="addons">
              ${item.selected_add_ons.map((ao) => `<div>+ ${ao.name} ($${(ao.price_cents / 100).toFixed(2)})</div>`).join('')}
            </div>`
          : ''
      }
      ${item.notes ? `<div class="notes">NOTE: ${item.notes}</div>` : ''}
    </div>
  `
    )
    .join('');

  const modeBadge =
    order.mode === 'DINE_IN'
      ? `DINE IN · ${order.table_number || 'TABLE'}`
      : order.mode === 'PARCEL'
      ? `PARCEL · ${order.customer_name || 'TAKEAWAY'}`
      : `COUNTER TOKEN`;

  const dateStr = new Date(order.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const fullDate = new Date(order.created_at).toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isPaidVerified = order.payment?.status === 'VERIFIED';
  const paymentBadge = isPaidVerified ? 'VERIFIED PAID' : 'UNVERIFIED / PENDING';
  const effectiveWaitMins = waitTimeMins ?? order.estimated_wait_mins ?? 12;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>KOT - ${order.token}</title>
  <style>
    @page {
      size: 58mm auto;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 6mm 4mm;
      width: 58mm;
      font-family: 'JetBrains Mono', 'Courier New', Courier, monospace;
      font-size: 11px;
      line-height: 1.25;
      color: #000;
      background: #fff;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .bold { font-weight: bold; }
    
    .header {
      margin-bottom: 6px;
    }
    .shop-name {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .ticket-label {
      font-size: 10px;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    
    .token-box {
      border: 2px dashed #000;
      padding: 4px;
      margin: 6px 0;
      text-align: center;
    }
    .token-number {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 1px;
      display: block;
    }
    .mode-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 2px;
    }
    
    .barcode-box {
      margin: 6px 0;
      text-align: center;
    }
    .barcode-box img {
      max-width: 90%;
      height: auto;
      margin: 0 auto;
      display: block;
    }

    .meta {
      font-size: 9px;
      margin: 4px 0;
      line-height: 1.35;
    }
    
    .divider {
      border-top: 1px dashed #000;
      margin: 6px 0;
    }
    
    .item-row {
      margin-bottom: 5px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: 700;
      font-size: 11px;
    }
    .qty {
      margin-right: 4px;
      min-width: 18px;
    }
    .item-name {
      flex: 1;
      word-break: break-word;
    }
    .price {
      margin-left: 4px;
    }
    .addons {
      font-size: 9px;
      color: #333;
      padding-left: 20px;
      margin-top: 2px;
    }
    .notes {
      font-size: 9px;
      font-weight: bold;
      padding-left: 20px;
      margin-top: 2px;
      text-transform: uppercase;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 800;
      margin-top: 4px;
    }
    .status-badge-box {
      font-size: 10px;
      font-weight: 800;
      margin-top: 6px;
      text-align: center;
      border: 1.5px solid #000;
      padding: 3px;
      letter-spacing: 0.5px;
    }
    
    .wait-box {
      font-size: 10px;
      font-weight: 700;
      margin-top: 4px;
      text-align: center;
      background: #f0f0f0;
      padding: 2px;
    }

    .cut-line {
      margin-top: 15px;
      text-align: center;
      font-size: 8px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header text-center">
    <div class="shop-name">${shopName || 'STORE KITCHEN'}</div>
    <div class="ticket-label">*** 58MM KITCHEN TICKET (KOT) ***</div>
  </div>

  <div class="token-box">
    <span class="token-number">${order.token}</span>
    <div class="mode-label">${modeBadge}</div>
  </div>

  ${barcodeDataUrl ? `<div class="barcode-box"><img src="${barcodeDataUrl}" alt="Barcode ${order.token}" /></div>` : ''}

  <div class="meta">
    <div>ORDER NO: ${order.order_number}</div>
    <div>DATE: ${fullDate} · ${dateStr}</div>
    <div>EST. WAIT TIME: ${effectiveWaitMins} MINS</div>
    ${order.customer_phone ? `<div>PHONE: ${order.customer_phone}</div>` : ''}
  </div>

  <div class="divider"></div>

  <div class="items-list">
    ${itemsHtml}
  </div>

  <div class="divider"></div>

  <div class="total-row">
    <span>TOTAL AMOUNT:</span>
    <span>$${(order.total_cents / 100).toFixed(2)}</span>
  </div>

  <div class="status-badge-box">
    PAYMENT: ${paymentBadge}
  </div>

  <div class="wait-box">
    PREPARATION QUEUE: ~${effectiveWaitMins} MINUTES
  </div>

  <div class="cut-line">
    - - - - - - - - TEAR HERE - - - - - - - -
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
