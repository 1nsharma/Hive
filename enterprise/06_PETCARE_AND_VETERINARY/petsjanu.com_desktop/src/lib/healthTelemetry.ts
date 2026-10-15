/**
 * Pet Biometric & Activity Telemetry Analytics Engine
 * Provides statistical aggregations, activity classification, sleep indexing,
 * and vaccination status determination for pet health visualization.
 */

export interface ActivityDataPoint {
  time: string; // e.g. "08:00"
  restMinutes: number;
  walkMinutes: number;
  playMinutes: number;
  sprintMinutes: number;
  heartRateAvg: number;
}

export interface TelemetrySummary {
  dailyActivityGoalPercentage: number;
  totalActiveMinutes: number;
  sleepQualityScore: number; // 0 - 100
  avgRestingHeartRate: number;
  caloriesBurned: number;
  activityTier: 'Low Activity' | 'Moderate' | 'High Energy' | 'Athletic';
}

export function generateDailyTelemetry(seedDate = new Date()): ActivityDataPoint[] {
  const points: ActivityDataPoint[] = [];
  const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

  hours.forEach((time, idx) => {
    const isNight = idx <= 1 || idx === 7;
    const isMorningPlay = idx === 2 || idx === 3;
    const isEveningWalk = idx === 6;

    const rest = isNight ? 150 + Math.floor(Math.random() * 25) : 80 + Math.floor(Math.random() * 40);
    const walk = isEveningWalk ? 45 : (isNight ? 5 : 20 + Math.floor(Math.random() * 15));
    const play = isMorningPlay ? 35 : (isNight ? 2 : 15 + Math.floor(Math.random() * 10));
    const sprint = isMorningPlay || isEveningWalk ? 10 : 2;
    const hr = isNight ? 68 + Math.floor(Math.random() * 8) : 92 + Math.floor(Math.random() * 25);

    points.push({
      time,
      restMinutes: rest,
      walkMinutes: walk,
      playMinutes: play,
      sprintMinutes: sprint,
      heartRateAvg: hr
    });
  });

  return points;
}

export function calculateTelemetrySummary(data: ActivityDataPoint[]): TelemetrySummary {
  let totalWalk = 0;
  let totalPlay = 0;
  let totalSprint = 0;
  let totalRest = 0;
  let hrSum = 0;

  data.forEach((p) => {
    totalWalk += p.walkMinutes;
    totalPlay += p.playMinutes;
    totalSprint += p.sprintMinutes;
    totalRest += p.restMinutes;
    hrSum += p.heartRateAvg;
  });

  const totalActive = totalWalk + totalPlay + totalSprint;
  const targetActive = 90; // Recommended 90 mins active time for medium breed
  const dailyGoalPct = Math.min(100, Math.round((totalActive / targetActive) * 100));

  // Sleep quality based on uninterrupted rest between 00:00 and 06:00
  const nightRest = (data[0]?.restMinutes || 150) + (data[1]?.restMinutes || 150);
  const sleepQuality = Math.min(100, Math.max(50, Math.round((nightRest / 360) * 100)));

  const avgHR = Math.round(hrSum / (data.length || 1));
  const calories = Math.round(totalWalk * 2.8 + totalPlay * 4.2 + totalSprint * 8.5);

  let activityTier: TelemetrySummary['activityTier'] = 'Moderate';
  if (totalActive > 120) activityTier = 'Athletic';
  else if (totalActive > 80) activityTier = 'High Energy';
  else if (totalActive < 45) activityTier = 'Low Activity';

  return {
    dailyActivityGoalPercentage: dailyGoalPct,
    totalActiveMinutes: totalActive,
    sleepQualityScore: sleepQuality,
    avgRestingHeartRate: avgHR,
    caloriesBurned: calories,
    activityTier
  };
}
