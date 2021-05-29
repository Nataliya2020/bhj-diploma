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
  let url = options.url;
  let urlGet = '';

  xhr.withCredentials = true;
  xhr.responseType = 'json';


  if (options.method === 'GET') {
    url += '?';

    for (let key in options.data) {
      urlGet = url + `${key}=${options.data[key]}&`;
    }

    urlGet = urlGet.slice(0, -1);

  } else {
    for (let key in options.data) {
      formData.append(`${key}`, `${options.data[key]}`);
    }
  }

  try {
    options.method === 'GET' ? xhr.open(options.method, urlGet) : xhr.open(options.method, url);
    options.method === 'GET' ? xhr.send() : xhr.send(formData);
  } catch (err) {
    options.callback(err);
  }

  xhr.onload = function() {
    options.callback(null, xhr.response);
  }
}
