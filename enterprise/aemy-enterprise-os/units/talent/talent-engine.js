import { aiGateway } from "../../core/ai-gateway.js";
import { enterpriseBus } from "../../core/bus-event.js";

export class TalentEngine {
  constructor() {
    this.candidates = [];
  }

  async screenCandidate(tenantId, candidateData) {
    const { name, phone, appliedRole, resumeText, experienceYears = 2 } = candidateData;

    const aiEval = await aiGateway.screenCandidateSkills(appliedRole, resumeText);

    // Calculate final composite score
    const expScore = Math.min(30, experienceYears * 8);
    const totalScore = Math.min(100, Math.round(aiEval.matchScore * 0.7 + expScore));

    const candidate = {
      id: `CAND-${Date.now().toString().slice(-6)}`,
      tenantId,
      name,
      phone,
      appliedRole,
      skills: aiEval.skillsIdentified,
      totalScore,
      recommendation: totalScore >= 70 ? "SELECTED_FOR_INTERVIEW" : (totalScore >= 50 ? "BENCH_REVIEW" : "REJECTED"),
      timestamp: new Date().toISOString()
    };

    this.candidates.push(candidate);

    enterpriseBus.publish(tenantId, "TALENT_CANDIDATE_SCREENED", {
      candidateId: candidate.id,
      name: candidate.name,
      appliedRole: candidate.appliedRole,
      score: candidate.totalScore
    });

    return candidate;
  }

  getAllCandidates() {
    return [...this.candidates];
  }
}

export const talentEngine = new TalentEngine();
