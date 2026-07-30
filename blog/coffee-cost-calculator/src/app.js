import { COST_CALCULATOR_SNAPSHOT, DEFAULT_RECIPE_ID } from './data.js';
import { calculateRecipeCost, formatAmount, formatRub } from './calc.js';

const PRICE_STORAGE_KEY = 'mbsCostCalc:v1:prices';
const SELECTION_STORAGE_KEY = 'mbsCostCalc:v1:selection';
const ALL_CATEGORIES = 'Все напитки';

function readStoredJson(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (_) {
    return fallback;
  }
}

function writeStoredJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {
    // Калькулятор остаётся полезным, даже если браузер запретил localStorage.
  }
}

function removeStoredValue(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (_) {
    // Ничего не делаем: это влияет только на удобство повторного визита.
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function parseEditableNumber(value) {
  const normalized = String(value).trim().replace(',', '.');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function getRecipe(snapshot, recipeId) {
  return snapshot.recipes.find((recipe) => recipe.id === recipeId) || snapshot.recipes.find((recipe) => recipe.id === DEFAULT_RECIPE_ID) || snapshot.recipes[0];
}

function initCalculator() {
  const root = document.querySelector('[data-mbs-costcalc-root]');
  if (!root || root.dataset.mbsCostcalcReady === 'true') return;
  root.dataset.mbsCostcalcReady = 'true';

  const storedPrices = readStoredJson(PRICE_STORAGE_KEY, {});
  const storedSelection = readStoredJson(SELECTION_STORAGE_KEY, {});
  const state = {
    activeCategory: ALL_CATEGORIES,
    selectedRecipeId: typeof storedSelection.recipeId === 'string' ? storedSelection.recipeId : DEFAULT_RECIPE_ID,
    overrides: storedPrices && typeof storedPrices === 'object' && !Array.isArray(storedPrices) ? storedPrices : {},
  };

  const elements = {
    filters: root.querySelector('[data-category-filters]'),
    recipeList: root.querySelector('[data-recipe-list]'),
    selectedName: root.querySelector('[data-selected-name]'),
    selectedVolume: root.querySelector('[data-selected-volume]'),
    dialogRecipeName: root.querySelector('[data-dialog-recipe-name]'),
    totalCost: root.querySelector('[data-total-cost]'),
    breakdown: root.querySelector('[data-breakdown]'),
    dialog: root.querySelector('[data-price-dialog]'),
    priceFields: root.querySelector('[data-price-fields]'),
  };

  function selectedRecipe() {
    const recipe = getRecipe(COST_CALCULATOR_SNAPSHOT, state.selectedRecipeId);
    state.selectedRecipeId = recipe.id;
    return recipe;
  }

  function saveSelection() {
    writeStoredJson(SELECTION_STORAGE_KEY, { recipeId: state.selectedRecipeId });
  }

  function savePrices() {
    writeStoredJson(PRICE_STORAGE_KEY, state.overrides);
  }

  function renderFilters() {
    const categories = [ALL_CATEGORIES, ...new Set(COST_CALCULATOR_SNAPSHOT.recipes.map((recipe) => recipe.category))];
    elements.filters.innerHTML = categories.map((category) => `
      <button class="mbs-costcalc__filter" type="button" data-category="${escapeHtml(category)}" aria-pressed="${category === state.activeCategory}">
        ${escapeHtml(category)}
      </button>
    `).join('');
  }

  function renderRecipes() {
    const recipes = state.activeCategory === ALL_CATEGORIES
      ? COST_CALCULATOR_SNAPSHOT.recipes
      : COST_CALCULATOR_SNAPSHOT.recipes.filter((recipe) => recipe.category === state.activeCategory);

    elements.recipeList.innerHTML = recipes.map((recipe) => `
      <button class="mbs-costcalc__recipe" type="button" data-recipe-id="${recipe.id}" aria-pressed="${recipe.id === state.selectedRecipeId}">
        <span class="mbs-costcalc__recipe-name">${escapeHtml(recipe.name)}</span>
        <span class="mbs-costcalc__recipe-volume">${recipe.volumeMl} мл</span>
      </button>
    `).join('');
  }

  function renderCalculation() {
    const recipe = selectedRecipe();
    const calculation = calculateRecipeCost(COST_CALCULATOR_SNAPSHOT, recipe, state.overrides);
    const recipeLabel = `${recipe.name} · ${recipe.volumeMl} мл`;

    elements.selectedName.textContent = recipeLabel;
    elements.selectedVolume.textContent = `${recipe.volumeMl} мл`;
    elements.dialogRecipeName.textContent = recipeLabel;
    elements.totalCost.textContent = formatRub(calculation.total);
    elements.breakdown.innerHTML = calculation.lines.map((line) => `
      <div class="mbs-costcalc__breakdown-row">
        <div>
          <span class="mbs-costcalc__breakdown-name">${escapeHtml(line.ingredient.name)}</span>
          <span class="mbs-costcalc__breakdown-meta">${formatAmount(line.amount, line.ingredient.amountUnit)} · ${formatRub(line.settings.price)} / ${line.settings.size} ${line.ingredient.packageSizeUnit}</span>
        </div>
        <span class="mbs-costcalc__breakdown-cost">${formatRub(line.cost)}</span>
      </div>
    `).join('');
  }

  function renderPriceFields() {
    const recipe = selectedRecipe();
    const uniqueCodes = [...new Set(recipe.ingredients.map((ingredient) => ingredient.code))];
    elements.priceFields.innerHTML = uniqueCodes.map((code) => {
      const ingredient = COST_CALCULATOR_SNAPSHOT.ingredients[code];
      const override = state.overrides[code] || {};
      const price = override.price ?? ingredient.defaultPrice;
      const size = override.size ?? ingredient.defaultSize;
      return `
        <fieldset class="mbs-costcalc__price-fieldset">
          <legend>${escapeHtml(ingredient.name)}</legend>
          <div class="mbs-costcalc__field-grid">
            <label class="mbs-costcalc__field">Цена ${escapeHtml(ingredient.packageLabel)}, ₽
              <input type="number" min="0" step="0.01" inputmode="decimal" autocomplete="off" value="${price}" data-price-input data-ingredient-code="${code}" data-setting="price">
            </label>
            <label class="mbs-costcalc__field">Размер упаковки, ${escapeHtml(ingredient.packageSizeUnit)}
              <input type="number" min="0.01" step="0.01" inputmode="decimal" autocomplete="off" value="${size}" data-price-input data-ingredient-code="${code}" data-setting="size">
            </label>
          </div>
        </fieldset>
      `;
    }).join('');
  }

  function renderAll() {
    renderFilters();
    renderRecipes();
    renderCalculation();
    renderPriceFields();
  }

  function openDialog() {
    renderPriceFields();
    if (typeof elements.dialog.showModal === 'function') {
      if (!elements.dialog.open) elements.dialog.showModal();
      return;
    }
    elements.dialog.setAttribute('open', '');
  }

  function closeDialog() {
    if (typeof elements.dialog.close === 'function' && elements.dialog.open) {
      elements.dialog.close();
      return;
    }
    elements.dialog.removeAttribute('open');
  }

  function resetSelectedRecipePrices() {
    selectedRecipe().ingredients.forEach(({ code }) => delete state.overrides[code]);
    savePrices();
    renderAll();
  }

  function resetAllPrices() {
    if (!window.confirm('Сбросить все сохранённые цены в этом калькуляторе?')) return;
    state.overrides = {};
    removeStoredValue(PRICE_STORAGE_KEY);
    renderAll();
  }

  root.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || !root.contains(button)) return;

    if (button.matches('[data-category]')) {
      state.activeCategory = button.dataset.category;
      renderFilters();
      renderRecipes();
      return;
    }

    if (button.matches('[data-recipe-id]')) {
      state.selectedRecipeId = button.dataset.recipeId;
      saveSelection();
      renderRecipes();
      renderCalculation();
      renderPriceFields();
      return;
    }

    if (button.matches('[data-open-prices]')) openDialog();
    if (button.matches('[data-close-prices]')) closeDialog();
    if (button.matches('[data-reset-current]')) resetSelectedRecipePrices();
    if (button.matches('[data-reset-all]')) resetAllPrices();
  });

  root.addEventListener('input', (event) => {
    const input = event.target.closest('[data-price-input]');
    if (!input || !root.contains(input)) return;

    const value = parseEditableNumber(input.value);
    const setting = input.dataset.setting;
    const isValid = setting === 'price' ? value !== null && value >= 0 : value !== null && value > 0;
    if (!isValid) return;

    const code = input.dataset.ingredientCode;
    state.overrides[code] = { ...(state.overrides[code] || {}), [setting]: value };
    savePrices();
    renderCalculation();
  });

  elements.dialog.addEventListener('click', (event) => {
    if (event.target === elements.dialog) closeDialog();
  });

  renderAll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalculator, { once: true });
} else {
  initCalculator();
}
