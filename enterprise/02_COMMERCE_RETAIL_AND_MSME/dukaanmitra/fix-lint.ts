import fs from 'fs';

let chatContent = fs.readFileSync('src/components/AIChatTab.tsx', 'utf-8');
chatContent = chatContent.replace('response.hindiSummary', 'response.hindiExplanation');
fs.writeFileSync('src/components/AIChatTab.tsx', chatContent);

let posContent = fs.readFileSync('src/components/POSTab.tsx', 'utf-8');
posContent = posContent.replace('await addCustomer(newCustName, newCustPhone, 0, "");', 'await addCustomer(newCustName, newCustPhone, 0, true);');
fs.writeFileSync('src/components/POSTab.tsx', posContent);
