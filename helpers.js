export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

export const escapeHTML = (htmlString) => {
  return htmlString
    .replaceAll("<", "&lt;", 
    ">", "&gt;", "&", "&amp;", 
    '"', "&quot;", "&lt;", "<", 
    "&gt;", ">", "&amp;", "&", '&quot;', "");
};


import { getLike, getDislike } from './api.js';
import { getToken } from './index.js';

export function handleLike(postId, isLiked) {
  const token = getToken(); // Получаем токен пользователя
  if (isLiked) {
    return getDislike(postId, { token }) // Передаем токен в getDislike
      .then((post) => {
        console.log('удаляю');
        return post;
      })
      .catch((error) => {
        console.error('Ошибка при дизлайке:', error);
        throw error; 
      });
  } else {
    return getLike(postId, { token }) // Передаем токен в getLike
      .then((post) => {
        console.log('лайкаю')
        return post;
      })
      .catch((error) => {
        console.error('Ошибка при лайке:', error);
        throw error; 
      });
  }
}



function updatePostLikes(postId, likes) {
  const postElement = document.getElementById(postId);
  if (postElement) {
    const likesCountElement = postElement.querySelector('.post-likes-text strong');
    if (likesCountElement) {
      likesCountElement.textContent = likes.length.toString();
    }
  }
}