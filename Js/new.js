import { baseUrl } from '../utils/shared.js';
import { isLogin } from '../utils/utils.js';

window.addEventListener('load', async () => {
  const loading = document.querySelector('#loading-container');
  const showCategoies = document.querySelector('.show-categoies');
  const categoriesContainer = document.querySelector('#categories-container');
  const categoriesSection = document.querySelector('#categories');
  const descriptionCheckbox = document.querySelector('#description-checkbox');

  const isUserLogin = await isLogin();

  if (!isUserLogin) {
    return (location.href = '/pages/posts.html');
  }

  loading.style.display = 'none';

  showCategoies.addEventListener('click', () => {
    showCategoies.classList.remove('active');
    categoriesContainer.classList.add('active');
  });

  const generateCategoriesTemplate = (categories) => {
    categoriesSection.innerHTML = '';

    categories.map((category) => {
      categoriesSection.insertAdjacentHTML(
        'beforeend',
        `
            <div class="box">
                <div class="details">
                <div>
                    <i class="bi bi-house-door"></i>
                    <p>${category.title}</p>
                </div>
            
                ${
                  descriptionCheckbox.checked
                    ? `<span>${category.description}</span>`
                    : ''
                }
                
                </div>
                <i class="bi bi-chevron-left"></i>
            </div>
        `
      );
    });
  };

  const res = await fetch(`${baseUrl}/v1/category`);
  const response = await res.json();
  const categories = response.data.categories;

  generateCategoriesTemplate(categories);

  descriptionCheckbox.addEventListener('change', () => {
    generateCategoriesTemplate(categories);
  });
});
