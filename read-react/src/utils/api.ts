const SERVER_URL = '/';

const jsonRequest = (url: string, options = {}) => {
  return fetch(SERVER_URL + url, {
    headers: { 'content-type': 'application/json' },
    ...options,
  }).then((response) => response.json());
};

export const getRequest = (url: string, o = {}) => {
  const options = {
    method: 'GET',
    ...o,
  };

  const req = jsonRequest(url, options);

  return req;
};

export const postRequest = (url: string, data: any) => {
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
  };

  const req = jsonRequest(url, options);

  return req;
};

export const putRequest = (url: string, data: any) => {
  const options = {
    method: 'PUT',
    body: JSON.stringify(data),
  };

  const req = jsonRequest(url, options);

  return req;
};

export const deleteRequest = (url: string, o = {}) => {
  const options = {
    method: 'DELETE',
    ...o,
  };

  const req = jsonRequest(url, options);

  return req;
};

export const fetchBook = (book: string) => {
  const req = getRequest(`data\\${book}.json`);

  return req;
};