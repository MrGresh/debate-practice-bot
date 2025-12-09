const dotenv = require("dotenv");
dotenv.config();

const startApp = require("./app");
const { SERVER_CONFIG } = require("./src/constants");
const { getLogger } = require("./src/utils");
const logger = getLogger(module);

const port = SERVER_CONFIG.PORT;

(async () => {
  try {
    const app = await startApp();
    app.listen(port, () => {
      logger.info(`🚀 Server is listening on port: ${port}`);
    });
  } catch (error) {
    logger.error(`Application failed to start: ${error.message}`);
    process.exit(1);
  }
})();
