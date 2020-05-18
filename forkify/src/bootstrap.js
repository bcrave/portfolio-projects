import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global state of the app
 * - search object contains
 * - current recipe object
 * - shopping list object
 * - liked recipes
 */

const state = {};
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
