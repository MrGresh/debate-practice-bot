const { VAPI_CONFIG } = require("../constants");
const { getLogger } = require("../utils");
const logger = getLogger(module);

exports.listAssistants = async () => {
  const url = `${VAPI_CONFIG.VAPI_BASE_URL}assistant`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: VAPI_CONFIG.VAPI_AUTH_HEADER,
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error(
        `Vapi API Error (${response.status}): ${JSON.stringify(errorData)}`
      );
      throw new Error(
        `Failed to list assistants: ${errorData.message || response.statusText}`
      );
    }

    const assistants = await response.json();
    return assistants;
  } catch (error) {
    logger.error(`Error listing Vapi assistants: ${error.message}`);
    throw new Error(`Vapi API call failed: ${error.message}`);
  }
};

exports.getAssistantById = async (assistantId) => {
  const url = `${VAPI_CONFIG.VAPI_BASE_URL}assistant/${assistantId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: VAPI_CONFIG.VAPI_AUTH_HEADER,
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error(
        `Vapi API Error (${response.status}): ${JSON.stringify(errorData)}`
      );

      if (response.status === 404) {
        throw new Error(`Assistant with ID '${assistantId}' not found.`);
      }

      throw new Error(
        `Failed to retrieve assistant: ${
          errorData.message || response.statusText
        }`
      );
    }

    const assistant = await response.json();
    return assistant;
  } catch (error) {
    logger.error(`Error retrieving Vapi assistant: ${error.message}`);
    throw new Error(`Vapi API call failed: ${error.message}`);
  }
};

exports.deleteAssistantById = async (assistantId) => {
  const url = `${VAPI_CONFIG.VAPI_BASE_URL}assistant/${assistantId}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: VAPI_CONFIG.VAPI_AUTH_HEADER,
    });

    if (response.status === 204 || response.ok) {
      return {
        success: true,
        message: `Assistant '${assistantId}' successfully deleted.`,
      };
    }

    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));

    logger.error(
      `Vapi API Error (${response.status}): ${JSON.stringify(errorData)}`
    );

    if (response.status === 404) {
      throw new Error(
        `Assistant with ID '${assistantId}' not found or already deleted.`
      );
    }

    throw new Error(
      `Failed to delete assistant: ${errorData.message || response.statusText}`
    );
  } catch (error) {
    logger.error(`Error deleting Vapi assistant: ${error.message}`);
    throw new Error(`Vapi API call failed: ${error.message}`);
  }
};
