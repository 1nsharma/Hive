import fs from 'fs';
let content = fs.readFileSync('src/os-core/os-database-integration.ts', 'utf-8');

const poHandler = `
  // 6. CREATE PURCHASE ORDER
  globalCommandBus.registerHandler('CREATE_PURCHASE', {
    handle: async (command: Command) => {
      const { item, qtyToOrder, totalCost } = command.payload;
      console.log(\`[DB Integration] Executing CREATE_PURCHASE: \${qtyToOrder}x \${item} for \${totalCost}\`);
      
      const event: DomainEvent = {
        id: \`evt_po_\${Date.now()}\`,
        type: 'PURCHASE_CREATED',
        tenantId: command.tenantId,
        payload: { item, qtyToOrder, totalCost, status: 'DRAFT' },
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      
      globalEventBus.publish(event);
      return [event];
    }
  });
`;

content = content.replace(/\/\/ Connect EventBus to Projections/, poHandler + '\n  // Connect EventBus to Projections');
fs.writeFileSync('src/os-core/os-database-integration.ts', content);
