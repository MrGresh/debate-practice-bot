const express = require("express");
const { vapiAssistantsController } = require("../controllers");

const protectedRouter = express.Router();

protectedRouter.get("/list", vapiAssistantsController.listAssistants);
protectedRouter.get("/:id", vapiAssistantsController.getAssistantById);
protectedRouter.delete("/:id", vapiAssistantsController.deleteAssistantById);

module.exports = {
  protectedRoutes: protectedRouter,
};
