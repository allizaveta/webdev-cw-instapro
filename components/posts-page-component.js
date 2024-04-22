import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage } from "../index.js";
import { escapeHTML, handleLike } from "../helpers.js";
import { getDislike, getLike } from "../api.js";

export function renderPostsPageComponent({ appEl, posts }) {
  const renderPost = (post, index) => {
    const isLiked = post.isLiked ? 'true' : 'false'; 
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
          <button data-post-id="${post.id}" data-liked="${isLiked}" class="like-button">
            <img src="./assets/images/${post.isLiked ? 'like-active' : 'like-not-active'}.svg"> <!-- Изменяем путь к изображению в зависимости от лайка -->
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

  // Обработчики событий для клика по кнопке лайка
  const likesButtons = appEl.querySelectorAll('.like-button');
  likesButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const id = button.dataset.postId;
      const isLiked = button.dataset.liked === 'true'; 

      handleLike(id, isLiked)
        .then((updatedPost) => {
          updateLikeButton(id, isLiked);
        })
        .catch((error) => {
          console.error("Ошибка при обработке лайка:", error);
        });
    });
  });
}

function updateLikeButton(postId, isLiked) {
  const likeButton = document.querySelector(`[data-post-id="${postId}"]`);
  if (likeButton) {
    const likeImage = likeButton.querySelector('img');
    if (isLiked) {
      likeImage.src = './assets/images/like-active.svg'; 
    } else {
      likeImage.src = './assets/images/like-not-active.svg'; 
    }
    likeButton.dataset.liked = isLiked ? 'true' : 'false'; 
  }
}
