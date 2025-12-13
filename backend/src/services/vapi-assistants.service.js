const { VAPI_CONFIG } = require("../constants");
const { CallLog } = require("../models");
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

exports.saveCallStart = async (callId) => {
  try {
    const newCall = await CallLog.create({ callId });
    return newCall;
  } catch (error) {
    logger.error(
      `Error saving call start for Call ID ${callId}: ${error.message}`
    );
    throw new Error(`Database error during call start: ${error.message}`);
  }
};

exports.updateCallEndReport = async (callData) => {
  const callId = callData.call?.id;

  const structuredOutputs = callData.artifact?.structuredOutputs;
  let structuredReport = null;

  if (structuredOutputs) {
    const outputKey = Object.keys(structuredOutputs)[0];
    if (outputKey) {
      structuredReport = structuredOutputs[outputKey].result;
    }
  }

  const updateData = {
    recordingUrl: callData.recordingUrl || null,
    cost: callData.cost || null,
    durationMinutes: callData.durationMinutes || null,
    summary: callData.summary || null,
    transcript: callData.artifact?.messages,
    call_report: structuredReport,
    startedAt: callData.startedAt ? new Date(callData.startedAt) : null,
    endedAt: callData.endedAt ? new Date(callData.endedAt) : null,
    isCallCompleted: true
  };

  if (!updateData.call_report) {
    logger.warn(`Structured report data is missing for Call ID: ${callId}`);
  }

  try {
    const updatedCall = await CallLog.findOneAndUpdate(
      { callId: callId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCall) {
      logger.warn(`Call ID ${callId} not found for report update.`);
      throw new Error(`Call log for ID ${callId} not found. Cannot update.`);
    }

    return updatedCall;
  } catch (error) {
    logger.error(
      `Error updating call report for Call ID ${callId}: ${error.message}`
    );
    throw new Error(`Database error during report update: ${error.message}`);
  }
};
