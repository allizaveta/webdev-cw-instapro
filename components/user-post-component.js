import { renderHeaderComponent } from "./header-component.js";
import { updateLikeButton } from "./posts-page-component.js";
import { handleLike, escapeHTML } from "../helpers.js";


export function renderUserPageComponent({ appEl, posts }) {
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
    const isLiked = post.isLiked ? 'true' : 'false'; 
    const likesCount = post.likes.length;

    let likesText = "Нравится:";
    if (likesCount === 0) {
      likesText += " 0";
    } else if (likesCount === 1) {
      likesText += ` ${escapeHTML(post.likes[0].name)}`;
    } else {
      likesText += ` ${escapeHTML(post.likes[0].name)} и еще ${likesCount - 1}`;
    }
    const postHtml = `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
          <div class="user-info-container"></div>
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
          <button data-post-id="${post.id}" data-liked="${isLiked}" class="like-button">
            <img src="./assets/images/${post.isLiked ? 'like-active' : 'like-not-active'}.svg">
          </button>
          <p class="post-likes-text">
            ${likesText}
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
      ${renderUserInfo(posts[0].user)}
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
};