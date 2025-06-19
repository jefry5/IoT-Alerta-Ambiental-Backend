const { TuyaContext } = require("@tuya/tuya-connector-nodejs");

const tuya = new TuyaContext({
  baseUrl: process.env.TUYA_API_URL,
  accessKey: process.env.TUYA_CLIENT_ID,
  secretKey: process.env.TUYA_CLIENT_SECRET,
});

module.exports = tuya;