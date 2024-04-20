import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage } from "../index.js";
import { escapeHTML } from "../helpers.js";

export function renderUserPageComponent({ appEl, posts }) {
    // Функция для отображения имени и фото пользователя
    const renderUserInfo = (user) => {
      const userInfoHtml = `
        <div class="user-info">
          <img src="${user.imageUrl}" class="user-info__user-image">
          <p class="user-info__user-name">${escapeHTML(user.name)}</p>
        </div>
      `;
      return userInfoHtml;
    };
  
    const renderPost = (post) => {
      const postHtml = `
        <li class="post">
          <div class="post-header" data-user-id="${post.user.id}">
            <div class="user-info-container"></div> <!-- Здесь будет отображаться имя и фото пользователя -->
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-text">
            ${escapeHTML(post.description)}
          </div>
          <p class="post-date">
            ${formatDate(post.createdAt)}
          </p>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
              <img src="./assets/images/like-active.svg">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.likes}</strong>
            </p>
          </div>
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
        ${renderUserInfo(posts[0].user)} <!-- Отображаем имя и фото пользователя -->
        <ul class="posts">
          ${posts.map(renderPost).join('')}
        </ul>
      </div>`;
  
    appEl.innerHTML = appHtml;
  
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
  }
  