import { CulturalClaim, KillGoMetrics, CulturalHealthMetric } from '../types';

export function exportAuditReportJSON(
  claims: CulturalClaim[],
  metrics: KillGoMetrics,
  healthMetric: CulturalHealthMetric
): void {
  const data = {
    reportTitle: 'Cultural Verification & Intelligence Audit Report v1.1',
    generatedAt: new Date().toISOString(),
    district: healthMetric.district,
    overallCulturalHealthScore: Math.round(
      (healthMetric.coveragePercent +
        healthMetric.communityParticipation +
        healthMetric.evidenceQuality +
        healthMetric.authenticityScore) /
        4
    ),
    preservationRisk: healthMetric.preservationRisk,
    killGoDecision:
      metrics.truthApprovalRate >= 80 &&
      metrics.trustPreferenceRate >= 70 &&
      metrics.conversionLift >= 20 &&
      metrics.sustainabilityRetention >= 60
        ? 'GO'
        : 'PIVOT_OR_KILL',
    killGoMetrics: metrics,
    verifiedClaimsCount: claims.filter((c) => c.status === 'VERIFIED').length,
    claimsSummary: claims.map((c) => ({
      id: c.id,
      entity: c.entityName,
      status: c.status,
      confidenceScore: c.confidenceScore,
      evidenceSourcesCount: c.evidence.length,
      communityReviewsCount: c.communityReviews.length
    }))
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Cultural_Audit_Report_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
