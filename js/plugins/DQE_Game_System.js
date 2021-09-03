//=============================================================================
// Dragon Quest Engine - Game System
// DQE_Game_System.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The game object class for the system data - V0.1
*
* @param Override Battle BGM Switch
* @desc ID of switch that overrides player selected Battle BGM when ON
* @default 2
*
* @param Allow Zoom Switch
* @desc ID of switch that allows player to zoom
* @default 3
*
* @param Start Zoom Switch
* @desc ID of switch that starts the zoom common event
* @default 4
*
* @param Lock Camera Switch
* @desc ID of switch that locks camera in position (it won't follow player)
* @default 5
*
* @param Seperate Followers Switch
* @desc ID of switch that stops followers from following player
* @default 6
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

//////////////////////////////
// Functions - music
//////////////////////////////

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

//////////////////////////////
// Functions - skill sets
//////////////////////////////

Game_System.prototype.findSkillSet = function (skillSetId) {
    return $DQE_dataSkillSets.find(skillSetData => skillSetData.id === skillSetId);
};

/**
 * Returns the total amount of nodes in a skill set
 * 
 * @param {Object} skillSet the skillSet data object
 */
Game_System.prototype.getSkillSetNodeAmount = function (skillSet) {
    let nodeCount = 0;
    skillSet.layers.forEach(layer => {
        nodeCount += layer.nodes.length;
    });
    return nodeCount;
};
