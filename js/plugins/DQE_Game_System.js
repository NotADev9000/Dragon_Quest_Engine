//=============================================================================
// Dragon Quest Engine - Game System
// DQE_Game_System.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The game object class for the system data - V0.1
*
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Game_System = DQEng.Game_System || {};

var parameters = PluginManager.parameters('DQE_Game_System');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Game_System = {};
DQEng.Parameters.Game_System.OverrideBattleBgmSwitch = Number(parameters["Override Battle BGM Switch"]) || 2;
DQEng.Parameters.Game_System.AllowZoomSwitch = Number(parameters["Allow Zoom Switch"]) || 3;
DQEng.Parameters.Game_System.StartZoomSwitch = Number(parameters["Start Zoom Switch"]) || 4;
DQEng.Parameters.Game_System.LockCameraSwitch = Number(parameters["Lock Camera Switch"]) || 5;
DQEng.Parameters.Game_System.SeperateFollowersSwitch = Number(parameters["Seperate Followers Switch"]) || 6;

//-----------------------------------------------------------------------------
// Game_System
//-----------------------------------------------------------------------------

DQEng.Game_System.initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    DQEng.Game_System.initialize.call(this);
    this._battleBgmId = 6; // ID of DQ battle music e.g. 1 = DQ1, 2 = DQ2 etc.
};

Game_System.prototype.battleBgmId = function () {
    return this._battleBgmId;
};

Game_System.prototype.setBattleBgmId = function (value) {
    this._battleBgmId = value;
};

Game_System.prototype.changeBattleBgmFromId = function () {
    let bgm = {};
    bgm.pan = 0;
    bgm.pitch = 100;
    bgm.volume = 100;
    switch (this._battleBgmId) {
        case 2:
            bgm.name = 'DQ2';
            break;
        case 3:
            bgm.name = 'DQ3';
            break;
        case 4:
            bgm.name = 'DQ4';
            break;
        case 5:
            bgm.name = 'DQ5';
            break;            
        case 6:
            bgm.name = 'DQ6 - Courageous Fight';
            break;
        case 7:
            bgm.name = 'DQ7';
            break;
        case 8:
            bgm.name = 'DQ8';
            break;
        case 9:
            bgm.name = 'DQ9';
            break;
        case 10:
            bgm.name = 'DQ10';
            break;
        case 11:
            bgm.name = 'DQ11';
            break;
        default:
            bgm.name = 'DQ1';
            break;
    }
    this.setBattleBgm(bgm);
};

/**
 * Changes the default battle music
 * Only the ID is changed if Switch X is ON
 * This prevents players from changing the battle bgm during certain events
 */
Game_System.prototype.changeDefaultBattleBgm = function (value) {
    this.setBattleBgmId(value);
    if (!$gameSwitches.value(DQEng.Parameters.Game_System.OverrideBattleBgmSwitch)) this.changeBattleBgmFromId();
};
