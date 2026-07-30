function asFiniteNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function getIngredientSettings(ingredient, override = {}) {
  const price = asFiniteNumber(override.price);
  const size = asFiniteNumber(override.size);
  return {
    price: price !== null && price >= 0 ? price : ingredient.defaultPrice,
    size: size !== null && size > 0 ? size : ingredient.defaultSize,
  };
}

export function calculateIngredientCost(recipeIngredient, catalogIngredient, override) {
  if (!catalogIngredient || !recipeIngredient) return 0;

  const amount = asFiniteNumber(recipeIngredient.amount);
  if (amount === null || amount < 0) return 0;

  const { price, size } = getIngredientSettings(catalogIngredient, override);
  const rawLoss = asFiniteNumber(recipeIngredient.loss);
  const loss = rawLoss === null || rawLoss < 0 ? 0 : rawLoss;

  if (size <= 0 || loss >= 1) return 0;
  return roundMoney((price / size) * amount / (1 - loss));
}

export function calculateRecipeCost(snapshot, recipe, overrides = {}) {
  const lines = (recipe?.ingredients || []).map((recipeIngredient) => {
    const ingredient = snapshot.ingredients[recipeIngredient.code];
    const settings = getIngredientSettings(ingredient, overrides[recipeIngredient.code]);
    const cost = calculateIngredientCost(recipeIngredient, ingredient, overrides[recipeIngredient.code]);
    return {
      ...recipeIngredient,
      ingredient,
      settings,
      cost,
    };
  });

  return {
    lines,
    total: roundMoney(lines.reduce((sum, line) => sum + line.cost, 0)),
  };
}

export function formatRub(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function formatAmount(amount, unit) {
  const value = Number.isInteger(amount) ? amount : String(amount).replace('.', ',');
  return `${value} ${unit}`;
}
