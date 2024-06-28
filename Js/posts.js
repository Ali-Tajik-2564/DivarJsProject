import {
  addParamToUrl,
  baseUrl,
  getFromLocalStorage,
  getPosts,
  getPostsCategories,
} from '../utils/shared';

const $ = document;
window.addEventListener('load', () => {
  const loadingContainer = $.querySelector('#loading-container');

  const cities = getFromLocalStorage('cities');

  console.log(cities);

  getPosts(cities[0].id).then((response) => {
    loadingContainer.style.display = 'none';

    const posts = response.data.posts;

    generatePosts(posts);
  });

  const generatePosts = (posts) => {
    const postsContainer = $.querySelector('#posts-container');
    if (posts.length) {
      posts.forEach((post) => {
        // console.log(post);
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
                      <span class="product-card__time">${post.updatedAt.slice(
                        0,
                        10
                      )}</span>
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
      postsContainer.innerHTML = "<p class='empty'>اگهی یافت نشد</p>";
    }
  };
  window.categoryClickHandler = (categoryID) => {
    addParamToUrl('categoryID', categoryID);
  };
  getPostsCategories().then((categories) => {
    const categoriesContainer = document.querySelector('#categories-container');
    loadingContainer.style.display = 'none';

    categoriesContainer.innerHTML = '';

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
  });
});
