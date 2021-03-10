//=============================================================================
// Dragon Quest Engine - Scene Boot
// DQE_Scene_Boot.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene class for initializing the entire game - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Scene_Boot = DQEng.Scene_Boot || {};

//-----------------------------------------------------------------------------
// Scene_Boot
//-----------------------------------------------------------------------------

Scene_Boot.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Scene_Map);
    } else {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_File);
        Window_TitleCommand.initCommandPosition();
    }
    this.updateDocumentTitle();
};
