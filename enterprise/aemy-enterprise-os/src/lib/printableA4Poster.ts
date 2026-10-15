/**
 * Generates printable A4 table standee / counter tent card with QR code (ORD-01)
 */
export function printA4Poster(shopName: string, shopSlug: string, qrDataUrl: string): void {
  if (typeof window === 'undefined') return;

  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert('Pop-up blocked. Please allow pop-ups to print the A4 poster.');
    return;
  }

  const currentOrigin = window.location.origin;
  const menuUrl = `${currentOrigin}/s/${shopSlug}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Printable Standee - ${shopName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #09090b;
      background: #ffffff;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
    }
    .poster-container {
      border: 3px solid #18181b;
      border-radius: 24px;
      padding: 40px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      min-height: 900px;
      box-sizing: border-box;
    }
    .top-badge {
      display: inline-block;
      background: #09090b;
      color: #ffffff;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 2px;
      padding: 8px 24px;
      border-radius: 9999px;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    .shop-title {
      font-size: 38px;
      font-weight: 900;
      letter-spacing: -1px;
      margin: 0 0 10px 0;
      color: #09090b;
    }
    .subtitle {
      font-size: 18px;
      color: #52525b;
      margin: 0 0 36px 0;
    }
    .qr-frame {
      background: #f4f4f5;
      padding: 24px;
      border-radius: 28px;
      border: 2px solid #e4e4e7;
      display: inline-block;
      margin-bottom: 30px;
    }
    .qr-image {
      width: 260px;
      height: 260px;
      display: block;
    }
    .url-text {
      font-family: monospace;
      font-size: 15px;
      font-weight: 600;
      color: #3f3f46;
      background: #ffffff;
      padding: 8px 20px;
      border-radius: 8px;
      border: 1px solid #d4d4d8;
      margin-top: 16px;
      display: inline-block;
    }
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      width: 100%;
      margin: 30px 0;
      text-align: left;
    }
    .step-box {
      background: #fafafa;
      border: 1px solid #e4e4e7;
      border-radius: 16px;
      padding: 20px;
    }
    .step-num {
      font-size: 20px;
      font-weight: 900;
      color: #4f46e5;
      margin-bottom: 6px;
    }
    .step-head {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .step-desc {
      font-size: 12px;
      color: #71717a;
      line-height: 1.4;
    }
    .footer-note {
      font-size: 13px;
      color: #71717a;
      border-top: 1px dashed #d4d4d8;
      padding-top: 20px;
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="poster-container">
    <div>
      <div class="top-badge">Scan · Order · Pay</div>
      <h1 class="shop-title">${shopName}</h1>
      <p class="subtitle">Contactless Table Ordering & Instant Kitchen KOT</p>

      <div class="qr-frame">
        <img class="qr-image" src="${qrDataUrl}" alt="QR Menu Code" />
        <div class="url-text">${menuUrl}</div>
      </div>
    </div>

    <div class="steps-grid">
      <div class="step-box">
        <div class="step-num">01</div>
        <div class="step-head">Open Camera</div>
        <div class="step-desc">Scan the QR code with your iPhone or Android camera app.</div>
      </div>
      <div class="step-box">
        <div class="step-num">02</div>
        <div class="step-head">Select Dishes</div>
        <div class="step-desc">Browse photos, customize add-ons, and pick Dine-In or Takeaway.</div>
      </div>
      <div class="step-box">
        <div class="step-num">03</div>
        <div class="step-head">Track Order</div>
        <div class="step-desc">Receive your kitchen token and track preparation live.</div>
      </div>
    </div>

    <div class="footer-note">
      Powered by Aether Quick-Service Architecture · No app download required
    </div>
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
