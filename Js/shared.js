import {
  hideModal,
  addParamToUrl,
  getAndShowSocials,
  showModal,
  getParamFromUrl,
  getAndShowHeaderCities,
  getFromLocalStorage,
  getAllLocations,
} from '../utils/shared';
const $ = document;
window.addEventListener('load', () => {
  getAndShowSocials();
  getAndShowHeaderCities();

  let selectedCities = [];
  let allCities = [];

  const globalSearchInput = $.querySelector('#global_search_input');
  const searchBarModalOverLay = $.querySelector('.searchbar__modal--overlay');
  const mostSearchContainer = $.querySelector('#most_searched');
  const mostSearchKeyWords = ['ماشین', 'گوشی', 'لپ تاب', 'تلوزیون', 'کامپیوتر'];
  const headerCity = $.querySelector('.header__city');
  const deleteAllSelectedCity = $.querySelector('#delete-all-cities');
  const citiesModalList = document.querySelector('#city_modal_list');

  globalSearchInput?.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (event.target.value.trim()) {
        addParamToUrl('value', event.target.value.trim());
      }
    }
  });

  mostSearchKeyWords.forEach((keyword) => {
    const categoryID = getParamFromUrl('categoryID');
    let href = `posts.html?value=${keyword}${
      categoryID ? `&categoryID=${categoryID}` : ''
    }`;
    mostSearchContainer.insertAdjacentHTML(
      'beforeend',
      `
    
      <li class=""header__searchbar-dropdown-item>
      <a href="${href}" class="header__searchbar-dropdown-link">${keyword}</a>
      </li>  
    
    `
    );
  });
  headerCity?.addEventListener('click', () => {
    showModal('city-modal', 'city-modal--active');
    const cities = getFromLocalStorage('cities');
    selectedCities = cities;

    deleteAllSelectedCity.style.display = 'block';
    addCityToModal(selectedCities);
  });

  const addCityToModal = (selectedCities) => {
    const selectedCitiesContainer = $.querySelector('#city-selected');
    selectedCities.forEach((city) => {
      selectedCitiesContainer.insertAdjacentHTML(
        'beforeend',
        `
        <div class="city-modal__selected-item">
        <span class="city-modal__selected-text">${city.title}</span>
        <button class="city-modal__selected-btn" onclick="removeCityFromModal('${city.id}')">
          <i class="city-modal__selected-icon bi bi-x"></i>
        </button>
      </div>

      `
      );
    });
  };
  window.removeCityFromModal = (cityID) => {
    ////
  };
  getAllLocations().then((data) => {
    console.log('Locations ->', data);

    allCities = data;
    showProvinces(allCities);
  });

  const showProvinces = (cities) => {
    cities.provinces.forEach((province) => {
      citiesModalList.insertAdjacentHTML(
        'beforeend',
        `
          <li
            class="city-modal__cities-item province-item"
            data-province-id="${province.id}"
          >
            <span>${province.name}</span>
            <i class="city-modal__cities-icon bi bi-chevron-left"></i>
          </li>
        `
      );
    });
  };

  globalSearchInput?.addEventListener('click', () => {
    showModal(
      'header__searchbar-dropdown',
      'header__searchbar-dropdown--active'
    );
  });
  searchBarModalOverLay?.addEventListener('click', () => {
    hideModal(
      'header__searchbar-dropdown',
      'header__searchbar-dropdown--active'
    );
  });
});
