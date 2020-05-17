import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global state of the app
 * - search object contains
 * - current recipe object
 * - shopping list object
 * - liked recipes
 */

const state = {};

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

    // 4. search for recipes
    await state.search.getResults();

    // 5. render results on UI
    // clearLoader();
    searchView.renderRecipes(state.search.recipes);
  }
};

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  controlSearch();
});
