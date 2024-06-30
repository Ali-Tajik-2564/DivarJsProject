import {
  addParamToUrl,
  baseUrl,
  calculateRelativeTime,
  getFromLocalStorage,
  getParamFromUrl,
  getPosts,
  getPostsCategories,
  removeParamFromUrl,
} from '../utils/shared';

const $ = document;

window.addEventListener('load', () => {
  const categoryID = getParamFromUrl('categoryID');
  const loadingContainer = document.querySelector('#loading-container');

  const cities = getFromLocalStorage('cities');

  getPosts(cities[0].id).then((response) => {
    loadingContainer.style.display = 'none';

    const posts = response.data.posts;

    generatePosts(posts);
  });

  const generatePosts = (posts) => {
    const postsContainer = document.querySelector('#posts-container');
    if (posts.length) {
      posts.forEach((post) => {
        const date = calculateRelativeTime(post.createdAt);
        postsContainer.insertAdjacentHTML(
          'beforeend',
          `
            <div class="col-4">
              <a href="post.html/id=${post._id}" class="product-card">
                <div class="product-card__right">
                  <div class="product-card__right-top">
                    <p class="product-card__link">${post.title}</p>
                  </div>
                  <div class="product-card__right-bottom">
                    <span class="product-card__condition">${
                      post.dynamicFields[0].data
                    }</span>
                    <span class="product-card__price">
                      ${
                        post.price === 0
                          ? 'توافقی'
                          : post.price.toLocaleString() + ' تومان'
                      }
                    </span>
                    <span class="product-card__time">${date}</span>
                  </div>
                </div>
                <div class="product-card__left">
                ${
                  post.pics.length
                    ? `
                      <img
                        class="product-card__img img-fluid"
                        src="${baseUrl}/${post.pics[0].path}"
                      />`
                    : `
                      <img
                        class="product-card__img img-fluid"
                        src="/public/images/main/noPicture.PNG"
                      />`
                }
                  
                </div>
              </a>
            </div>
        
          `
        );
      });
    } else {
      postsContainer.innerHTML = '<p class="empty">آگهی یافت نشد</p>';
    }
  };

  window.categoryClickHandler = (categoryID) => {
    addParamToUrl('categoryID', categoryID);
  };
  window.backToAllCategories = () => {
    removeParamFromUrl('categoryID');
  };

  getPostsCategories().then((categories) => {
    const categoriesContainer = document.querySelector('#categories-container');
    loadingContainer.style.display = 'none';

    categoriesContainer.innerHTML = '';

    console.log(categoryID);
    if (categoryID) {
      const categoryInfos = categories.filter(
        (category) => category._id === categoryID
      );
      console.log('categoryInfos ->', categoryInfos);

      if (!categoryInfos.length) {
        const subCategory = findSubCategoryById(categories, categoryID);
        console.log(subCategory);
        if (subCategory) {
          categoriesContainer.insertAdjacentHTML(
            'beforeend',
            `
                <div class="all-categories">
                  <p onclick="backToAllCategories()">همه اگهی ها</p>
                  <i class="bi bi-arrow-right"></i>
                </div>
                <div
                  class="sidebar__category-link active-category"
                  href="#"
                  id="category-${subCategory._id}"
                >
                  <div class="sidebar__category-link_details">
                    <i class="sidebar__category-icon bi bi-house"></i>
                    <p>${subCategory.title}</p>
                  </div>
                  <ul class="subCategory-list">
                    ${subCategory.subCategories
                      .map(createSubCategoryHtml)
                      .join('')}
                  </ul>
                </div>
            `
          );
        } else {
        }
      } else {
        categoryInfos.forEach((category) => {
          categoriesContainer.insertAdjacentHTML(
            'beforeend',
            `
              <div class="all-categories">
                <p onclick="backToAllCategories()">همه اگهی ها</p>
                <i class="bi bi-arrow-right"></i>
              </div>

              <div class="sidebar__category-link active-category" href="#">
                <div class="sidebar__category-link_details">
                  <i class="sidebar__category-icon bi bi-house"></i>
                  <p>${category.title}</p>
                </div>
                <ul class="subCategory-list">
                  ${category.subCategories.map(createSubCategoryHtml).join('')}
                </ul>
              </div>
          
            `
          );
        });
      }
    } else {
      categories.forEach((category) => {
        categoriesContainer.insertAdjacentHTML(
          'beforeend',
          `
            <div class="sidebar__category-link" id="category-${category._id}">
              <div class="sidebar__category-link_details" onclick="categoryClickHandler('${category._id}')">
                <i class="sidebar__category-icon bi bi-house"></i>
                <p>${category.title}</p>
              </div>
            </div>
          `
        );
      });
    }
  });

  const createSubCategoryHtml = (subCategory) => {
    return `
    <li class="${categoryID === subCategory._id ? 'active-subCategory' : ''}"
    onclick="categoryClickHandler('${subCategory._id}')"
  >
    ${subCategory.title}
  </li>

    `;
  };
  const findSubCategoryById = (categories, categoryID) => {
    const allSubCategories = categories.flatMap(
      (category) => category.subCategories
    );

    return allSubCategories.find(
      (subCategory) => subCategory._id === categoryID
    );
  };
});
