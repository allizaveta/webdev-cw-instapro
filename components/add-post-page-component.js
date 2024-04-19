import { escapeHTML } from "../helpers.js";
import { getToken } from "../index.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = '';

  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <label>Описание:</label>
          <textarea class="input textarea" id='textarea-input' rows="4"></textarea>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>`;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById('textarea-input');
      if (description.value === "") {
        alert('Заполните поле');
      } else if (!imageUrl) {
        alert('Добавьте фотографию');
      } else {
        onAddPostClick({
          token: getToken(),
          description: description.value,
          imageUrl,
        });
      }
    });
  };

  render();
}
