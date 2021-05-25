/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  if (!options.data) {
    return;
  }

  let formData = new FormData();
  const xhr = new XMLHttpRequest();

  xhr.withCredentials = true;
  xhr.responseType = options.responseType;

  if (options.method === 'GET') {
    try {
      let url = options.url;
      url += '?';

      for (let key in options.data) {
        url += `${key}=${options.data[key]}&`;
      }
      url = url.slice(0, -1);

      xhr.open(options.method, url);
      xhr.onload = function () {
        options.callback(null, xhr.response);
      }
      xhr.send();

    } catch (err) {
      options.callback(err);
    }
  } else {
    for (let key in options.data) {
      formData.append(`${key}`, `${options.data[key]}`);
    }

    try {
      xhr.open(options.method, options.url);
      xhr.onload = function () {
        options.callback(null, xhr.response);
      }
      xhr.send(formData);

    } catch (err) {
      options.callback(err);
    }
  }
}


