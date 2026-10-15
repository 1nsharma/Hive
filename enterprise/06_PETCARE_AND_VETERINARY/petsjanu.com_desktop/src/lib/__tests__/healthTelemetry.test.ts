import { describe, it, expect } from 'vitest';
import { generateDailyTelemetry, calculateTelemetrySummary } from '../healthTelemetry';

describe('Pet Health & Biometrics Telemetry Engine', () => {
  it('generates 8 telemetry points across the 24-hour cycle', () => {
    const points = generateDailyTelemetry();
    expect(points.length).toBe(8);
    expect(points[0].time).toBe('00:00');
    expect(points[7].time).toBe('21:00');

    points.forEach((p) => {
      expect(p.restMinutes).toBeGreaterThan(0);
      expect(p.heartRateAvg).toBeGreaterThan(50);
      expect(p.heartRateAvg).toBeLessThan(160);
    });
  });

  it('calculates telemetry summary correctly', () => {
    const points = generateDailyTelemetry();
    const summary = calculateTelemetrySummary(points);

    expect(summary.dailyActivityGoalPercentage).toBeGreaterThan(0);
    expect(summary.dailyActivityGoalPercentage).toBeLessThanOrEqual(100);
    expect(summary.sleepQualityScore).toBeGreaterThanOrEqual(50);
    expect(summary.sleepQualityScore).toBeLessThanOrEqual(100);
    expect(summary.avgRestingHeartRate).toBeGreaterThan(50);
    expect(summary.caloriesBurned).toBeGreaterThan(50);
    expect(['Low Activity', 'Moderate', 'High Energy', 'Athletic']).toContain(summary.activityTier);
  });
});
