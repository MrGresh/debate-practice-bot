const { apiLimiter } = require("./apiLimiter.middleware");
const { protect } = require("./auth.middleware");

module.exports = {
  apiLimiter,
  protect,
};
