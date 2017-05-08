"use strict";

const path = require("path");
const querystring = require("querystring");
const baseRequest = include("api-log")(include('config').credentials);

const callApi = urlPath => baseRequest(path.join("/v2", urlPath));

const getAllPages = (apiPath, opts) => new Promise((resolve, reject) => {
  let cumulatedData = [];

  if (!opts) {
    opts = { page: 0 }
  } else if (!Number.isInteger(opts.page)) {
    opts.page = 0;
  }

  (function recur() {
    callApi(apiPath +"?"+ querystring.stringify(opts))
      .then(data => {
        if (!data || !data.length) {
          resolve(cumulatedData.concat(data));
        } else {
          cumulatedData = cumulatedData.concat(data);
          opts.page++;
          recur();
        }
      }).catch(reject);	
  })();
});

module.exports = {
  getAll: getAllPages,
  get: callApi,
};
