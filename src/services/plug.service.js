const tuya = require("../utils/tuyaClient");
const deviceId = process.env.TUYA_DEVICE_ID;

async function getPlugStatus() {
  const res = await tuya.request({
    method: "GET",
    path: `/v1.0/devices/${deviceId}/status`,
  });

  const switchStatus = res.result.find((item) => item.code === "switch_1");
  return switchStatus?.value;
}

async function turnPlugOn() {
  const isOn = await getPlugStatus();
  if (isOn) {
    return { success: true, message: "El enchufe ya estaba encendido." };
  }

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
  const isOn = await getPlugStatus();
  if (!isOn) {
    return { success: true, message: "El enchufe ya estaba apagado." };
  }

  const res = await tuya.request({
    method: "POST",
    path: `/v1.0/devices/${deviceId}/commands`,
    body: {
      commands: [{ code: "switch_1", value: false }],
    },
  });
  return res;
}

module.exports = { turnPlugOn, turnPlugOff, getPlugStatus };