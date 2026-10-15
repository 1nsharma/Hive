# AI Security, Alignment & Guardrails Blueprint (v1.0)

This blueprint documents the security controls, credential protection mechanisms, prompt injection alignment systems, and data isolation policies governing DukaanMitra AI.

---

## 1. Zero-Exposure API Key Isolation

All generative transactions follow a strict server-side proxy model. This is the cornerstone of our AI security posture:

- **No Public Prefixes**: The system API Key is defined strictly under the private, non-public environment variable `GEMINI_API_KEY`. It lacks the `VITE_` prefix, preventing the Vite compiler from bundling credentials into public client-side JavaScript outputs.
- **Client-Side Prohibition**: Importing `@google/genai` or instantiating `GoogleGenAI` in browser code is strictly prohibited. Client systems interact with model capabilities exclusively via rate-limited `/api/*` Express endpoints.
- **Telemetry Protection**: The server-side initialization sets the `User-Agent` to `'aistudio-build'` to verify execution sources and audit server-level calls.

---

## 2. Multi-Tenant Prompt Isolation

DukaanMitra ensures that AI models do not leak cross-tenant customer lists or stock registries by dynamically filtering the context variables inside Express route handlers:

- **Identity Verification First**: The incoming HTTP request is authenticated via `requireAuth` or `optionalAuth` middlewares.
- **Tenant Context Filtering**: Only database rows matching the authenticated merchant's `req.dbUser.id` are retrieved and passed into the LLM system instructions:
  ```ts
  const userCustomers = await db.select().from(customers).where(eq(customers.userId, req.dbUser.id));
  const userProducts = await db.select().from(products).where(eq(products.userId, req.dbUser.id));
  ```
- **No Global System Scans**: Under no circumstances does the LLM receive global database records, ensuring perfect tenant-isolation at the semantic prompt boundary.

---

## 3. Demographics Hashing & Anonymization

To preserve customer and merchant data privacy, public demo interactions and research logs utilize cryptographic hashing:
- **Identifier Masking**: Instead of storing plain-text user IDs or client identities in public telemetry tables, the system computes SHA-256 hashes of coordinates:
  ```ts
  const userHash = crypto.createHash('sha256').update(userId ? `user_${userId}` : `demo_${demoId}`).digest('hex');
  const customerHash = customerId ? crypto.createHash('sha256').update(`customer_${customerId}`).digest('hex') : null;
  ```
- **Prompt Filtering**: Prompts stored in the permanent `ai_cache` table are looked up using SHA-256 or MD5 hashes of prompt text or raw image base64 blocks, safeguarding merchant records from raw query leaks.

---

## 4. Prompt Injection Alignment & Schema Enforcement

To align LLM responses with strict, machine-readable JSON endpoints and prevent malicious prompt overrides:
- **Type-Strict Response Schemas**: All core routes enforce strict schemas using the Google Gen AI SDK's `responseSchema` configuration. This forces the model to compile outputs into predictable types (e.g. `Type.OBJECT`, `Type.ARRAY`), rendering injection payloads useless.
- **No Direct System Instruction Exposure**: Prompt variables are enclosed within system-level instruction definitions (`config.systemInstruction`), keeping user-input variables strictly separated from role definitions.
- **Clean JSON Sanitization**: Outputs are processed using custom regex routines to strip common code-block artifacts prior to JSON parsing, preventing parsing crashes:
  ```ts
  const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
  ```
