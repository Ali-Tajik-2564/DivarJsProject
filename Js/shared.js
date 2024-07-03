import {
  hideModal,
  addParamToUrl,
  getAndShowSocials,
  showModal,
  getParamFromUrl,
} from '../utils/shared';
const $ = document;
window.addEventListener('load', () => {
  getAndShowSocials();

  const globalSearchInput = $.querySelector('#global_search_input');
  const searchBarModalOverLay = $.querySelector('.searchbar__modal--overlay');
  const mostSearchContainer = $.querySelector('#most_searched');
  const mostSearchKeyWords = ['ماشین', 'گوشی', 'لپ تاب', 'تلوزیون', 'کامپیوتر'];

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
