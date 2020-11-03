const commonHeaders = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
};

export const getOptions = {
  method: 'GET',
  uri: 'https://justin.ua/tracking',
  headers: commonHeaders,
  resolveWithFullResponse: true
};

export const getPostOptions = (token, cookieCsrfToken, number) => ({
  method: 'POST',
  uri: 'https://justin.ua/tracking',
  headers: {
    ...commonHeaders,
    'Cookie': cookieCsrfToken
  },
  body: {
    _token: token,
    number: `${number}`
  },
  json: true,
  resolveWithFullResponse: true
});
