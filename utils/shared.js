const baseUrl = 'https://divarapi.liara.run';
const $ = document;
const getAllCities = async () => {
  const res = await fetch(`${baseUrl}/v1/location`);
  const cities = await res.json();

  return cities;
};
const getAndShowSocials = async () => {
  const SocialsContainer = $.querySelector('#footer__social-media');
  const res = await fetch(`${baseUrl}/v1/social`);
  const socialIcon = await res.json();

  socialIcon.data.socials.forEach((social) => {
    SocialsContainer.insertAdjacentHTML(
      'beforeend',
      `
      <a href=${social.link} class="sidebar__icon-link"
      ><img
        src=${social.icon.path}
        alt=${social.name}
        width="18px"
        height="18px"
        class="sidebar__icon bi bi-twitter" />
    </a>

    `
    );
  });
};
const getPosts = async (citiesId) => {
  const url = `${baseUrl}/v1/post/?city=${citiesId}`;
  const res = await fetch(url);
  const posts = await res.json();
  return posts;
};
const saveInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const getFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
const getPostsCategories = async () => {
  const res = await fetch(`${baseUrl}/v1/category`);
  const result = await res.json();
  return result.data.categories;
};
const getParamFromUrl = (key) => {
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get(key);
};

const calculateRelativeTime = (createdAt) => {
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

const addParamToUrl = (param, value) => {
  const url = new URL(location.href);
  const searchParams = url.searchParams;
  searchParams.set(param, value);
  url.search = searchParams.toString();
  location.href = url.toString();
};
const removeParamFromUrl = (param) => {
  const url = new URL(location.href);
  url.searchParams.delete(param);
  window.history.replaceState(null, null, url);
  location.reload();
};
export {
  baseUrl,
  getAllCities,
  getAndShowSocials,
  getFromLocalStorage,
  saveInLocalStorage,
  getPosts,
  getPostsCategories,
  addParamToUrl,
  calculateRelativeTime,
  getParamFromUrl,
  removeParamFromUrl,
};
