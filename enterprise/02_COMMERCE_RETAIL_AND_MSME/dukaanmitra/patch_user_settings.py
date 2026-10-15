import re

with open("src/db/schema.ts", "r") as f:
    content = f.read()

if "businessName" not in content:
    # Add settings table to schema
    settings_table = """

// User Settings / Business Config
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  businessName: text('business_name').notNull(),
  phone: text('phone').notNull(),
  address: text('address'),
  category: text('category'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
"""
    content = content.replace("// Relationships", settings_table + "\n// Relationships")
    content = content.replace("userLogs: many(userLogs)", "userLogs: many(userLogs),\n  settings: relations.one(userSettings)")
    
    with open("src/db/schema.ts", "w") as f:
        f.write(content)
    print("Added userSettings to schema.")
else:
    print("userSettings already exists.")
