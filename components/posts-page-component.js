import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage } from "../index.js";
import { escapeHTML } from "../helpers.js";
import { likeButton } from "../api.js";

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

  // Обработчик события для кнопки лайка
  appEl.querySelectorAll(".like-button").forEach((likeButtonElement, index) => {
    likeButtonElement.addEventListener("click", async () => {
      try {
        const updatedPost = await likeButton({ posts, index });
        // Обновление интерфейса после успешного лайка
        updateLikeButtonState(likeButtonElement, updatedPost.isLiked);
        // Дополнительные действия после успешного лайка, если нужно
      } catch (error) {
        console.error("Ошибка при лайке поста:", error);
        // Обработка ошибки, если нужно
      }
    });
  });

  // Рендеринг шапки страницы
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
}

const updateLikeButtonState = (buttonElement, isLiked) => {
  if (isLiked) {
    buttonElement.classList.add("like-active");
    buttonElement.querySelector("img").src = "./assets/images/like-active.svg";
  } else {
    buttonElement.classList.remove("like-active");
    buttonElement.querySelector("img").src = "./assets/images/like-not-active.svg";
  }
};
