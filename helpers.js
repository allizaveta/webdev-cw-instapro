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


import { like, unlikePost } from './api.js';

export function handleLike(postId, isLiked) {
  if (isLiked) {
    unlikePost(postId)
      .then((post) => {
        updatePostLikes(postId, post.likes);
      })
      .catch((error) => {
        console.error('Ошибка при дизлайке:', error);
      });
  } else {
    like(postId)
      .then((post) => {
        updatePostLikes(postId, post.likes);
      })
      .catch((error) => {
        console.error('Ошибка при лайке:', error);
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