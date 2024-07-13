import {
  calcuteRelativeTimeDifference,
  getPostDetails,
} from '../utils/shared.js';

window.addEventListener('load', () => {
  getPostDetails().then((post) => {
    const loading = document.querySelector('#loading-container');
    loading.style.display = 'none';
    console.log(post);

    const postTitle = document.querySelector('#post-title');
    const postDescription = document.querySelector('#post-description');
    const postLocation = document.querySelector('#post-location');
    const postBreadCrumb = document.querySelector('#breadcrumb');
    const shareIcon = document.querySelector('#share-icon');
    const postInfos = document.querySelector('#post-infoes-list');
    const postPreview = document.querySelector('#post-preview');
    const mainSlider = document.querySelector('#main-slider-wrapper');
    const secendSlider = document.querySelector('#secend-slider-wrapper');
    const noteTextarea = document.querySelector('#note-textarea');
    const postFeedbackIcons = document.querySelectorAll('.post_feedback_icon');
    const date = calcuteRelativeTimeDifference(post.createdAt);

    postTitle.innerHTML = post.title;
    postDescription.innerHTML = post.description;

    postLocation.innerHTML = `${date} ساعت پیش در ${post.city.name} , ${
      post?.neighborhood ? post?.neighborhood?.name : ''
    }`;

    postBreadCrumb.insertAdjacentHTML(
      'beforeend',
      `
          <li class="main__breadcrumb-item">
            <a href='/pages/posts.html?categoryID=${post.breadcrumbs.category._id}' id="category-breadcrumb">${post.breadcrumbs.category.title}</a>
            <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
          </li>
          <li class="main__breadcrumb-item">
            <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subCategory.title}</a>
            <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
          </li>
          <li class="main__breadcrumb-item">
            <a href='/pages/posts.html?categoryID=${post.breadcrumbs.subSubCategory._id}' id="category-breadcrumb">${post.breadcrumbs.subSubCategory.title}</a>
            <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
          </li>
          <li class="main__breadcrumb-item">${post.title}</li>    
        `
    );

    shareIcon.addEventListener('click', async () => {
      await navigator.share(location.href);
    });

    postInfos.insertAdjacentHTML(
      'beforeend',
      `
          <li class="post__info-item">
            <span class="post__info-key">قیمت</span>
            <span class="post__info-value">${post.price.toLocaleString()} تومان</span>
          </li>
        `
    );

    post.dynamicFields.map((filed) => {
      postInfos.insertAdjacentHTML(
        'beforeend',
        `
            <li class="post__info-item">
              <span class="post__info-key">${filed.name}</span>
              <span class="post__info-value">${filed.data}</span>
            </li>
          `
      );
    });
  });
});
