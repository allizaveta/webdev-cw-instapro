
import { getLike, getDislike,getPostsWithToken } from './api.js';
import { getToken,setPosts } from './index.js';

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
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
};

export function handleLike(postId, isLiked) {
  console.log('postId:', postId, 'isLiked:', isLiked);
  
  const token = getToken();
  if (isLiked) {
    return getDislike(postId, { token })
      .then((post) => {
        console.log('удаляю');
        return post;
      })
      .catch((error) => {
        console.error('Ошибка при дизлайке:', error);
        throw error; 
      });
  } else {
    return getLike(postId, { token })
      .then((post) => {
        console.log('лайкаю');
        return post;
      })
      .then(() => {
        return getPostsWithToken(); // Получаем новый список постов с токеном
      })
      .then((newPosts) => {
        setPosts(newPosts); // Обновляем список постов
      })
      .catch((error) => {
        console.error('Ошибка при лайке:', error);
        throw error; 
      });
  }
}
