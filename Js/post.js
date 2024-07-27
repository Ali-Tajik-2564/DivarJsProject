import { baseUrl, getPostDetails } from '../utils/shared.js';
import {
  calcuteRelativeTimeDifference,
  getToken,
  getUrlParam,
  isLogin,
  showModal,
  showSwal,
} from '../utils/utils.js';

window.addEventListener('load', () => {
  getPostDetails().then(async (post) => {
    const loading = document.querySelector('#loading-container');
    loading.style.display = 'none';

    console.log('Post ->', post);

    const isUserLogin = await isLogin();
    const token = getToken();

    let noteID = null;
    let bookmarkStatus = null;

    const postTitle = document.querySelector('#post-title');
    const postDescription = document.querySelector('#post-description');
    const postLocation = document.querySelector('#post-location');
    const postBreadcrumb = document.querySelector('#breadcrumb');
    const shareIcon = document.querySelector('#share-icon');
    const postInfos = document.querySelector('#post-infoes-list');
    const postPreview = document.querySelector('#post-preview');
    const mainSlider = document.querySelector('#main-slider-wrapper');
    const secendSlider = document.querySelector('#secend-slider-wrapper');
    const noteTextarea = document.querySelector('#note-textarea');
    const postFeedbackIcons = document.querySelectorAll('.post_feedback_icon');
    const phoneInfoBtn = document.querySelector('#phone-info-btn');
    const noteTrashIcon = document.querySelector('#note-trash-icon');
    const bookmarkIconBtn = document.querySelector('#bookmark-icon-btn');
    const bookmarkIcon = bookmarkIconBtn.querySelector('.bi');

    postTitle.innerHTML = post.title;
    postDescription.innerHTML = post.description;

    const date = calcuteRelativeTimeDifference(post.createdAt);
    postLocation.innerHTML = `${date} در ${post.city.name}، ${
      post.neighborhood ? post?.neighborhood?.name : ''
    }`;

    postBreadcrumb.insertAdjacentHTML(
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
            <span class="post__info-value">${
              typeof filed.data === 'boolean'
                ? filed.data === true
                  ? 'دارد'
                  : 'ندارد'
                : filed.data
            }</span>
          </li>
        `
      );
    });

    phoneInfoBtn.addEventListener('click', () => {
      showSwal(
        `شماره تماس: ${post.creator.phone}`,
        null,
        'تماس گرفتن',
        () => {}
      );
    });

    postFeedbackIcons.forEach((icon) => {
      icon.addEventListener('click', () => {
        postFeedbackIcons.forEach((icon) => icon.classList.remove('active'));
        icon.classList.add('active');
      });
    });

    if (isUserLogin) {
      // Bookmard
      if (post.bookmarked) {
        bookmarkIcon.style.color = 'red';
        bookmarkStatus = true;
      } else {
        bookmarkStatus = false;
      }

      bookmarkIconBtn.addEventListener('click', async () => {
        const postID = getUrlParam('id');

        if (bookmarkStatus) {
          const res = await fetch(`${baseUrl}/v1/bookmark/${postID}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            bookmarkStatus = false;
            bookmarkIcon.style.color = 'gray';
          }
        } else {
          const res = await fetch(`${baseUrl}/v1/bookmark/${postID}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 201) {
            bookmarkStatus = true;
            bookmarkIcon.style.color = 'red';
          }
        }
      });

      // Note
      if (post.note) {
        noteTextarea.value = post.note.content;
        noteTrashIcon.style.display = 'block';
        noteID = post.note._id;
      }
      noteTextarea.addEventListener('keyup', (event) => {
        if (event.target.value.trim()) {
          noteTrashIcon.style.display = 'block';
        } else {
          noteTrashIcon.style.display = 'none';
        }
      });

      noteTextarea.addEventListener('blur', async (event) => {
        if (noteID) {
          await fetch(`${baseUrl}/v1/note/${noteID}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              content: event.target.value,
            }),
          });
        } else {
          await fetch(`${baseUrl}/v1/note`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              postId: post._id,
              content: event.target.value,
            }),
          });
        }
      });

      noteTrashIcon.addEventListener('click', () => {
        noteTextarea.value = '';
        noteTrashIcon.style.display = 'none';
      });
    } else {
      noteTextarea.addEventListener('focus', (event) => {
        event.preventDefault();
        showModal('login-modal', 'login-modal--active');
      });
    }

    if (post.pics.length) {
      post.pics.map((pic) => {
        mainSlider.insertAdjacentHTML(
          'beforeend',
          `
            <div class="swiper-slide">
              <img src="${baseUrl}/${pic.path}" />
            </div>
          `
        );

        secendSlider.insertAdjacentHTML(
          'beforeend',
          `
            <div class="swiper-slide">
              <img src="${baseUrl}/${pic.path}" />
            </div>
          `
        );
      });
    } else {
      postPreview.style.display = 'none';
    }

    const mainSliderConfigs = new Swiper('.mySwiper', {
      spaceBetween: 10,
      rewind: true,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    const secondSliderConfigs = new Swiper('.mySwiper2', {
      spaceBetween: 10,
      rewind: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      thumbs: {
        swiper: mainSliderConfigs,
      },
    });
  });
});
