import { addParamToUrl, getAndShowSocials } from '../utils/shared';
const $ = document;
window.addEventListener('load', () => {
  getAndShowSocials();

  const globalSearchInput = $.querySelector('#global_search_input');

  globalSearchInput?.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (event.target.value.trim()) {
        addParamToUrl('value', event.target.value.trim());
      }
    }
  });
});
