const fs = require('fs');
const path = require('path');

const docs = {
  "01-Foundation": ["Vision", "Mission", "Core-Values", "Problem-Statement", "Solution", "Brand-Story", "Elevator-Pitch", "Tagline", "Company-Profile", "FAQs"],
  "02-Brand": ["Brand-Guidelines", "Logo", "Color-Palette", "Typography", "Icon-System", "Design-Language", "Marketing-Assets", "Social-Media-Kit", "Press-Kit"],
  "03-Product": ["Product-Requirements-Document-PRD", "Feature-List", "Roadmap", "User-Personas", "User-Journey", "Wireframes", "UX-Guidelines", "Design-System", "Release-Notes", "Changelog"],
  "04-Engineering": ["System-Architecture", "Frontend-Architecture", "Backend-Architecture", "Database-Schema", "API-Documentation", "Authentication", "Authorization", "Security-Policy", "Coding-Standards", "Git-Workflow", "DevOps", "Deployment-Guide", "Environment-Variables", "Monitoring", "Logging", "Backup-and-Recovery"],
  "05-AI": ["AI-Strategy", "AI-Architecture", "AI-Agents", "Prompt-Library", "Knowledge-Base", "RAG", "Memory-System", "Model-Registry", "Evaluation", "Guardrails", "Safety", "AI-Testing"],
  "06-Data": ["Database-Design", "ER-Diagram", "Data-Dictionary", "Event-Schema", "Analytics", "Reports", "Data-Warehouse", "Data-Governance", "Backup-Policy"],
  "07-Business": ["Business-Model", "Revenue-Model", "Pricing", "GTM-Strategy", "Sales-Strategy", "Marketing-Strategy", "Partnerships", "Investor-Deck", "Financial-Model", "KPIs", "OKRs"],
  "08-Operations": ["SOPs", "Team-Structure", "Hiring", "HR-Policies", "Customer-Support", "Incident-Management", "Escalation-Matrix", "Vendor-Management"],
  "09-Legal": ["Privacy-Policy", "Terms-of-Service", "Refund-Policy", "Cookie-Policy", "Compliance", "Trademark", "Copyright", "Contracts", "Licenses"],
  "10-Security": ["Security-Architecture", "Threat-Model", "Access-Control", "Encryption", "Secrets-Management", "Incident-Response", "Vulnerability-Management", "Audit-Checklist"],
  "11-Marketing": ["SEO", "AEO", "Content-Strategy", "Social-Strategy", "Email-Marketing", "Performance-Marketing", "Campaign-Library", "Brand-Messaging"],
  "12-Customer": ["Onboarding", "Help-Center", "User-Guides", "Tutorials", "FAQ", "Feedback-System", "Community"],
  "13-Finance": ["Budget", "Expenses", "Revenue", "Taxes", "Accounting", "Payroll", "Invoices"],
  "14-Integrations": ["WhatsApp", "UPI", "Payments", "SMS", "Email", "Maps", "AI-APIs", "ERP", "CRM"],
  "15-Infrastructure": ["Cloud", "Servers", "Domains", "DNS", "SSL", "CDN", "Monitoring", "Storage"],
  "16-Credentials-Vault": ["Domains", "Email-Accounts", "Social-Handles", "API-Keys", "SSH-Keys", "Database-Credentials", "Third-party-Accounts", "Recovery-Codes"],
  "17-Assets": ["Logos", "Images", "Videos", "Icons", "Presentations", "PDFs", "Contracts", "Certificates"],
  "18-Research": ["Competitor-Analysis", "Market-Research", "Customer-Interviews", "Feature-Research", "AI-Research", "Technology-Research"],
  "19-Meeting-Notes": ["Daily-Notes", "Weekly-Notes", "Sprint-Notes", "Investor-Meetings", "Client-Meetings"],
  "20-Archive": ["Old-Versions", "Deprecated-Features", "Legacy-Documents", "Historical-Decisions"]
};

const baseDir = 'docs';

if (!fs.existsSync(baseDir)){
    fs.mkdirSync(baseDir);
}

// Master index
let indexContent = "# BazaarSync — Master Documentation Index (v1.0)\n\n_Scaffolded 2026-07-07. Fill in each linked document as content becomes available._\n\n";

for (const [section, files] of Object.entries(docs)) {
  const sectionName = section.replace('-', '. ').replace(/-/g, ' ');
  indexContent += `\n## ${sectionName}\n\n`;
  
  const sectionDir = path.join(baseDir, section);
  if (!fs.existsSync(sectionDir)) {
    fs.mkdirSync(sectionDir);
  }
  
  let sectionIndexContent = `# ${sectionName}\n\nStatus: 🔲 Not started\nOwner: _unassigned_\nLast updated: 2026-07-07\n\n## Contents\n\n`;

  for (const file of files) {
    const fileName = `${file}.md`;
    const filePath = path.join(sectionDir, fileName);
    const title = file.replace(/-/g, ' ');
    
    indexContent += `- [${title}](${section}/${fileName})\n`;
    sectionIndexContent += `- [${title}](./${fileName})\n`;
    
    const template = `# ${title}\n\n**Section:** ${sectionName}\n**Status:** 🔲 Not started\n**Owner:** _unassigned_\n**Last updated:** 2026-07-07\n\n---\n\n## Purpose\n\n_What this document is for and who should read it._\n\n## Content\n\n_Fill in._\n\n## Open questions\n\n- \n\n## Related documents\n\n- \n`;
    
    fs.writeFileSync(filePath, template);
  }
  
  fs.writeFileSync(path.join(sectionDir, 'README.md'), sectionIndexContent);
}

fs.writeFileSync(path.join(baseDir, 'README.md'), indexContent);
console.log('Documentation structure created.');
