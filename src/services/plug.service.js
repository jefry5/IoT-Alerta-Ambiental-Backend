const tuya = require("../utils/tuyaClient");
const deviceId = process.env.TUYA_DEVICE_ID;

async function turnPlugOn() {
  const res = await tuya.request({
    method: "POST",
    path: `/v1.0/devices/${deviceId}/commands`,
    body: {
      commands: [{ code: "switch_1", value: true }],
    },
  });
  return res;
}

async function turnPlugOff() {
  const res = await tuya.request({
    method: "POST",
    path: `/v1.0/devices/${deviceId}/commands`,
    body: {
      commands: [{ code: "switch_1", value: false }],
    },
  });
  return res;
}

module.exports = { turnPlugOn, turnPlugOff };
