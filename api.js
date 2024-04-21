import { getToken } from "./index.js";
import { getUserFromLocalStorage } from "./helpers.js";
const personalKey = "elizaveta-aleksandrova";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function addPost({ description, imageUrl }) {
  return fetch(postsHost, {
    method: 'POST',
    headers: {
      Authorization: getToken(),
    },
    body: JSON.stringify({
      description,
      imageUrl,
    }),
  })
  .then((response) => {
    return response.json();
  })
}

export function getUserPosts({id}) {
  console.log(id);
  return fetch(postsHost + `/user-posts/${id}`, {
    method: "GET",
  }).then((response) => {
    return response.json();
  }).then((data) => {
    return data.posts;
  });
}

export function addLikeToAPI(postId) {
  const url = `${postsHost} + /posts/${postId}/likes`;
  const userId = getUserFromLocalStorage().id;
  const data = { userId, name: 'Админ' }; // Можно заменить на имя пользователя или получить его из данных пользователя
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = fetch(url, options);
  if (!response.ok) {
    throw new Error('Не получилось поставить лайк');
  }
}

export function deleteLikeFromAPI(postId) {
  const url = `your_api_endpoint/posts/${postId}/likes`;
  const userId = getUserFromLocalStorage().id;

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  };

  const response = fetch(url, options);
  if (!response.ok) {
    throw new Error('Не получилось удалить лайк');
  }
}

export function like(postId) {
  const token = getToken();
  const url = `${postsHost}/${postId}/like`;
  const data = { userId: getUserId(), username: getUsername() };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(data),
  };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to like the post');
      }
      return response.json();
    })
    .then((data) => {
      return data.post;
    });
}

export function unlikePost(postId) {
  const token = getToken();
  const url = `${postsHost}/${postId}/like`;
  const userId = getUserId();
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({ userId }),
  };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to remove the like');
      }
    });
}

// Функция для получения ID текущего пользователя из localStorage или другого источника
export function getUserId() {
  const user = getUserFromLocalStorage(); 
  if (user) {
    return user.id;
  } else {
    throw new Error('Пользователь не авторизован');
  }
}

export function getUsername() {
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);
  return user ? user.username : null;
}
