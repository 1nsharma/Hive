import { z } from "zod";

export const DISCLAIMER =
  "I am not a veterinarian. If your pet is injured, having trouble breathing, collapsed, poisoned, seized, or acting unusually, contact an emergency vet immediately.";

export const PetGuidanceInput = z.object({
  species: z.enum(["dog", "cat", "bird", "rabbit", "ferret", "other"]),
  ageYears: z.number().min(0).max(50).optional().nullable(),
  symptoms: z.string().trim().min(3).max(2000),
});

export const PetGuidanceOutput = z.object({
  urgent: z.enum(["emergency", "same_day", "monitor", "unknown"]),
  summary: z.string().max(400),
  red_flags: z.array(z.string()).max(8),
  next_steps: z.array(z.string()).max(8),
  what_to_avoid: z.array(z.string()).max(8),
  disclaimer: z.string().max(300),
});

export type PetGuidanceInputType = z.infer<typeof PetGuidanceInput>;
export type PetGuidanceOutputType = z.infer<typeof PetGuidanceOutput>;

export const EMERGENCY_PATTERNS = [
  /not breathing/i,
  /cannot breathe/i,
  /can't breathe/i,
  /struggling to breathe/i,
  /difficulty breathing/i,
  /seizure/i,
  /collapse/i,
  /collapsed/i,
  /unresponsive/i,
  /bleeding heavily/i,
  /heavy bleeding/i,
  /ingested/i,
  /swallowed/i,
  /poison/i,
  /chocolate/i,
  /antifreeze/i,
  /lily/i,
  /bloat/i,
  /distended abdomen/i,
  /unable to urinate/i,
  /heatstroke/i,
  /hit by car/i,
  /electrocuted/i,
  /severe swelling/i,
  /face swelling/i,
  /pale gums/i,
  /blue gums/i,
  /white gums/i,
  /repeated vomiting/i,
  /bloody vomit/i,
  /bloody diarrhea/i,
];

const PII_EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PII_PHONE_REGEX = /(\+?\d[\d\s\-().]{7,}\d)/g;
const PII_CARD_REGEX = /\b\d{13,19}\b/g;
const PII_ID_REGEX =
  /\b(ssn|social security|passport|aadhaar|cnic|national id)\b[\s:.-]*\b[\w-]{4,}\b/gi;

export function redactPii(text: string): string {
  if (!text) return "";
  return text
    .replace(PII_EMAIL_REGEX, "[EMAIL_REDACTED]")
    .replace(PII_PHONE_REGEX, "[PHONE_REDACTED]")
    .replace(PII_CARD_REGEX, "[CARD_REDACTED]")
    .replace(PII_ID_REGEX, "[ID_REDACTED]")
    .slice(0, 1800);
}

export function deterministicEmergencyCheck(text: string): boolean {
  if (!text) return false;
  return EMERGENCY_PATTERNS.some((pattern) => pattern.test(text));
}

const DEFINITIVE_DIAGNOSIS_REGEX =
  /\b(diagnos\w+|disease called|condition called|your pet has [a-z]+ disease|your pet has [a-z]+ infection)\b/i;

const DOSAGE_REGEX =
  /\b(dose|dosage|mg\/kg|mg per kg|milligrams per|how much to give)\b/i;

const MEDICATION_NAME_REGEX =
  /ibuprofen|acetaminophen|paracetamol|tylenol|aspirin|benadryl|diphenhydramine|naproxen|codeine|tramadol|gabapentin|prednisone|prednisolone/i;

const POSITIVE_MED_ACTION_REGEX =
  /\b(give|administer|start|continue|use|apply)\b/i;

export function containsUnsafeAdvice(output: PetGuidanceOutputType): boolean {
  const mainText = [
    output.summary,
    ...output.red_flags,
    ...output.next_steps,
  ].join("\n");

  const avoidText = output.what_to_avoid.join("\n");
  const allText = `${mainText}\n${avoidText}`;

  // 1. No dosage advice anywhere
  if (DOSAGE_REGEX.test(allText)) {
    return true;
  }

  // 2. No definitive diagnosis in main guidance
  if (DEFINITIVE_DIAGNOSIS_REGEX.test(mainText)) {
    return true;
  }

  // 3. If medication names appear with action verbs in main text, block.
  // what_to_avoid can say "Do not give ibuprofen", but main advice should not recommend meds.
  if (MEDICATION_NAME_REGEX.test(mainText) && POSITIVE_MED_ACTION_REGEX.test(mainText)) {
    return true;
  }

  return false;
}

export function emergencyResponse(): PetGuidanceOutputType {
  return {
    urgent: "emergency",
    summary:
      "This may be a pet emergency. Contact a veterinarian or emergency animal clinic immediately.",
    red_flags: [
      "Possible life-threatening situation based on reported symptoms.",
      "Do not wait to see if symptoms improve on their own.",
      "Vital signs or airway may be compromised.",
    ],
    next_steps: [
      "Call the nearest emergency veterinarian or 24/7 pet trauma center now.",
      "If possible, safely transport the pet to an emergency clinic without delay.",
      "Bring any suspected toxin, packaging, or medication container to the vet if safe to do so.",
    ],
    what_to_avoid: [
      "Do not give human medications (e.g. Paracetamol, Ibuprofen) unless instructed by a vet.",
      "Do not induce vomiting unless a veterinary professional explicitly advises it.",
      "Do not delay urgent clinical care while searching online.",
    ],
    disclaimer: DISCLAIMER,
  };
}

export function fallbackResponse(message?: string): PetGuidanceOutputType {
  return {
    urgent: "unknown",
    summary:
      message ??
      "I can provide general safety information, but I cannot diagnose or prescribe. If you are worried, contact a licensed veterinarian.",
    red_flags: [
      "Uncertain or non-specific symptoms reported.",
      "Persistent discomfort or changes in eating/drinking habits.",
    ],
    next_steps: [
      "Contact a licensed veterinarian or local clinic for clinical evaluation.",
      "Monitor breathing, gum color, consciousness, appetite, and mobility.",
      "Keep the pet calm, comfortably warm, and away from stairs or hazards.",
    ],
    what_to_avoid: [
      "Do not give human medications without veterinary instruction.",
      "Do not wait if symptoms suddenly worsen.",
      "Do not rely on unverified online advice for severe symptoms.",
    ],
    disclaimer: DISCLAIMER,
  };
}

export const PET_AI_SYSTEM_PROMPT = `
You are a pet safety information assistant inside the PetJanu pet-care app.

Your only task is to provide general, non-diagnostic safety guidance about pets.

Hard rules:
1. You are NOT a veterinarian.
2. Never diagnose a disease or condition.
3. Never prescribe medication, home remedies, supplements, or dosage instructions.
4. Never recommend human medications unless telling the user to avoid them and consult a veterinarian.
5. If symptoms could be urgent, set urgent to "emergency" or "same_day" and advise contacting a licensed veterinarian immediately.
6. Do not request or repeat personal information such as names, phone numbers, emails, addresses, or exact locations.
7. Do not provide legal, insurance, or definitive medical claims.
8. If uncertain, set urgent to "unknown" and recommend veterinary evaluation.
9. Keep actions short, practical, and safety-focused.
10. Return ONLY valid JSON matching the schema. No markdown. No prose outside JSON.

Required JSON fields:
- urgent: one of "emergency", "same_day", "monitor", "unknown"
- summary: short safety summary (max 400 chars)
- red_flags: array of short warning signs (max 8 items)
- next_steps: array of safe next actions (max 8 items)
- what_to_avoid: array of unsafe things to avoid (max 8 items)
- disclaimer: short non-veterinary disclaimer
`;
