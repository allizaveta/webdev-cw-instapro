import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage, getToken } from "../index.js";
import { escapeHTML } from "../helpers.js";
import { like } from "../api.js";

export function renderPostsPageComponent({ appEl, posts }) {
  const renderPost = (post, index) => {
    const postHtml = `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${escapeHTML(post.user.name)}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="./assets/images/like-active.svg">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${escapeHTML(post.user.name)}</span>
          ${escapeHTML(post.description)}
        </p>
        <p class="post-date">
          ${formatDate(post.createdAt)}
        </p>
      </li>
    `;
    return postHtml;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    return `${Math.round(diffInMs / (1000 * 60))} минут назад`;
  };

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${posts.map(renderPost).join('')}
      </ul>
    </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: appEl.querySelector(".header-container"),
  });

  // Обработчики событий для клика по заголовку поста
  appEl.querySelectorAll(".post-header").forEach((postHeaderElement) => {
    postHeaderElement.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: postHeaderElement.dataset.userId,
      });
    });
  });
  likeButton();
}

function likeButton() {
  for (let likesButtons of document.querySelectorAll(".like-button")) {
    likesButtons.addEventListener("click", () => {
      const postId = likesButtons.dataset.id

      const likePosition = (likesButtons.dataset.like == "true") ? "dislike" : "like";

      like({token: getToken(), postId, likePosition})
      .then((post) => {
        const likeItem = document.getElementById(post.id)
        const likePosition = post.isLiked
        let likeSvg = likePosition ? "like-active.svg" : "like-not-active.svg";
        likeItem.innerHTML = `
        <div id="${post.id}" class="post-likes">
          <button data-id="${post.id}" data-like="${post.isLiked}" class="like-button">
            <img src="./assets/images/${likeSvg}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
        </div>`;
      likeButton();
      })
    });
  }
}