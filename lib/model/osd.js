"use strict";

var DJIBuffer = require("../djibuffer");

var DRONE_TYPE = {
  0: "Unknown",
  1: "Inspire",
  2: "P3S",
  3: "P3X",
  4: "P3C",
  5: "OpenFrame",
  100: "None"
};

var FLYC_STATE = {
  0: "MANUAL",
  1: "ATTI",
  2: "ATTI_CL",
  3: "ATTI_HOVER",
  4: "HOVER",
  5: "GSP_BLAKE",
  6: "GPS_ATTI",
  7: "GPS_CL",
  8: "GPS_HOME_LOCK",
  9: "GPS_HOT_POINT",
  10: "ASSISTED_TAKEOFF",
  11: "AUTO_TAKEOFF",
  12: "AUTO_LANDING",
  13: "ATTI_LANDING",
  14: "NAVI_GO",
  15: "GO_HOME",
  16: "CLICK_GO",
  17: "JOYSTICK",
  23: "ATTI_LIMITED",
  24: "GPS_ATTI_LIMITED",
  25: "FOLLOW_ME",
  100: "OTHER"
};

var GOHOME_STATUS = {
  0: "STANDBY",
  1: "PREASCENDING",
  2: "ALIGN",
  3: "ASCENDING",
  4: "CRUISE",
  7: "OTHER"
};

var BATTERY_TYPE = {
  0: "UNKNOWN",
  1: "NONSMART",
  2: "SMART"
};

var MOTOR_START_FAILED_CAUSE = {
  0: "None",
  1: "CompassError",
  2: "AssistantProtected",
  3: "DeviceLocked",
  4: "DistanceLimit",
  5: "IMUNeedCalibration",
  6: "IMUSNError",
  7: "IMUWarning",
  8: "CompassCalibrating",
  9: "AttiError",
  10: "NoviceProtected",
  11: "BatteryCellError",
  12: "BatteryCommuniteError",
  13: "SeriouLowVoltage",
  14: "SeriouLowPower",
  15: "LowVoltage",
  16: "TempureVolLow",
  17: "SmartLowToLand",
  18: "BatteryNotReady",
  19: "SimulatorMode",
  20: "PackMode",
  21: "AttitudeAbNormal",
  22: "UnActive",
  23: "FlyForbiddenError",
  24: "BiasError",
  25: "EscError",
  26: "ImuInitError",
  27: "SystemUpgrade",
  28: "SimulatorStarted",
  29: "ImuingError",
  30: "AttiAngleOver",
  31: "GyroscopeError",
  32: "AcceletorError",
  33: "CompassFailed",
  34: "BarometerError",
  35: "BarometerNegative",
  36: "CompassBig",
  37: "GyroscopeBiasBig",
  38: "AcceletorBiasBig",
  39: "CompassNoiseBig",
  40: "BarometerNoiseBig",
  256: "OTHER"
};

var NON_GPS_CAUSE  = {
  0: "ALREADY",
  1: "FORBIN",
  2: "GPSNUM_NONENOUGH",
  3: "GPS_HDOP_LARGE",
  4: "GPS_POSITION_NONMATCH",
  5: "SPEED_ERROR_LARGE",
  6: "YAW_ERROR_LARGE",
  7: "COMPASS_ERROR_LARGE",
  8: "UNKNOWN"
};

var IMU_INITFAIL_REASON = {
    0: "MONITOR_ERROR",
    1: "COLLECTING_DATA",
    2: "GYRO_DEAD",
    3: "ACCE_DEAD",
    4: "COMPASS_DEAD",
    5: "BAROMETER_DEAD",
    6: "BAROMETER_NEGATIVE",
    7: "COMPASS_MOD_TOO_LARGE",
    8: "GYRO_BIAS_TOO_LARGE",
    9: "ACCE_BIAS_TOO_LARGE",
    10: "COMPASS_NOISE_TOO_LARGE",
    11: "BAROMETER_NOISE_TOO_LARGE",
    12: "WAITING_MC_STATIONARY",
    13: "ACCE_MOVE_TOO_LARGE",
    14: "MC_HEADER_MOVED",
    15: "MC_VIBRATED",
    16: "NONE"
};

function OSD(buffer, index) {
  this.buffer = buffer;
  this.index = index;
}

OSD.prototype = Object.create(DJIBuffer.prototype);

OSD.prototype.getLongitude = function() {
  return (this.readDouble(0, 8) * 180) / Math.PI;
}

OSD.prototype.getLatitude = function() {
  return (this.readDouble(8, 8) * 180) / Math.PI;
}

OSD.prototype.getHeight = function() {
  return this.readShort(16, 2) / 10;
}

OSD.prototype.getXSpeed = function() {
  return this.readShort(18, 2);
}

OSD.prototype.getYSpeed = function() {
  return this.readShort(20, 2);
}

OSD.prototype.getZSpeed = function() {
  return this.readShort(22, 2);
}

OSD.prototype.getPitch = function() {
  return this.readShort(24, 2);
}

OSD.prototype.getRoll = function() {
  return this.readShort(26, 2);
}

OSD.prototype.getYaw = function() {
  return this.readShort(28, 2);
}

OSD.prototype.getRcState = function() {
  return (this.readShort(30, 1) & 128) == 0;
}

OSD.prototype.getFlycState = function() {
  return FLYC_STATE[this.readShort(30, 1) & -129];
}

OSD.prototype.getAppCommand = function() {
  return this.readShort(31, 1);
}

OSD.prototype.canIOCWork = function() {
  return (this.readInt(32, 4) & 1) == 1;
}

OSD.prototype.groundOrSky = function() {
  return this.readInt(32, 4) >> 1 & 3;
}

OSD.prototype.isMotorUp = function() {
  return (this.readInt(32, 4) >> 3 & 1) == 1
}

OSD.prototype.isSwaveWork = function() {
  return (this.readInt(32, 4) & 16) != 0;
}

OSD.prototype.getGohomeStatus = function() {
  return GOHOME_STATUS[this.readInt(32, 4) >> 5 & 7];
}

OSD.prototype.isImuPreheated = function() {
  return (this.readInt(32, 4) & 4096) != 0;
}

OSD.prototype.isVisionUsed = function() {
  return (this.readInt(32, 4) & 256) != 0;
}

OSD.prototype.getVoltageWarning = function() {
  return (this.readInt(32, 4) & 1536) >>> 9;
}

OSD.prototype.getModeChannel = function() {
  return (this.readInt(32, 4) & 24576) >>> 13;
}

OSD.prototype.getCompassError = function() {
  return (this.readInt(32, 4) & 65536) != 0;
}

OSD.prototype.getWaveError = function() {
  return (this.readInt(32, 4) & 131072) != 0;
}

OSD.prototype.getGpsLevel = function() {
  return this.readInt(32, 4) >>> 18 & 15;
}

OSD.prototype.getBatteryType = function() {
  if (this.getDroneType() == "P3C") {
    return BATTERY_TYPE[this.readInt(32, 4) >>> 22 & 3]
  }
  return "SMART";
}

OSD.prototype.isAcceletorOverRange = function() {
  return (this.readInt(32, 4) >>> 24 & 1) != 0;
}

OSD.prototype.isVibrating = function() {
  return (this.readInt(32, 4) >>> 25 & 1) != 0;
}

OSD.prototype.isBarometerDeadInAir = function() {
  return (this.readInt(32, 4) >>> 26 & 1) != 0;
}

OSD.prototype.isNotEnoughForce = function() {
  return (this.readInt(32, 4) >>> 28 & 1) != 0;
}

OSD.prototype.getGpsNum = function() {
  return this.readShort(36, 1);
}

OSD.prototype.getFlightAction = function() {
  return this.readShort(37, 1);
}

OSD.prototype.getMotorFailedCause = function() {
  var s2 = this.readShort(38, 1);
  if (s2 >> 7 == 0) {
    return "NONE";
  }
  return MOTOR_START_FAILED_CAUSE[this.readShort(38, 1) & 127];
}

OSD.prototype.getNonGpsCause = function() {
  return NON_GPS_CAUSE[this.readInt(39, 1) & 15];
}

OSD.prototype.getBattery = function() {
  return this.readInt(40, 1);
}

OSD.prototype.getSwaveHeight = function() {
  return this.readShort(41, 1);
}

OSD.prototype.getFlyTime = function() {
  return this.readInt(42, 2) / 10;
}

OSD.prototype.getMotorRevolution = function() {
  return this.readShort(44, 1);
}

OSD.prototype.getFlycVersion = function() {
  return this.readInt(47, 1);
}

OSD.prototype.getDroneType = function() {
  return DRONE_TYPE[this.readInt(48, 1)];
}

OSD.prototype.getIMUinitFailReason = function() {
  return IMU_INITFAIL_REASON[this.readInt(49, 1)];
}

OSD.prototype.isImuInitError = function() {
  var reason = this.getIMUinitFailReason();
  return reason != "None" && reason != "ColletingData" && reason != "MonitorError";
}

module.exports = OSD;