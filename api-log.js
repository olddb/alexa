"use strict";

const oauth2Builder = require('simple-oauth2');

function generateApi(credentials) {
  const oauth2 = oauth2Builder(credentials);

  let _token;

  const _errorList = [];
  const MAX_ERROR_BEFORE_PROCESS_EXIT = 20;

  function callApi(urlPath, access_token, resolve, reject) {
    oauth2.api('GET', urlPath, { access_token }, (err, res) => (err)
  	    ? reject(err) : resolve(res));
    _errorList.length = 0;
  }

  function apiRequest(urlPath, resolve, reject) {
    if (!_token) {
      oauth2.client.getToken({}, (error, result) => {
        if (error) { return _errorList.push(error) }
        _token = oauth2.accessToken.create(result);
        if (_errorList.length > MAX_ERROR_BEFORE_PROCESS_EXIT) {
          reject(new Error(_errorList[0]));
        } else {
          apiRequest(urlPath, resolve, reject);
        }
      });
    } else if (_token.expired()) {
      _token.refresh((error, result) => {
        _token = error ? null : result;
        apiRequest(urlPath, resolve, reject);
      });
    } else {
      callApi(urlPath, _token.token.access_token, resolve, reject);
    }
  }

  return urlPath => new Promise((resolve, reject) =>
    apiRequest(urlPath, resolve, reject));
}

module.exports = generateApi;

