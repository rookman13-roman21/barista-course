import assert from 'node:assert/strict';
import { COST_CALCULATOR_SNAPSHOT } from '../src/data.js';
import { calculateIngredientCost, calculateRecipeCost, recipeHasCustomIngredientSettings } from '../src/calc.js';

const recipeById = (id) => COST_CALCULATOR_SNAPSHOT.recipes.find((recipe) => recipe.id === id);

assert.equal(COST_CALCULATOR_SNAPSHOT.recipes.length, 12);
assert.equal(COST_CALCULATOR_SNAPSHOT.source.commit, '1439df3527214f1190ccfb955b40b292c08719bb');
assert.equal(calculateRecipeCost(COST_CALCULATOR_SNAPSHOT, recipeById('espresso-doppio')).total, 47);
assert.equal(calculateRecipeCost(COST_CALCULATOR_SNAPSHOT, recipeById('cappuccino-300')).total, 81.5);
assert.equal(calculateRecipeCost(COST_CALCULATOR_SNAPSHOT, recipeById('vanilla-raf-300')).total, 112.9);
assert.equal(calculateRecipeCost(COST_CALCULATOR_SNAPSHOT, recipeById('filter-coffee-300')).total, 91);

const changedMilk = calculateRecipeCost(COST_CALCULATOR_SNAPSHOT, recipeById('cappuccino-300'), { milk: { price: 200, size: 1000 } });
assert.equal(changedMilk.total, 99);

const lossIngredient = { amount: 100, loss: 0.5 };
const lossCatalogItem = { defaultPrice: 1000, defaultSize: 1000 };
assert.equal(calculateIngredientCost(lossIngredient, lossCatalogItem), 200);
assert.equal(calculateIngredientCost({ amount: 100, loss: 1 }, lossCatalogItem), 0);
assert.equal(calculateIngredientCost({ amount: -1 }, lossCatalogItem), 0);

const cappuccino = recipeById('cappuccino-300');
const milk = COST_CALCULATOR_SNAPSHOT.ingredients.milk;
assert.equal(recipeHasCustomIngredientSettings(COST_CALCULATOR_SNAPSHOT, cappuccino, {}), false);
assert.equal(recipeHasCustomIngredientSettings(COST_CALCULATOR_SNAPSHOT, cappuccino, { milk: { price: milk.defaultPrice } }), false);
assert.equal(recipeHasCustomIngredientSettings(COST_CALCULATOR_SNAPSHOT, cappuccino, { milk: { price: milk.defaultPrice + 1 } }), true);
assert.equal(recipeHasCustomIngredientSettings(COST_CALCULATOR_SNAPSHOT, cappuccino, { milk: { size: milk.defaultSize - 1 } }), true);
assert.equal(recipeHasCustomIngredientSettings(COST_CALCULATOR_SNAPSHOT, cappuccino, { cocoa: { price: 999 } }), false);

console.log('calc.test.mjs: passed');
