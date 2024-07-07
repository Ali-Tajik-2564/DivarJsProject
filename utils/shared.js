const baseUrl = 'https://divarapi.liara.run';

const getAllCities = async () => {
  const res = await fetch(`${baseUrl}/v1/location`);
  const cities = await res.json();

  return cities;
};

const getAllLocations = async () => {
  const res = await fetch(`${baseUrl}/v1/location`);
  const respose = await res.json();

  return respose.data;
};

const getAndShowSocials = async () => {
  const socialMediaContainer = document.querySelector('#footer__social-media');
  const res = await fetch(`${baseUrl}/v1/social`);
  const socialsResponse = await res.json();

  socialsResponse.data.socials.forEach((social) => {
    socialMediaContainer.insertAdjacentHTML(
      'beforeend',
      `
        <a href="${social.link}" class="sidebar__icon-link">
            <img width="18px" height="18px" alt="${social.name}" src="${social.icon}" class="sidebar__icon bi bi-twitter" />
        </a>
      `
    );
  });
};

const getAndShowHeaderCityLocation = async () => {
  const headerCityTitle = document.querySelector('#header-city-title');
  const cities = getFromLocalStorage('cities');

  if (headerCityTitle) {
    if (!cities) {
      saveInLocalStorage('cities', [{ title: 'تهران', id: 301 }]);
      const cities = getFromLocalStorage('cities');
      headerCityTitle.innerHTML = cities[0].title;
    } else {
      if (cities.length === 1) {
        headerCityTitle.innerHTML = cities[0].title;
      } else {
        headerCityTitle.innerHTML = `${cities.length} شهر`;
      }
    }
  }
};

const getPosts = async (citiesIDs) => {
  const categoryID = getUrlParam('categoryID');
  const searchValue = getUrlParam('value');
  let url = `${baseUrl}/v1/post/?city=${citiesIDs}`;

  if (categoryID) {
    url += `&categoryId=${categoryID}`;
  }

  if (searchValue) {
    url += `&search=${searchValue}`;
  }

  const res = await fetch(url);
  const posts = await res.json();

  return posts;
};

const getPostCategories = async () => {
  const res = await fetch(`${baseUrl}/v1/category`);
  const response = await res.json();

  return response.data.categories;
};

const saveInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const addParamToUrl = (param, value) => {
  const url = new URL(location.href);
  const searchParams = url.searchParams;

  searchParams.set(param, value);
  url.search = searchParams.toString();

  location.href = url.toString();
};

const getUrlParam = (param) => {
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get(param);
};

const removeParamFromUrl = (param) => {
  const url = new URL(location.href);
  url.searchParams.delete(param);
  window.history.replaceState(null, null, url);
  location.reload();
};

const calcuteRelativeTimeDifference = (createdAt) => {
  const currentTime = new Date();
  const createdTime = new Date(createdAt);

  const timeDifference = currentTime - createdTime;
  const hours = Math.floor(timeDifference / (60 * 60 * 1000));

  if (hours < 24) {
    return `${hours} ساعت پیش`;
  } else {
    const days = Math.floor(hours / 24);
    return `${days} روز پیش`;
  }
};

const showModal = (id, className) => {
  const element = document.querySelector(`#${id}`);
  element?.classList.add(className);
};

const hideModal = (id, className) => {
  const element = document.querySelector(`#${id}`);
  element?.classList.remove(className);
};

export {
  saveInLocalStorage,
  getFromLocalStorage,
  addParamToUrl,
  getUrlParam,
  calcuteRelativeTimeDifference,
  removeParamFromUrl,
  showModal,
  hideModal,
  baseUrl,
  getAllCities,
  getAllLocations,
  getAndShowSocials,
  getPosts,
  getPostCategories,
  getAndShowHeaderCityLocation,
};
