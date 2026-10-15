import test from "node:test";
import assert from "node:assert/strict";
import { TalentEngine } from "./talent-engine.js";

test("HireSaathi: Screens developer resume and extracts verified skills", async () => {
  const engine = new TalentEngine();
  const candidate = await engine.screenCandidate("TENANT_TALENT", {
    name: "Aakash Mehta",
    phone: "9112233445",
    appliedRole: "Full-Stack AI Engineer",
    resumeText: "Experienced in React, TypeScript, Node.js backend, Python, AI models, and SQL databases with Git workflows.",
    experienceYears: 4
  });

  assert.equal(candidate.name, "Aakash Mehta");
  assert.ok(candidate.skills.includes("REACT"));
  assert.ok(candidate.skills.includes("NODE"));
  assert.ok(candidate.skills.includes("PYTHON"));
  assert.ok(candidate.totalScore >= 70);
  assert.equal(candidate.recommendation, "SELECTED_FOR_INTERVIEW");
});
