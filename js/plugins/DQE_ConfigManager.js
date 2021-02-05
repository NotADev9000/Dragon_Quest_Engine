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

ConfigManager.makeData = function () {
    var config = {};
    config.alwaysDash = this.alwaysDash;
    config.battleTextSpeed = this.battleTextSpeed;
    config.bgmVolume = this.bgmVolume;
    config.bgsVolume = this.bgsVolume;
    config.meVolume = this.meVolume;
    config.seVolume = this.seVolume;
    return config;
};

ConfigManager.applyData = function (config) {
    this.alwaysDash = this.readFlag(config, 'alwaysDash');
    this.battleTextSpeed = this.readSpeed(config, 'battleTextSpeed');
    this.bgmVolume = this.readVolume(config, 'bgmVolume');
    this.bgsVolume = this.readVolume(config, 'bgsVolume');
    this.meVolume = this.readVolume(config, 'meVolume');
    this.seVolume = this.readVolume(config, 'seVolume');
};

ConfigManager.readSpeed = function (config, name) {
    let value = config[name];
    return value !== undefined ? Number(value).clamp(1, 5) : 3;
};
