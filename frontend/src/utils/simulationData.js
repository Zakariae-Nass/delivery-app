export const DRIVERS = [
  { id: 'd1', name: 'Youssef Benali', rating: 4.8, trips: 312, avatar: '🧑' },
  { id: 'd2', name: 'Karim Idrissi',  rating: 4.6, trips: 205, avatar: '👨' },
  { id: 'd3', name: 'Amine Tazi',     rating: 4.9, trips: 489, avatar: '🧔' },
  { id: 'd4', name: 'Mehdi Chaoui',   rating: 4.3, trips: 98,  avatar: '👦' },
  { id: 'd5', name: 'Omar Fassi',     rating: 4.7, trips: 276, avatar: '🧑' },
  { id: 'd6', name: 'Rachid Alami',   rating: 4.5, trips: 167, avatar: '👨' },
];

/**
 * Simulates 3–5 random drivers applying one by one with 3–8 s delays.
 * Returns a cleanup function that cancels pending timers.
 */
export function simulateDriversApplying(onDriverApply) {
  const count = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5
  const shuffled = [...DRIVERS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  const timers = [];
  let cumulativeDelay = 0;

  selected.forEach(driver => {
    cumulativeDelay += 3000 + Math.floor(Math.random() * 5001); // 3 000 – 8 000 ms
    const t = setTimeout(() => onDriverApply(driver), cumulativeDelay);
    timers.push(t);
  });

  return () => timers.forEach(t => clearTimeout(t));
}
