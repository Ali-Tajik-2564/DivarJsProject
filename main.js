import { getAllCities, saveInLocalStorage } from './utils/shared';
const $ = document;
window.addEventListener('load', () => {
  const loadingContainer = document.querySelector('#loading-container');

  getAllCities().then((response) => {
    loadingContainer.style.display = 'none';
    const popularCitiesContainer = document.querySelector('#popular-cities');
    const searchInput = $.querySelector('#search-input');
    const searchResultInput = $.querySelector('.search-result-cities');
    searchInput.addEventListener('keyup', (event) => {
      if (event.target.value.trim()) {
        searchResultInput.classList.add('active');
        const searchResultCities = response.data.cities.filter((city) =>
          city.name.startsWith(event.target.value)
        );
        if (searchResultCities.length) {
          searchResultInput.innerHTML = '';
          searchResultCities.forEach((city) => {
            searchResultInput.insertAdjacentHTML(
              'beforeend',
              `
              <li onclick="cityClickHandler('${city.name}' ,'${city.id}' )">
              ${city.name}
              </li>
              `
            );
          });
        } else {
          searchResultInput.innerHTML = '';

          searchResultInput.insertAdjacentHTML(
            'beforeend',
            `
          <img src="https://support-faq.divarcdn.com/web/2024/03/static/media/magnifier.7f88b2e3f8ae30f4333986d0b0fbcf1d.svg"/>
          <p class="empty">نتیجه ای برای جستحوی شما یافت نشد</p>
          `
          );
        }
      } else {
        searchResultInput.classList.remove('active');
      }
    });

    const popularCities = response.data.cities.filter((city) => city.popular);
    popularCities.forEach((city) => {
      popularCitiesContainer.insertAdjacentHTML(
        'beforeend',
        `
        <li class="main__cities-item" onclick="cityClickHandler('${city.name}' ,'${city.id}' )">
            <p class="main__cities-link">${city.name}</p>
        </li>
      `
      );
    });
    window.cityClickHandler = (cityName, CityId) => {
      saveInLocalStorage('cities', [{ id: CityId, name: cityName }]);
      location.href = '/pages/posts.html';
    };
  });
});
