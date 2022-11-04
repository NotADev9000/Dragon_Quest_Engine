//=============================================================================
// Dragon Quest Engine - Scene File
// DQE_Scene_File.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene after the title  - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Scene_File = DQEng.Scene_File || {};

//-----------------------------------------------------------------------------
// Scene_File
//-----------------------------------------------------------------------------

Scene_File.fade = true;
Scene_File._lastCommandSymbol = null; // the last symbol selected before the scene was changed
Scene_File.CONTINUE = 'Continue Adventure';
Scene_File.NEWGAME = 'New Adventure';

Scene_File.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._chosenCommand = null;
};

Scene_File.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createSavefileList();
    this.createChoiceWindow();
    this.createMessageWindow();
    this.selectLastCommand();
};

Scene_File.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    if (Scene_File.fade) {
        this.startFadeIn(this.fadeSpeed(), false);
        Scene_File.fade = false;
    }
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_File.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_CustomCommand(48, 48, 498, [Scene_File.CONTINUE, Scene_File.NEWGAME, 'Change Settings']);
    this._commandWindow.setHandler(Scene_File.CONTINUE, this.commandContinue.bind(this));
    this._commandWindow.setHandler(Scene_File.NEWGAME, this.commandNewGame.bind(this));
    this._commandWindow.setHandler('Change Settings', this.commandSettings.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_File.prototype.createSavefileList = function () {
    let x = this._commandWindow.x;
    this._saveWindow = new Window_SavefileList(x, 48, 1344, 1);
    this._saveWindow.setHandler('ok', this.onFileOk.bind(this));
    this._saveWindow.setHandler('cancel', this.onFileCancel.bind(this));
    this._saveWindow.hide();
    this.addWindow(this._saveWindow);
};

Scene_File.prototype.createChoiceWindow = function () {
    this._choiceWindow = new Window_CustomCommand(0, 0, 156, ['Yes', 'No'], true);
    this._choiceWindow.setHandler('Yes', this.onChoiceYes.bind(this));
    this._choiceWindow.setHandler('No', this.onChoiceCancel.bind(this));
    this._choiceWindow.setHandler('cancel', this.onChoiceCancel.bind(this));
    this._choiceWindow.openness = 0;
    this._choiceWindow.deactivate();
    this.addWindow(this._choiceWindow);
};

Scene_File.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_MessageInputToggle();
    this._choiceWindow.x = (this._messageWindow.x + this._messageWindow.width) - this._choiceWindow.width;
    this._choiceWindow.y = this._messageWindow.y - this._choiceWindow.height - Window_ChoiceList.ChoiceYOffset;
    this.addWindow(this._messageWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_File.prototype.commandContinue = function () {
    this._saveWindow.select(0);
    this._saveWindow.show();
    this._commandWindow.hide();
    this._saveWindow.activate();
};

Scene_File.prototype.commandNewGame = function () {
    this._commandWindow.showBackgroundDimmer();
    this.displayMessage(this.newGameMessage(), Scene_File.prototype.newGame_MessageCallback);
};

Scene_File.prototype.commandSettings = function () {
    this.setLastCommand(this._commandWindow.currentSymbol());
    SceneManager.push(Scene_Settings);
};

Scene_File.prototype.onFileOk = function () {
    this._saveWindow.showBackgroundDimmer();
    this.displayMessage(this.loadFileMessage(), Scene_File.prototype.loadFile_MessageCallback);
};

Scene_File.prototype.onFileCancel = function () {
    this._saveWindow.hide();
    this._commandWindow.show();
    this._commandWindow.activate();
};

Scene_File.prototype.onChoiceYes = function () {
    this._choiceWindow.close();
    this._messageWindow.close();
    this.fadeOutAll();
    if (this._chosenCommand === Scene_File.CONTINUE) {
        DataManager.loadGame(this.savefileId()) ? this.onLoadSuccess() : this.onLoadFailure();
    } else {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    }
};

Scene_File.prototype.onChoiceCancel = function () {
    this._choiceWindow.close();
    this._messageWindow.close();
    if (this._chosenCommand === Scene_File.CONTINUE) {
        this._saveWindow.hideBackgroundDimmer();
        this._saveWindow.activate();
    } else {
        this._commandWindow.hideBackgroundDimmer();
        this._commandWindow.activate();
    }
};

//////////////////////////////
// Functions - data
//////////////////////////////

Scene_File.prototype.savefileId = function () {
    return this._saveWindow.index() + 1;
};

Scene_File.prototype.reloadMapIfUpdated = function () {
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
        $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
        $gamePlayer.requestMapReload();
    }
};

Scene_File.prototype.selectLastCommand = function () {
    this._commandWindow.selectSymbol(Scene_Misc._lastCommandSymbol);
    // clear last command
    this.setLastCommand(null);
};

/**
 * @param {String} symbol of last command selected in _commandWindow
 */
Scene_File.prototype.setLastCommand = function (symbol) {
    Scene_Misc._lastCommandSymbol = symbol;
};

Scene_File.prototype.onLoadSuccess = function () {
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
};

Scene_File.prototype.onLoadFailure = function () {
    this._messageWindow.setInput(true);
    this.startFadeIn(this.fadeSpeed(), false);
    this.displayMessage(this.loadFailMessage(), Scene_File.prototype.loadFail_MessageCallback);
};

//////////////////////////////
// Functions - messages
//////////////////////////////

Scene_File.prototype.loadFileMessage = function () {
    return `Continue this Adventure Log?`;
};

Scene_File.prototype.loadFailMessage = function () {
    return `LOAD FAILED! Please try again...\nIf the problem persists, please contact the developer.`;
};

Scene_File.prototype.newGameMessage = function () {
    return `Start a new Adventure?`;
};

//////////////////////////////
// Functions - message callbacks
//////////////////////////////

Scene_File.prototype.loadFile_MessageCallback = function () {
    this._chosenCommand = Scene_File.CONTINUE;
    this.prepareChoiceWindow();
};

Scene_File.prototype.loadFail_MessageCallback = function () {
    this._messageWindow.close();
    this._messageWindow.setInput(false);
    this._saveWindow.hideBackgroundDimmer();
    this._saveWindow.activate();
};

Scene_File.prototype.newGame_MessageCallback = function () {
    this._chosenCommand = Scene_File.NEWGAME;
    this.prepareChoiceWindow();
};

//////////////////////////////
// Functions - windows
//////////////////////////////

Scene_File.prototype.prepareChoiceWindow = function () {
    this._choiceWindow.open();
    this._choiceWindow.select(0);
    this._choiceWindow.activate();
};
