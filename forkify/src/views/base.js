export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchRes: document.querySelector(".results"),
  searchResList: document.querySelector(".results__list"),
};

export const elementStrings = {
  loader: "loader",
};

export const renderLoader = (parent) => {
  const loader = `
    <div class="${elementStrings.loader}">
        <svg>
            <use href="../../static/assets/img/loader.svg"></use> 
        </svg>
    </div>
  `; //#icon-cw --possible add this to the end of loader.svg?
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    loader.parentElement.removeChild(loader);
  }
};
