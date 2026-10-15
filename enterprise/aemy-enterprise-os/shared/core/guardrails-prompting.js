export class GuardrailsEngine {
  constructor() {
    this.prompts = new Map();
    this.blockedPatterns = [
      /(\bselect\s+.*\bfrom\s+.*\bwhere\b.*--)/i, // SQL injection attempt
      /<script.*?>.*?<\/script>/i,                      // XSS attempt
      /(\bignore\s+all\s+previous\s+instructions\b)/i, // Jailbreak attempt
      /(\bpasswords?\s*=\s*['"][^'"]+['"])/i         // Credential leak attempt
    ];
  }

  registerPrompt(key, version, template, description = "") {
    if (!this.prompts.has(key)) {
      this.prompts.set(key, new Map());
    }
    this.prompts.get(key).set(version, {
      key,
      version,
      template,
      description,
      registeredAt: new Date().toISOString()
    });
  }

  getPrompt(key, version = "latest") {
    const versions = this.prompts.get(key);
    if (!versions) throw new Error(`Prompt '${key}' does not exist`);
    if (version === "latest") {
      const keys = Array.from(versions.keys());
      return versions.get(keys[keys.length - 1]);
    }
    const target = versions.get(version);
    if (!target) throw new Error(`Prompt '${key}' version '${version}' not found`);
    return target;
  }

  evaluateInput(input) {
    const text = typeof input === "string" ? input : JSON.stringify(input);
    for (const pattern of this.blockedPatterns) {
      if (pattern.test(text)) {
        return {
          allowed: false,
          violation: `GUARDRAIL_TRIGGERED: Pattern match '${pattern.toString()}'`
        };
      }
    }
    return { allowed: true, violation: null };
  }

  evaluateOutput(output) {
    const text = typeof output === "string" ? output : JSON.stringify(output);
    // Disallow leaking internal API secrets or unmasked PII
    if (/AIzaSy[A-Za-z0-9_-]{20,}/.test(text)) {
      return { allowed: false, violation: "GUARDRAIL_LEAK_TRIGGERED: Gemini API key detected in output" };
    }
    return { allowed: true, violation: null };
  }
}

export const guardrailsEngine = new GuardrailsEngine();
