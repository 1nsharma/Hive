# 📧 Google Workspace & Gmail Deliverability Blueprint
> **Authored by:** Andy Bernard (`client-closer`)  
> **Standard:** Enterprise B2B Cold Outreach & Primary Inbox Placement Framework

---

## 🛡️ 1. Technical Domain Authentication Standards (SPF, DKIM, DMARC)

To ensure outbound B2B emails never hit Google's Spam tab or Promotional filter, every sending domain must pass strict cryptographic authentication:

### A. SPF (Sender Policy Framework) Record
- **Type:** `TXT`
- **Host:** `@`
- **Value:** `v=spf1 include:_spf.google.com ~all`
- **Purpose:** Authorizes Google Workspace servers to send email on behalf of your corporate domain.

### B. DKIM (DomainKeys Identified Mail)
- **Type:** `TXT`
- **Host:** `google._domainkey`
- **Value:** Generated 2048-bit cryptographic key from Google Admin Console (`Apps > Google Workspace > Gmail > Authenticate email`).
- **Purpose:** Signs every outbound email with a private cryptographic key, proving the message wasn't modified in transit.

### C. DMARC (Domain-based Message Authentication, Reporting & Conformance)
- **Type:** `TXT`
- **Host:** `_dmarc`
- **Value:** `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@munderdifflin.com; pct=100; sp=quarantine`
- **Purpose:** Instructs receiving mail exchangers (Google, Microsoft 365) to protect domain reputation and reject spoofed domains.

---

## 📈 2. New Mailbox Warm-Up Schedule (14-Day Ramp)

Never blast cold prospects from a fresh Google Workspace account. Adhere to this exact daily volume cap:

| Timeline | Max Emails Sent / Day | Cold Outreach Ratio | Internal / Warm Replies Ratio | Min Delay Between Emails |
| :--- | :--- | :--- | :--- | :--- |
| **Days 1–3** | 10 emails | 0 (Warmup only) | 100% peer replies | 8–15 minutes |
| **Days 4–7** | 25 emails | 10 cold emails | 60% warm network | 5–10 minutes |
| **Days 8–10** | 45 emails | 25 cold emails | 40% warm network | 3–6 minutes |
| **Days 11–14** | 70 emails | 50 cold emails | 25% warm network | 2–4 minutes |
| **Day 15+ (Steady State)** | **80–100 emails / mailbox** | **80 cold emails** | Ongoing baseline warmup | Randomized 90–240 seconds |

> **Pro-Tip:** If outbound volume needs to exceed 100 emails/day, provision secondary sister domains (e.g., `trydukaanmitra.com`, `gettruckwala.in`, `solarhubpower.com`) rather than risking the primary corporate apex domain.

---

## ✍️ 3. High-Converting Copywriting Rules for Gmail

1. **Clean Plain-Text Styling:** Do NOT send heavy HTML templates with big hero banners, colorful buttons, or social icons. B2B decision-makers associate HTML marketing templates with automated spam. Plain text looks like a direct, personal email from one executive to another.
2. **Subject Line Rules:**
   - Keep under 6 words (35–45 characters) so it renders fully on mobile Gmail screens.
   - Use lowercase or sentence case (never title case or ALL CAPS).
   - Examples: `quick question regarding [companyName]'s fleet`, `operational efficiency at [shopName]`.
3. **Forbidden Spam Trigger Words (Do NOT Use):**
   - ❌ `100% Free!`, `Guaranteed ROI`, `Risk-Free Cash`, `Act Now!`, `Urgent Offer`, `Double your profit overnight!`.
   - ✅ `Zero upfront capital`, `Measurable unit margin`, `Pilot authorization`, `Downtime reduction`.
4. **Merge Tag Consistency:**
   - Every email MUST include dynamic, verified merge tags sourced from Phyllis (`client-research`).
   - Merge tag variables: `{{firstName}}`, `{{companyName}}`, `{{sector}}`, `{{painMetric}}`, `{{decisionMakerRole}}`, `{{region}}`.
5. **Clear Single Call-to-Action (CTA):**
   - Never ask for multiple things (e.g., "Check our website, call my number, download our app, and book a meeting").
   - Offer a single, frictionless low-pressure CTA: *"Are you open to a brief 7-minute introductory call this Thursday at 3 PM?"*

---

## ⚖️ 4. Statutory Compliance & Unsubscribe Mechanism

Under commercial email standards and India's DPDP Act 2023:
- Include a physical corporate registered office address in the signature footer.
- Provide a simple, 1-click opt-out option:
  > *"PS: If you would prefer not to receive updates regarding [Domain Name], simply reply with 'unsub' and I will ensure your contact is immediately removed from our records."*
