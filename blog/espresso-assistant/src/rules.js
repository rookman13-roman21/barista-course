export const ESPRESSO_LIMITS = Object.freeze({
  ratioMin: 1.5,
  ratioMax: 2.5,
  ratioStep: 0.2,
  hardTimeMin: 20,
  hardTimeMax: 35,
  referenceTimeMin: 25,
  referenceTimeMax: 30,
  temperatureMin: 88,
  temperatureMax: 95,
});

export const ROAST_PRESETS = Object.freeze({
  unknown: { label: 'Не знаю', ratio: 2, temperature: 93, time: 25 },
  medium: { label: 'Средняя', ratio: 2, temperature: 93, time: 25 },
  dark: { label: 'Тёмная', ratio: 2, temperature: 91, time: 25 },
  light: { label: 'Светлая', ratio: 2, temperature: 94, time: 25 },
});

export const TASTE_OPTIONS = Object.freeze({
  balanced: 'Сладко и сбалансированно',
  sour: 'Резко и агрессивно кисло',
  bitter: 'Горько без выраженной сухости',
  watery: 'Водянисто и слабо',
  grassy: 'Травянисто, мало сладости',
  dry: 'Сухо, лекарственно или терпко',
  mixed: 'Одновременно кисло и горько',
});

function asNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function withinTolerance(first, second, tolerance) {
  return Math.abs(Number(first) - Number(second)) <= tolerance + 1e-9;
}

function attemptIsInWorkingBounds(attempt, canAdjustTemperature) {
  const time = asNumber(attempt.time);
  const ratio = calculateRatio(attempt.dose, attempt.yield);
  if (time === null || time < ESPRESSO_LIMITS.hardTimeMin || time > ESPRESSO_LIMITS.hardTimeMax) return false;
  if (ratio === null || ratio < ESPRESSO_LIMITS.ratioMin || ratio > ESPRESSO_LIMITS.ratioMax) return false;
  if (canAdjustTemperature) {
    const temperature = asNumber(attempt.temperature);
    if (temperature === null || temperature < ESPRESSO_LIMITS.temperatureMin || temperature > ESPRESSO_LIMITS.temperatureMax) return false;
  }
  return true;
}

export function calculateRatio(dose, beverageYield) {
  const doseNumber = asNumber(dose);
  const yieldNumber = asNumber(beverageYield);
  if (doseNumber === null || yieldNumber === null || doseNumber <= 0 || yieldNumber <= 0) return null;
  return round(yieldNumber / doseNumber, 2);
}

export function getStarterRecipe({ roast = 'unknown', dose = 18 } = {}) {
  const preset = ROAST_PRESETS[roast] || ROAST_PRESETS.unknown;
  const safeDose = asNumber(dose) && Number(dose) > 0 ? Number(dose) : 18;
  return {
    roast: ROAST_PRESETS[roast] ? roast : 'unknown',
    ratio: preset.ratio,
    dose: round(safeDose, 1),
    yield: round(safeDose * preset.ratio, 1),
    temperature: preset.temperature,
    time: preset.time,
  };
}

export function getSoftTimeWarning(time) {
  const timeNumber = asNumber(time);
  if (timeNumber === null) return '';
  if (
    (timeNumber >= ESPRESSO_LIMITS.hardTimeMin && timeNumber < ESPRESSO_LIMITS.referenceTimeMin)
    || (timeNumber > ESPRESSO_LIMITS.referenceTimeMax && timeNumber <= ESPRESSO_LIMITS.hardTimeMax)
  ) {
    return `Время ${round(timeNumber, 1)} с находится вне учебного ориентира 25–30 с, но сбалансированный вкус важнее цифры.`;
  }
  return '';
}

function diagnosticRecommendation(softWarning = '') {
  return {
    kind: 'diagnostic',
    title: 'Остановите изменения рецепта',
    action: 'Проверьте зерно, воду, чистоту, корзину, жернова и технику подготовки.',
    explanation: 'Рабочие границы уже достигнуты. Если рецепт начал меняться, также учтите нагрев кофемолки и влажность в помещении.',
    softWarning,
  };
}

function grindChangeNote() {
  return 'После изменения помола уберите остаток кофе предыдущей настройки способом, подходящим вашей кофемолке, и только затем готовьте контрольный шот.';
}

export function isRepeatablePair(previousAttempt, currentAttempt, canAdjustTemperature = false) {
  if (!previousAttempt || !currentAttempt) return false;
  if (previousAttempt.taste !== 'balanced' || currentAttempt.taste !== 'balanced') return false;
  if (previousAttempt.unstable || currentAttempt.unstable) return false;
  if (!attemptIsInWorkingBounds(previousAttempt, canAdjustTemperature)
    || !attemptIsInWorkingBounds(currentAttempt, canAdjustTemperature)) return false;

  const doseClose = withinTolerance(previousAttempt.dose, currentAttempt.dose, 0.2);
  const yieldClose = withinTolerance(previousAttempt.yield, currentAttempt.yield, 1);
  const timeClose = withinTolerance(previousAttempt.time, currentAttempt.time, 2);
  let temperatureClose = true;

  if (canAdjustTemperature) {
    const previousTemperature = asNumber(previousAttempt.temperature);
    const currentTemperature = asNumber(currentAttempt.temperature);
    temperatureClose = previousTemperature !== null
      && currentTemperature !== null
      && withinTolerance(previousTemperature, currentTemperature, 1);
  }

  return doseClose && yieldClose && timeClose && temperatureClose;
}

export function buildRecommendation({ attempt, session = {}, previousAttempts = [] } = {}) {
  if (!attempt) throw new Error('Attempt is required');

  const dose = asNumber(attempt.dose);
  const beverageYield = asNumber(attempt.yield);
  const time = asNumber(attempt.time);
  const temperature = asNumber(attempt.temperature);
  const ratio = calculateRatio(dose, beverageYield);

  if (dose === null || dose <= 0 || beverageYield === null || beverageYield <= 0 || time === null || time <= 0 || ratio === null) {
    return {
      kind: 'invalid',
      title: 'Проверьте цифры',
      action: 'Заполните дозировку, выход и время положительными числами.',
      explanation: 'Без этих параметров нельзя выбрать следующее изменение.',
      softWarning: '',
    };
  }

  if (attempt.unstable || attempt.taste === 'mixed') {
    return {
      kind: 'technique',
      title: 'Сначала стабилизируйте пролив',
      action: 'Не меняйте рецепт. Повторите шот после проверки распределения, темперовки и чистоты корзины.',
      explanation: 'Одновременная резкая кислота и горечь или неровный пролив часто указывают на каналообразование.',
      softWarning: '',
    };
  }

  if (time < ESPRESSO_LIMITS.hardTimeMin) {
    return {
      kind: 'grind-finer-gate',
      title: 'Слишком быстрый пролив',
      action: 'Сделайте помол мельче. Дозировку, выход и температуру не меняйте.',
      explanation: `Шот прошёл за ${round(time, 1)} с. Сначала верните время к учебному ориентиру 25–30 с, затем оценивайте вкус.`,
      afterAction: grindChangeNote(),
      targetTimeMin: ESPRESSO_LIMITS.referenceTimeMin,
      softWarning: '',
    };
  }

  if (time > ESPRESSO_LIMITS.hardTimeMax) {
    return {
      kind: 'grind-coarser-gate',
      title: 'Слишком медленный пролив',
      action: 'Сделайте помол крупнее. Дозировку, выход и температуру не меняйте.',
      explanation: `Шот прошёл за ${round(time, 1)} с. Сначала верните время к учебному ориентиру 25–30 с, затем оценивайте вкус.`,
      afterAction: grindChangeNote(),
      targetTimeMax: ESPRESSO_LIMITS.referenceTimeMax,
      softWarning: '',
    };
  }

  const softWarning = getSoftTimeWarning(time);

  if (session.canAdjustTemperature
    && (temperature === null || temperature < ESPRESSO_LIMITS.temperatureMin || temperature > ESPRESSO_LIMITS.temperatureMax)) {
    return {
      kind: 'invalid',
      title: 'Проверьте температуру',
      action: `Укажите температуру в рабочем диапазоне ${ESPRESSO_LIMITS.temperatureMin}–${ESPRESSO_LIMITS.temperatureMax} °C.`,
      explanation: 'Помощник не будет менять другие параметры, пока температура вне утверждённых границ.',
      softWarning,
    };
  }

  if (ratio < ESPRESSO_LIMITS.ratioMin || ratio > ESPRESSO_LIMITS.ratioMax) {
    return diagnosticRecommendation(softWarning);
  }

  if (attempt.taste === 'balanced') {
    const previousAttempt = previousAttempts[previousAttempts.length - 1];
    const repeatable = isRepeatablePair(previousAttempt, attempt, Boolean(session.canAdjustTemperature));
    return {
      kind: repeatable ? 'complete' : 'repeat',
      title: repeatable ? 'Рецепт повторяется' : 'Вкус найден — проверьте ещё раз',
      action: repeatable
        ? 'Сохраните итоговый рецепт. Два шота подряд получились сладкими, сбалансированными и близкими по параметрам.'
        : 'Ничего не меняйте. Повторите тот же рецепт и сравните результат.',
      explanation: repeatable
        ? 'Повторяемость важнее единичной удачной чашки.'
        : 'Одна удачная чашка ещё не доказывает стабильность рецепта.',
      softWarning,
      repeatable,
    };
  }

  if (time < ESPRESSO_LIMITS.referenceTimeMin) {
    return {
      kind: 'grind-finer-gate',
      title: 'Пролив быстрее учебного ориентира',
      action: 'Сделайте помол мельче. Дозировку, выход и температуру не меняйте.',
      explanation: `Несбалансированный шот прошёл за ${round(time, 1)} с. Сначала цельтесь в 25–30 с, затем снова оценивайте вкус.`,
      afterAction: grindChangeNote(),
      targetTimeMin: ESPRESSO_LIMITS.referenceTimeMin,
      targetTimeMax: ESPRESSO_LIMITS.referenceTimeMax,
      softWarning: '',
    };
  }

  if (time > ESPRESSO_LIMITS.referenceTimeMax) {
    return {
      kind: 'grind-coarser-gate',
      title: 'Пролив медленнее учебного ориентира',
      action: 'Сделайте помол крупнее. Дозировку, выход и температуру не меняйте.',
      explanation: `Несбалансированный шот прошёл за ${round(time, 1)} с. Сначала цельтесь в 25–30 с, затем снова оценивайте вкус.`,
      afterAction: grindChangeNote(),
      targetTimeMin: ESPRESSO_LIMITS.referenceTimeMin,
      targetTimeMax: ESPRESSO_LIMITS.referenceTimeMax,
      softWarning: '',
    };
  }

  if (attempt.taste === 'sour' || attempt.taste === 'bitter' || attempt.taste === 'watery') {
    const direction = attempt.taste === 'sour' ? 1 : -1;
    const rawTargetRatio = round(ratio + (direction * ESPRESSO_LIMITS.ratioStep), 2);
    const targetRatio = clamp(rawTargetRatio, ESPRESSO_LIMITS.ratioMin, ESPRESSO_LIMITS.ratioMax);
    const atBoundary = round(targetRatio, 2) === round(ratio, 2);
    if (atBoundary) return diagnosticRecommendation(softWarning);

    const targetYield = round(dose * targetRatio, 1);
    const increasing = direction > 0;
    return {
      kind: increasing ? 'ratio-up' : 'ratio-down',
      title: increasing ? 'Увеличьте выход' : 'Уменьшите выход',
      action: `Следующий шот: ${round(dose, 1)} г кофе → ${targetYield} г напитка, коэффициент 1:${String(targetRatio).replace('.', ',')}.`,
      explanation: increasing
        ? 'Больший выход помогает смягчить агрессивную кислоту.'
        : 'Меньший выход делает напиток короче и концентрированнее.',
      targetRatio,
      targetYield,
      softWarning,
    };
  }

  if (attempt.taste === 'grassy') {
    if (session.canAdjustTemperature && time >= 28 && temperature !== null && temperature < ESPRESSO_LIMITS.temperatureMax) {
      const targetTemperature = Math.min(ESPRESSO_LIMITS.temperatureMax, round(temperature + 1, 1));
      return {
        kind: 'temperature-up',
        title: 'Повысьте температуру',
        action: `Поднимите температуру до ${targetTemperature} °C. Остальные параметры не меняйте.`,
        explanation: 'Время уже близко к верхней границе, поэтому температура становится следующей одной переменной.',
        targetTemperature,
        softWarning,
      };
    }
    const targetTime = Math.min(ESPRESSO_LIMITS.referenceTimeMax, round(time + 3, 1));
    if (targetTime - time >= 2) {
      return {
        kind: 'grind-finer',
        title: 'Увеличьте экстракцию',
        action: `Сделайте помол немного мельче и цельтесь в ${targetTime} с. Дозировку и выход не меняйте.`,
        explanation: 'Более долгий контакт с водой может добавить сладости и убрать травянистость.',
        afterAction: grindChangeNote(),
        targetTime,
        softWarning,
      };
    }
    return diagnosticRecommendation(softWarning);
  }

  if (attempt.taste === 'dry') {
    if (session.canAdjustTemperature && time <= 25 && temperature !== null && temperature > ESPRESSO_LIMITS.temperatureMin) {
      const targetTemperature = Math.max(ESPRESSO_LIMITS.temperatureMin, round(temperature - 1, 1));
      return {
        kind: 'temperature-down',
        title: 'Понизьте температуру',
        action: `Уменьшите температуру до ${targetTemperature} °C. Остальные параметры не меняйте.`,
        explanation: 'Время уже близко к нижней границе, поэтому меняем только температуру.',
        targetTemperature,
        softWarning,
      };
    }
    const targetTime = Math.max(ESPRESSO_LIMITS.referenceTimeMin, round(time - 3, 1));
    if (time - targetTime >= 2) {
      return {
        kind: 'grind-coarser',
        title: 'Уменьшите экстракцию',
        action: `Сделайте помол немного крупнее и цельтесь в ${targetTime} с. Дозировку и выход не меняйте.`,
        explanation: 'Более короткий контакт с водой может смягчить сухость и неприятную горечь.',
        afterAction: grindChangeNote(),
        targetTime,
        softWarning,
      };
    }
    return diagnosticRecommendation(softWarning);
  }

  return diagnosticRecommendation(softWarning);
}
