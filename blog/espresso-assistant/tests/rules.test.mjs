import assert from 'node:assert/strict';
import {
  ESPRESSO_LIMITS,
  buildRecommendation,
  calculateRatio,
  getSoftTimeWarning,
  getStarterRecipe,
  isRepeatablePair,
} from '../src/rules.js';

const session = { canAdjustTemperature: false };
const adjustableSession = { canAdjustTemperature: true };
const attempt = (overrides = {}) => ({
  dose: 18,
  yield: 36,
  time: 25,
  temperature: 93,
  taste: 'balanced',
  unstable: false,
  ...overrides,
});

assert.equal(calculateRatio(18, 36), 2);
assert.equal(calculateRatio(0, 36), null);
assert.deepEqual(getStarterRecipe({ roast: 'dark', dose: 19 }), {
  roast: 'dark', ratio: 1.8, dose: 19, yield: 34.2, temperature: 91, time: 25,
});
assert.equal(getStarterRecipe({ roast: 'light', dose: 18 }).yield, 39.6);
assert.equal(ESPRESSO_LIMITS.ratioStep, 0.2);

const mixed = buildRecommendation({ attempt: attempt({ time: 15, taste: 'mixed' }), session });
assert.equal(mixed.kind, 'technique', 'Channeling/instability must take priority over time and taste changes');

const fast = buildRecommendation({ attempt: attempt({ time: 19, taste: 'sour' }), session });
assert.equal(fast.kind, 'grind-finer-gate');
assert.equal(fast.targetRatio, undefined, 'A fast shot must not get a taste-based ratio recommendation');

const slow = buildRecommendation({ attempt: attempt({ time: 36, taste: 'bitter' }), session });
assert.equal(slow.kind, 'grind-coarser-gate');
assert.equal(slow.targetRatio, undefined, 'A slow shot must not get a taste-based ratio recommendation');

assert.match(getSoftTimeWarning(22), /25–30/);
assert.match(getSoftTimeWarning(31), /25–30/);
assert.equal(getSoftTimeWarning(25), '');

const justBelowAdviceRange = buildRecommendation({ attempt: attempt({ time: 24.9, taste: 'sour' }), session });
assert.equal(justBelowAdviceRange.kind, 'grind-finer-gate');
assert.equal(justBelowAdviceRange.targetRatio, undefined);
assert.match(justBelowAdviceRange.afterAction, /остаток кофе предыдущей настройки/);
const atAdviceRangeStart = buildRecommendation({ attempt: attempt({ time: 25, taste: 'sour' }), session });
assert.equal(atAdviceRangeStart.kind, 'ratio-up');
const atAdviceRangeEnd = buildRecommendation({ attempt: attempt({ time: 30, taste: 'bitter' }), session });
assert.equal(atAdviceRangeEnd.kind, 'ratio-down');
const justAboveAdviceRange = buildRecommendation({ attempt: attempt({ time: 30.1, taste: 'bitter' }), session });
assert.equal(justAboveAdviceRange.kind, 'grind-coarser-gate');
assert.equal(justAboveAdviceRange.targetRatio, undefined);

const sour = buildRecommendation({ attempt: attempt({ taste: 'sour' }), session });
assert.equal(sour.kind, 'ratio-up');
assert.equal(sour.targetRatio, 2.2);
assert.equal(sour.targetYield, 39.6);

const sourFromTwoPointZeroFour = buildRecommendation({
  attempt: attempt({ yield: 36.72, taste: 'sour' }),
  session,
});
assert.equal(sourFromTwoPointZeroFour.targetRatio, 2.24);
const sourFromTwoPointZeroFive = buildRecommendation({
  attempt: attempt({ yield: 36.9, taste: 'sour' }),
  session,
});
assert.equal(sourFromTwoPointZeroFive.targetRatio, 2.25);

const bitter = buildRecommendation({ attempt: attempt({ taste: 'bitter' }), session });
assert.equal(bitter.kind, 'ratio-down');
assert.equal(bitter.targetRatio, 1.8);
assert.equal(bitter.targetYield, 32.4);

const watery = buildRecommendation({ attempt: attempt({ taste: 'watery' }), session });
assert.equal(watery.kind, 'ratio-down');

const ratioUpperBoundary = buildRecommendation({ attempt: attempt({ yield: 45, taste: 'sour' }), session });
assert.equal(ratioUpperBoundary.kind, 'diagnostic');
const ratioLowerBoundary = buildRecommendation({ attempt: attempt({ yield: 27, taste: 'bitter' }), session });
assert.equal(ratioLowerBoundary.kind, 'diagnostic');
const ratioAboveBoundary = buildRecommendation({ attempt: attempt({ yield: 54, taste: 'sour' }), session });
assert.equal(ratioAboveBoundary.kind, 'diagnostic');
const ratioBelowBoundary = buildRecommendation({ attempt: attempt({ yield: 25.2, taste: 'bitter' }), session });
assert.equal(ratioBelowBoundary.kind, 'diagnostic');

const grassy = buildRecommendation({ attempt: attempt({ time: 25, taste: 'grassy' }), session });
assert.equal(grassy.kind, 'grind-finer');
assert.equal(grassy.targetTime, 28);

const grassyAtReferenceEdge = buildRecommendation({ attempt: attempt({ time: 30, taste: 'grassy' }), session });
assert.equal(grassyAtReferenceEdge.kind, 'diagnostic');
const grassyNearHardEdge = buildRecommendation({ attempt: attempt({ time: 33, taste: 'grassy' }), session });
assert.equal(grassyNearHardEdge.kind, 'grind-coarser-gate');
const grassyAtHardEdge = buildRecommendation({ attempt: attempt({ time: 34, taste: 'grassy' }), session });
assert.equal(grassyAtHardEdge.kind, 'grind-coarser-gate');

const grassyTemperature = buildRecommendation({
  attempt: attempt({ time: 29, temperature: 93, taste: 'grassy' }),
  session: adjustableSession,
});
assert.equal(grassyTemperature.kind, 'temperature-up');
assert.equal(grassyTemperature.targetTemperature, 94);

const grassyNoTemperatureControl = buildRecommendation({
  attempt: attempt({ time: 30, temperature: null, taste: 'grassy' }),
  session,
});
assert.equal(grassyNoTemperatureControl.kind, 'diagnostic');

const dry = buildRecommendation({ attempt: attempt({ time: 29, taste: 'dry' }), session });
assert.equal(dry.kind, 'grind-coarser');
assert.equal(dry.targetTime, 26);

const dryAtReferenceEdge = buildRecommendation({ attempt: attempt({ time: 23, taste: 'dry' }), session });
assert.equal(dryAtReferenceEdge.kind, 'grind-finer-gate');
const dryNearHardEdge = buildRecommendation({ attempt: attempt({ time: 22, taste: 'dry' }), session });
assert.equal(dryNearHardEdge.kind, 'grind-finer-gate');
const dryAtHardEdge = buildRecommendation({ attempt: attempt({ time: 21, taste: 'dry' }), session });
assert.equal(dryAtHardEdge.kind, 'grind-finer-gate');

const dryTemperature = buildRecommendation({
  attempt: attempt({ time: 25, temperature: 93, taste: 'dry' }),
  session: adjustableSession,
});
assert.equal(dryTemperature.kind, 'temperature-down');
assert.equal(dryTemperature.targetTemperature, 92);

const invalidLowTemperature = buildRecommendation({
  attempt: attempt({ temperature: 80, taste: 'sour' }),
  session: adjustableSession,
});
assert.equal(invalidLowTemperature.kind, 'invalid');
assert.match(invalidLowTemperature.action, /88–95/);
const invalidHighTemperature = buildRecommendation({
  attempt: attempt({ temperature: 99, taste: 'dry' }),
  session: adjustableSession,
});
assert.equal(invalidHighTemperature.kind, 'invalid');

const firstBalanced = buildRecommendation({ attempt: attempt(), session, previousAttempts: [] });
assert.equal(firstBalanced.kind, 'repeat');
const balancedBelowAdviceRange = buildRecommendation({ attempt: attempt({ time: 23 }), session, previousAttempts: [] });
assert.equal(balancedBelowAdviceRange.kind, 'repeat');
assert.match(balancedBelowAdviceRange.softWarning, /25–30/);
const repeatedBalancedBelowAdviceRange = buildRecommendation({
  attempt: attempt({ time: 23.5 }),
  session,
  previousAttempts: [attempt({ time: 23 })],
});
assert.equal(repeatedBalancedBelowAdviceRange.kind, 'complete');
const secondBalanced = buildRecommendation({
  attempt: attempt({ dose: 18.1, yield: 36.8, time: 27 }),
  session,
  previousAttempts: [attempt()],
});
assert.equal(secondBalanced.kind, 'complete');

assert.equal(isRepeatablePair(attempt(), attempt({ dose: 18.2, yield: 37, time: 27 })), true);
assert.equal(isRepeatablePair(attempt({ dose: 17.9 }), attempt({ dose: 18.1 })), true);
assert.equal(isRepeatablePair(attempt(), attempt({ dose: 18.3 })), false);
assert.equal(isRepeatablePair(attempt({ unstable: true }), attempt()), false);
assert.equal(isRepeatablePair(attempt({ time: 19.5 }), attempt({ time: 20 })), false);
assert.equal(isRepeatablePair(attempt({ time: 36 }), attempt({ time: 35 })), false);
assert.equal(isRepeatablePair(attempt({ yield: 54 }), attempt({ yield: 54 })), false);
assert.equal(isRepeatablePair(attempt(), attempt({ temperature: 94 }), true), true);
assert.equal(isRepeatablePair(attempt(), attempt({ temperature: 95 }), true), false);

console.log('rules.test.mjs: passed');
