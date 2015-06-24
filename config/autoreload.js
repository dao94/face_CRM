/**
 * Created by tungtouch on 5/9/15.
 */
// [your-sails-app]/config/autoreload.js

module.exports.autoreload = {
  active: true,
  usePolling: false,
  dirs: [
    "api/models",
    "api/controllers",
    "api/services",
    "api/policies",
    "api/responses"
  ]
};
