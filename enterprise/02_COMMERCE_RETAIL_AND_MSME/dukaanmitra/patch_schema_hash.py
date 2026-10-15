import re

with open("src/db/schema.ts", "r") as f:
    content = f.read()

new_market = """export const marketResearch = pgTable('market_research', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Nullable if anonymous demo users
  userHash: text('user_hash'),
  customerHash: text('customer_hash'),
  demoId: text('demo_id'), // For unauthenticated demo tracking
  actionType: text('action_type').notNull(),
  inputData: text('input_data'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});"""

content = re.sub(r"export const marketResearch = pgTable\('market_research', \{.*?createdAt: timestamp\('created_at'\)\.defaultNow\(\),\n\}\);", new_market, content, flags=re.DOTALL)

with open("src/db/schema.ts", "w") as f:
    f.write(content)
