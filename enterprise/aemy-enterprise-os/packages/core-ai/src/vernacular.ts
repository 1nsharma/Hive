import { OrderItem, ParsedCommerceOrder } from './types';

export class VernacularCommerceParser {
  private static readonly CATALOG_RULES = [
    { regex: /(\d+)\s*(?:packet|pkt|pc|pack)?\s*(?:of\s+)?(maggi|noodle[s]?)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 14, name: 'Maggi 2-Min Noodles' },
    { regex: /(\d+)\s*(?:litre|ltr|l)?\s*(?:of\s+)?(amul\s+milk|milk|doodh)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 33, name: 'Amul Taaza Milk 500ml' },
    { regex: /(\d+)\s*(?:kg|kilo)?\s*(?:of\s+)?(sugar|cheeni)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 44, name: 'Sugar Premium 1kg' },
    { regex: /(\d+)\s*(?:packet|pc)?\s*(?:of\s+)?(atta|fortune\s+atta)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 380, name: 'Fortune Chakki Atta 10kg' },
    { regex: /(\d+)\s*(?:bottle|pc)?\s*(?:of\s+)?(oil|mustard\s+oil|tel)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 165, name: 'Mustard Oil 1L' },
    { regex: /(\d+)\s*(?:packet|pc)?\s*(?:of\s+)?(chai|tea|taj\s+mahal)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 130, name: 'Taj Mahal Tea 250g' },
    { regex: /(\d+)\s*(?:packet|pc)?\s*(?:of\s+)?(soap|dettol|lifebuoy)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 40, name: 'Dettol Soap' }
  ];

  public static parse(input: string): ParsedCommerceOrder {
    const rawLower = input.toLowerCase();
    const items: OrderItem[] = [];
    let customerName = 'Cash Customer';
    const isUdhar = rawLower.includes('udhar') || rawLower.includes('khata') || rawLower.includes('credit') || rawLower.includes('baki');

    const nameMatch = input.match(/(?:to|ko|for|se|bhai|ji|shri)\s+([A-Za-z]+)/i);
    if (nameMatch && nameMatch[1]) {
      customerName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
    }

    for (const rule of this.CATALOG_RULES) {
      const match = input.match(rule.regex);
      if (match) {
        const qty = parseInt(match[1], 10) || 1;
        const unitPrice = match[3] ? parseFloat(match[3]) : rule.defaultPrice;
        items.push({
          name: rule.name,
          quantity: qty,
          unitPrice,
          total: qty * unitPrice
        });
      }
    }

    if (items.length === 0) {
      const genericMatch = input.match(/(\d+)\s+([a-zA-Z\s]+)(?:at|@|\s+)(\d+)/);
      if (genericMatch) {
        const qty = parseInt(genericMatch[1], 10) || 1;
        const name = genericMatch[2].trim();
        const price = parseFloat(genericMatch[3]) || 50;
        items.push({ name, quantity: qty, unitPrice: price, total: qty * price });
      } else {
        items.push({ name: 'General MSME Goods', quantity: 1, unitPrice: 100, total: 100 });
      }
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // Standard 5% GST approximation
    const grandTotal = subtotal + tax;

    return {
      success: true,
      customerName,
      isUdhar,
      items,
      subtotal,
      tax,
      grandTotal,
      notes: isUdhar ? `Recorded to ${customerName}'s Khata account.` : 'Immediate cash/UPI receipt.'
    };
  }
}
