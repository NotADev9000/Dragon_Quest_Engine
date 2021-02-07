//=============================================================================
// Dragon Quest Engine - Config Manager
// DQE_Config_Manager.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Static class for managing the extra config - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Config_Manager = true;

var DQEng = DQEng || {};
DQEng.Config_Manager = DQEng.Config_Manager || {};

//-----------------------------------------------------------------------------
// Config_Manager
//-----------------------------------------------------------------------------

ConfigManager.battleTextSpeed = 3; // 1 = very slow, 2 = slow, 3 = medium, 4 = fast, 5 = very fast

// BGM Volume = ME Volume
Object.defineProperty(ConfigManager, 'bgmVolume', {
    get: function () {
        return AudioManager._bgmVolume;
    },
    set: function (value) {
        AudioManager.bgmVolume = value;
        AudioManager.meVolume = value;
    },
    configurable: true
});

// Fullscreen
Object.defineProperty(ConfigManager, 'fullscreen', {
    get: function () {
        return this._fullscreen;
    },
    set: function (value) {
        if (value) {
            this._fullscreen = 1;
            Graphics._requestFullScreen();
        } else {
            this._fullscreen = 0;
            Graphics._cancelFullScreen();
        }
    },
    configurable: true
});

// Window Scale
Object.defineProperty(ConfigManager, 'windowScale', {
    get: function () {
        return this._windowScale;
    },
    set: function (value) {
            this._windowScale = value;
            Graphics._scaleWindow(value);
    },
    configurable: true
});

ConfigManager.makeData = function () {
    let config = {};
    config.alwaysDash = this.alwaysDash;
    config.bgmVolume = this.bgmVolume;
    config.bgsVolume = this.bgsVolume;
    config.meVolume = this.meVolume;
    config.seVolume = this.seVolume;
    config.battleTextSpeed = this.battleTextSpeed;
    config.windowScale = this.windowScale;
    config.fullscreen = this.fullscreen;
    return config;
};

ConfigManager.applyData = function (config) {
    this.alwaysDash = this.readFlag(config, 'alwaysDash');
    this.bgmVolume = this.readVolume(config, 'bgmVolume');
    this.bgsVolume = this.readVolume(config, 'bgsVolume');
    this.meVolume = this.readVolume(config, 'meVolume');
    this.seVolume = this.readVolume(config, 'seVolume');
    this.battleTextSpeed = this.readSpeed(config, 'battleTextSpeed');
    this.windowScale = this.readScale(config, 'windowScale');
    this.fullscreen = this.readFullscreen(config, 'fullscreen');
};

ConfigManager.readSpeed = function (config, name) {
    let value = config[name];
    return value !== undefined ? Number(value).clamp(1, 5) : 3;
};

ConfigManager.readFullscreen = function (config, name) {
    let value = config[name];
    return value !== undefined ? value : 1; // fullscreen defaults to ON
};

ConfigManager.readScale = function (config, name) {
    let value = config[name];
    return value !== undefined ? value : 3;
};
