const VAPI_CONFIG = {
  VAPI_AUTH_HEADER: {
    Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
    "Content-Type": "application/json",
  },
  VAPI_PUBLIC_KEY: process.env.VAPI_PUBLIC_KEY,
  VAPI_BASE_URL: "https://api.vapi.ai/",
};

module.exports = {
  VAPI_CONFIG,
};