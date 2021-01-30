//=============================================================================
// Dragon Quest Engine - Scene Gameover
// DQE_Scene_Gameover.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for gameover; sends player to restore point and takes half off gold - V0.1
*
* @param Wipe Out Switch
* @desc ID of switch to turn on when party is wiped out
* @default 1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_Gameover = true;

var DQEng = DQEng || {};
DQEng.Scene_Gameover = DQEng.Scene_Gameover || {};

var parameters = PluginManager.parameters('DQE_Scene_Gameover');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Scene_Gameover = {};
DQEng.Parameters.Scene_Gameover.WipeOutSwitch = Number(parameters["Wipe Out Switch"]) || 1;

//-----------------------------------------------------------------------------
// Scene_Gameover
//-----------------------------------------------------------------------------

Scene_Gameover.prototype.create = function () {
};

Scene_Gameover.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    let sfs = this.slowFadeSpeed();
    this.startFadeIn(sfs, false);
    this.updateData();
    this._wait = sfs + 12;
};

Scene_Gameover.prototype.update = function () {
    this.isActive() && !this.isBusy() && this._wait <= 0 ? this.transfer() : this.updateWait();
    Scene_Base.prototype.update.call(this);
};

Scene_Gameover.prototype.updateWait = function () {
    this._wait -= 1;
};

Scene_Gameover.prototype.updateData = function () {
    let switchId = DQEng.Parameters.Scene_Gameover.WipeOutSwitch;
    let party = $gameParty;
    // turn on wipe out switch
    $gameSwitches.setValue(switchId, true);
    // half gold
    let goldLoss = Math.floor(party.gold() / 2);
    party.loseGold(goldLoss);
    // revive one party member
    $gameParty.revivePreferredMember();
};

Scene_Gameover.prototype.transfer = function () {
    let resPoint = $gameParty.restorePoint();
    $gamePlayer.reserveTransfer(resPoint.mapId, resPoint.x, resPoint.y, resPoint.direction, 0);
    // Game_Interpreter.prototype.setWaitMode('transfer');
    SceneManager.goto(Scene_Map);
};
