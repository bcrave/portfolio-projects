import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";

import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";

import { elements, renderLoader, clearLoader } from "./views/base";

/** Global state of the app
 * - search object contains
 * - current recipe object
 * - shopping list object
 * - liked recipes
 */

const state = {};
window.state = state;

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1. get query
  const query = searchView.getInput();

  if (query) {
    // 2. new search object and add to state
    state.search = new Search(query);

    // 3. prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      // 4. search for recipes
      await state.search.getResults();

      // 5. render results on UI
      clearLoader();
      searchView.renderRecipes(state.search.recipes);

      // console.log(state.search.recipes);
    } catch (error) {
      alert("Something went wrong with the search...");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", (event) => {
  const button = event.target.closest(".btn-inline");

  if (button) {
    const goToPage = parseInt(button.dataset.goto, 10);

    searchView.clearResults();
    searchView.renderRecipes(state.search.recipes, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  // GET ID from url
  const id = window.location.hash.replace("#", "");
  console.log(id);

  if (id) {
    // prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      // get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // calculate servings and time
      state.recipe.calcServings();
      state.recipe.calcTime();

      // render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (err) {
      alert("Error processing recipe");
    }
  }
};

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/**
 * LIST CONTROLLER
 */
const controlList = () => {
  // Create a new list if there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Handle delete and update list events
elements.shopping.addEventListener("click", (event) => {
  const id = event.target.closest(".shopping__item").dataset.itemid;

  // Handle delete and update list item events
  if (event.target.matches(".shopping__delete, .shopping__delete *")) {
    // delete from state
    state.list.deleteItem(id);

    // delete from UI
    listView.deleteItem(id);

    // Handle count update
  } else if (event.target.matches(".shopping__count-value")) {
    state.list.count = 0;
    const val = parseFloat(event.target.value, 10);
    if (val > 0) {
      state.list.updateCount(id, val);
    }
  }
});

// Handling recipe button clicks
elements.recipe.addEventListener("click", (event) => {
  if (event.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    controlList();
  }
});
