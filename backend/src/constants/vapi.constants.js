// (account: greshseh@gmail.com)

const VAPI_CONFIG = {
  VAPI_AUTH_HEADER: {
    Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY || '0e5a5f7d-ceb8-4840-bca8-4906989eef03'}`,
    "Content-Type": "application/json",
  },
  VAPI_PUBLIC_KEY: process.env.VAPI_PUBLIC_KEY || 'd11a3eb0-b3e5-4231-ac99-32b2bcdb2ce6',
  VAPI_BASE_URL: "https://api.vapi.ai/",
  VAPI_PASSKEY: process.env.VAPI_PASSKEY || 1234
};

module.exports = {
  VAPI_CONFIG,
};