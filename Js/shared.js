import {
  getAllLocations,
  getAndShowHeaderCityLocation,
  getAndShowSocials,
  addParamToUrl,
  getFromLocalStorage,
  getUrlParam,
  hideModal,
  saveInLocalStorage,
  showModal,
  removeParamFromUrl,
  getPostCategories,
} from './../utils/shared';

window.addEventListener('load', () => {
  getAndShowSocials();
  getAndShowHeaderCityLocation();

  let selectedCities = [];
  let allCities = [];

  const globalSearchInput = document.querySelector('#global_search_input');
  const mostSearchedContainer = document.querySelector('#most_searched');
  const headerCity = document.querySelector('.header__city');
  const deleteAllSelectedCities = document.querySelector('#delete-all-cities');
  const citiesModalList = document.querySelector('#city_modal_list');
  const cityModalAcceptBtn = document.querySelector('.city-modal__accept');
  const cityModalCloseBtn = document.querySelector('.city-modal__close');
  const cityModalError = document.querySelector('#city_modal_error');
  const cityModalOverlay = document.querySelector('.city_modal_overlay');
  const cityModalCities = document.querySelector('.city-modal__cities');
  const cityModalSearchInput = document.querySelector(
    '#city-modal-search-input'
  );

  const searchbarModalOverlay = document.querySelector(
    '.searchbar__modal-overlay'
  );
  const HeaderCategoryBtn = document.querySelector('.header__category-btn');
  const categoryModalOverlay = document.querySelector(
    '.category_modal_overlay'
  );
  const categoriesList = document.querySelector('#categories-list');
  const allCategoriesPosts = document.querySelector('#all-categories-posts');
  const mostSearchKeyWords = ['ماشین', 'ساعت', 'موبایل', 'لپ تاپ', 'تلویزیون'];

  const categoryResults = document.querySelector('#category-results');

  getPostCategories().then((categories) => {
    console.log('Categories ->', categories);

    categories.forEach((category) => {
      categoriesList.insertAdjacentHTML(
        'beforeend',
        `
          <li class="header__category-menu-item" onmouseenter="showActiveCategorySubs('${category._id}')">
            <div class="header__category-menu-link">
              <div class="header__category-menu-link-right">
                <i class="header__category-menu-icon bi bi-house"></i>
                ${category.title}
              </div>
              <div class="header__category-menu-link-left">
                <i class="header__category-menu-arrow-icon bi bi-chevron-left"></i>
              </div>
            </div>
          </li>
        `
      );
    });
    window.showActiveCategorySubs = (categoryID) => {
      const category = categories.find(
        (category) => category._id === categoryID
      );

      categoryResults.innerHTML = '';

      category.subCategories.map((subCategory) => {
        categoryResults.insertAdjacentHTML(
          'beforeend',
          `
            <div>
              <ul class="header__category-dropdown-list">
                <div class="header__category-dropdown-title" onclick="categoryClickHandler('${
                  subCategory._id
                }')">${subCategory.title}</div>
                ${subCategory.subCategories
                  .map(
                    (subSubCategory) => `
                    <li class="header__category-dropdown-item">
                      <div class="header__category-dropdown-link" onclick="categoryClickHandler('${subSubCategory._id}')">${subSubCategory.title}</div>
                    </li>
                  `
                  )
                  .join('')}
              </ul>
            </div>
          `
        );
      });
    };
    showActiveCategorySubs(categories[0]._id);
    window.categoryClickHandler = (categoryID) => {
      addParamToUrl('categoryID', categoryID);
    };
  });

  globalSearchInput?.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (event.target.value.trim()) {
        // location.href = `posts.html?value=${event.target.value.trim()}`;
        addParamToUrl('value', event.target.value.trim());
      }
    }
  });

  mostSearchKeyWords.forEach((keyword) => {
    const categoryID = getUrlParam('categoryID');

    let href = `posts.html?value=${keyword}${
      categoryID ? `&categoryID=${categoryID}` : ''
    }`;

    mostSearchedContainer.insertAdjacentHTML(
      'beforeend',
      `
        <li class="header__searchbar-dropdown-item">
          <a href="${href}" class="header__searchbar-dropdown-link">${keyword}</a>
        </li>
      `
    );
  });

  headerCity?.addEventListener('click', () => {
    showModal('city-modal', 'city-modal--active');
    const cities = getFromLocalStorage('cities');
    selectedCities = cities;
    deleteAllSelectedCities.style.display = 'block';

    addCityToModal(selectedCities);
  });

  const addCityToModal = (cities) => {
    const citySelected = document.querySelector('#city-selected');

    citySelected.innerHTML = '';

    cities.forEach((city) => {
      citySelected.insertAdjacentHTML(
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
    const currentCity = document.querySelector(`#city-${cityID}`);
    if (currentCity) {
      const checkbox = currentCity.querySelector('input');
      const checkboxShape = currentCity.querySelector('div');
      checkbox.checked = false;
      checkboxShape.classList.remove('active');
    }

    selectedCities = selectedCities.filter((city) => city.id !== cityID);
    addCityToModal(selectedCities);
    toggleCityModalBtns(selectedCities);
  };

  getAllLocations().then((data) => {
    allCities = data;
    showProvinces(allCities);
  });

  const showProvinces = (data) => {
    citiesModalList.innerHTML = '';
    cityModalCities.scrollTo(0, 0);
    data.provinces.forEach((province) => {
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

    const provinceItems = document.querySelectorAll('.province-item');

    provinceItems.forEach((province) => {
      province.addEventListener('click', (event) => {
        const provinceID = event.target.dataset.provinceId;
        const provinceName = event.target.querySelector('span').innerHTML;

        citiesModalList.innerHTML = '';

        citiesModalList.insertAdjacentHTML(
          'beforeend',
          `
            <li id="city_modal_all_province" class="city_modal_all_province">
              <span>همه شهر ها</span>
              <i class="bi bi-arrow-right-short"></i>
            </li>
            <li class="city-modal__cities-item select-all-city city-item">
              <span>همه شهر های ${provinceName} </span>
              <div id="checkboxShape"></div>
              <input type="checkbox" />
            </li>
          `
        );

        const provinceCities = data.cities.filter(
          (city) => city.province_id === Number(provinceID)
        );

        provinceCities.forEach((city) => {
          const isSelect = selectedCities.some(
            (selectedCity) => selectedCity.title === city.name
          );

          citiesModalList.insertAdjacentHTML(
            'beforeend',
            `
              <li class="city-modal__cities-item city-item" id="city-${
                city.id
              }">
                <span>${city.name}</span>
                <div id="checkboxShape" class="${isSelect && 'active'}"></div>
                <input onchange="cityItemClickHandler('${
                  city.id
                }')" id="city-item-checkbox" type="checkbox" checked="${isSelect}" />
              </li>
            `
          );
        });

        const cityModalAllProvinces = document.querySelector(
          '#city_modal_all_province'
        );

        cityModalAllProvinces.addEventListener('click', () => {
          citiesModalList.innerHTML = '';
          showProvinces(data);
        });
      });
    });
  };

  window.cityItemClickHandler = (cityID) => {
    const cityElement = document.querySelector(`#city-${cityID}`);
    const checkbox = cityElement.querySelector('input');
    const cityTitle = cityElement.querySelector('span').innerHTML;
    const checkboxShape = cityElement.querySelector('div');

    selectedCities.forEach((city) => {
      if (city.title === cityTitle) {
        checkbox.checked = true;
        checkboxShape.classList.add('active');
      }
    });

    checkbox.checked = !checkbox.checked;

    if (checkbox.checked) {
      updateSelectedCities(cityTitle, cityID);
      checkboxShape.classList.add('active');
    } else {
      selectedCities = selectedCities.filter(
        (city) => city.title !== cityTitle
      );
      checkbox.checked = true;
      checkboxShape.classList.remove('active');
      addCityToModal(selectedCities);
      toggleCityModalBtns(selectedCities);
    }
  };

  const toggleCityModalBtns = (cities) => {
    if (cities.length) {
      cityModalAcceptBtn.classList.replace(
        'city-modal__accept',
        'city-modal__accept--active'
      );

      deleteAllSelectedCities.style.display = 'block';
      cityModalError.style.display = 'none';
    } else {
      cityModalAcceptBtn.classList.replace(
        'city-modal__accept--active',
        'city-modal__accept'
      );

      deleteAllSelectedCities.style.display = 'none';
      cityModalError.style.display = 'block';
    }
  };

  const updateSelectedCities = (cityTitle, cityID) => {
    const isTitleRepeated = selectedCities.some(
      (city) => city.title === cityTitle
    );

    if (!isTitleRepeated) {
      selectedCities.push({ title: cityTitle, id: cityID });
      toggleCityModalBtns(selectedCities);
      addCityToModal(selectedCities);
    }
  };

  globalSearchInput?.addEventListener('click', () => {
    showModal(
      'header__searchbar-dropdown',
      'header__searchbar-dropdown--active'
    );
  });

  searchbarModalOverlay?.addEventListener('click', () => {
    hideModal(
      'header__searchbar-dropdown',
      'header__searchbar-dropdown--active'
    );
  });

  cityModalAcceptBtn?.addEventListener('click', () => {
    saveInLocalStorage('cities', selectedCities);
    const citiesIDs = selectedCities.map((city) => city.id).join('|');
    addParamToUrl('cities', citiesIDs);
    getAndShowHeaderCityLocation();
    hideModal('city-modal', 'city-modal--active');
    showProvinces(allCities);
  });

  cityModalCloseBtn?.addEventListener('click', () => {
    hideModal('city-modal', 'city-modal--active');

    cityModalAcceptBtn.classList.replace(
      'city-modal__accept--active',
      'city-modal__accept'
    );

    showProvinces(allCities);
  });

  cityModalOverlay?.addEventListener('click', () => {
    hideModal('city-modal', 'city-modal--active');

    cityModalAcceptBtn.classList.replace(
      'city-modal__accept--active',
      'city-modal__accept'
    );
    showProvinces(allCities);
  });
  deleteAllSelectedCities?.addEventListener('click', () => {
    deSelectAllCities();
    selectedCities = [];
    addCityToModal(selectedCities);
    cityModalAcceptBtn.classList.replace(
      'city-modal__accept--active',
      'city-modal__accept'
    );
    cityModalError.style.display = 'block';
    deleteAllSelectedCities.style.display = 'none';
  });
  const deSelectAllCities = () => {
    const cityElements = document.querySelectorAll('.city-item');
    cityElements.foreEach((city) => {
      const checkbox = cityElements.querySelector('input');
      const checkboxShape = cityElements.querySelector('div');
      checkbox.checked = false;
      checkboxShape.classList.remove('active');
    });
  };
  cityModalSearchInput?.addEventListener('keyup', (event) => {
    const FilteredCities = allCities.cities.filter((city) =>
      city.name.startsWith(event.target.value)
    );

    if (event.target.value.trim() && FilteredCities.length) {
      citiesModalList.innerHTML = '';
      FilteredCities.forEach((city) => {
        const isSelect = selectedCities.some(
          (selectedCity) => selectedCity.title === city.name
        );
        citiesModalList.insertAdjacentHTML(
          'beforeend',
          `
        <li class="city-modal__cities-item city-item" id="city-${city.id}">
          <span>${city.name}</span>
          <div id="checkboxShape" class="${isSelect && 'active'}"></div>
          <input onchange="cityItemClickHandler('${
            city.id
          }')" id="city-item-checkbox" type="checkbox" checked="${isSelect}" />
        </li>
        `
        );
      });
    } else {
      citiesModalList.innerHTML = '';
      showProvinces(allCities);
    }
  });
  HeaderCategoryBtn?.addEventListener('click', () => {
    showModal('header__category-menu', 'header__category-menu--active');
  });
  categoryModalOverlay?.addEventListener('click', () => {
    hideModal('header__category-menu', 'header__category-menu--active');
  });
  allCategoriesPosts?.addEventListener('click', () => {
    removeParamFromUrl('categoryID');
  });
});
