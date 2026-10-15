const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newRoute = `
// Import Contacts
app.post("/api/contacts/import", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { contacts } = req.body;
    if (!contacts || !Array.isArray(contacts)) {
      return res.status(400).json({ error: "Invalid contacts data" });
    }

    const inserted = [];
    for (const contact of contacts) {
      if (contact.name && (contact.phone || contact.email)) {
        // simple insert, ignoring duplicates for now or we can use onConflictDoNothing if phone was unique per user, but phone isn't unique in schema.
        const res = await db.insert(potentialCustomers).values({
          userId: req.dbUser!.id,
          name: contact.name,
          phone: contact.phone || '',
          email: contact.email || null,
          source: 'contacts'
        }).returning();
        inserted.push(res[0]);
      }
    }
    res.json({ success: true, count: inserted.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
`;

code = code.replace('// Settings routes', newRoute + '\n// Settings routes');
fs.writeFileSync('server.ts', code);
