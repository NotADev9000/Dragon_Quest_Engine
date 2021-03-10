//=============================================================================
// Dragon Quest Engine - Scene Map
// DQE_Scene_Map.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the map - V0.1
*
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_Map = true;

var DQEng = DQEng || {};
DQEng.Scene_Map = DQEng.Scene_Map || {};

//-----------------------------------------------------------------------------
// Scene_Map
//-----------------------------------------------------------------------------

Scene_Map.prototype.needsFadeIn = function () {
    return (SceneManager.isPreviousScene(Scene_Battle) ||
            SceneManager.isPreviousScene(Scene_File));
};

Scene_Map.prototype.needsSlowFadeOut = function () {
    return (SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_File) ||
            SceneManager.isNextScene(Scene_Gameover));
};

/**
 * battle background is snapped here so that
 * events are included in the snapshot
 */
Scene_Map.prototype.launchBattle = function () {
    this.snapForBattleBackground();
    BattleManager.saveBgmAndBgs();
    this.stopAudioOnBattleStart();
    BattleManager.playBattleBgm();
    this.startEncounterEffect();
    this._mapNameWindow.hide();
};

/**
 * moved battle background snapshot
 */
Scene_Map.prototype.updateEncounterEffect = function () {
    if (this._encounterEffectDuration > 0) {
        this._encounterEffectDuration--;
        var speed = this.encounterEffectSpeed();
        var n = speed - this._encounterEffectDuration;
        var p = n / speed;
        var q = ((p - 1) * 20 * p + 5) * p + 1;
        var zoomX = $gamePlayer.screenX();
        var zoomY = $gamePlayer.screenY() - 24;
        if (n === 2) {
            $gameScreen.setZoom(zoomX, zoomY, 1);
            this.startFlashForEncounter(speed / 2);
        }
        $gameScreen.setZoom(zoomX, zoomY, q);
        if (n === Math.floor(speed / 6)) {
            this.startFlashForEncounter(speed / 2);
        }
        if (n === Math.floor(speed / 2)) {
            this.startFadeOut(this.fadeSpeed());
        }
    }
};