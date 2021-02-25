//=============================================================================
// Dragon Quest Engine - Scene Misc
// DQE_Scene_Misc.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the misc menu - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_Misc = true;

var DQEng = DQEng || {};
DQEng.Scene_Misc = DQEng.Scene_Misc || {};

//-----------------------------------------------------------------------------
// Scene_Misc
//-----------------------------------------------------------------------------

function Scene_Misc() {
    this.initialize.apply(this, arguments);
}

Scene_Misc._lastCommandSymbol = null; // the last symbol selected before the scene was changed

Scene_Misc.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Misc.prototype.constructor = Scene_Misc;

Scene_Misc.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._windowsCreated = false; // have all windows in scene been created?
};

Scene_Misc.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createHelpWindow();
    this.createLineUpPartyWindow();
    this.createLineUpListWindow();
    this.createLineUpStatusWindow();
    // set windows created
    this._windowsCreated = true;
    this.selectLastCommand();
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Misc.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledCommand(48, 48, 354, 'Misc.', ['Heal All', 'Line-up', 'Battle Music', 'Settings'], Scene_Misc.prototype.changeWindows);
    // this._commandWindow.setHandler('Heal All', this.commandHealAll.bind(this));
    this._commandWindow.setHandler('Line-up', this.commandLineUp.bind(this));
    this._commandWindow.setHandler('Settings', this.commandSettings.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Misc.prototype.createHelpWindow = function () {
    let x = this._commandWindow.x + this._commandWindow.width;
    this._helpWindow = new Window_Help(x, 48, 840, 3);
    this.addWindow(this._helpWindow);
};

Scene_Misc.prototype.createLineUpPartyWindow = function () {
    let x = this._commandWindow.x + this._commandWindow.width;
    this._lineUpPartyWindow = new Window_PartyOrder(x, 48, 354);
    this._lineUpPartyWindow.deactivate();
    this._lineUpPartyWindow.deselect();
    // this._lineUpPartyWindow.setHandler('ok', this.onLineUpGroupPartyOk.bind(this));
    this._lineUpPartyWindow.setHandler('cancel', this.onLineUpPartyCancel.bind(this));
    this._lineUpPartyWindow.hide();
    this.addWindow(this._lineUpPartyWindow);
};

Scene_Misc.prototype.createLineUpListWindow = function () {
    let x = this._lineUpPartyWindow.x + this._lineUpPartyWindow.width;
    this._lineUpListWindow = new Window_TitledList(x, 48, 354, 'Order', $gameParty.allMembers().length);
    this._lineUpListWindow.deactivate();
    this._lineUpListWindow.hide();
    this._lineUpPartyWindow.setAssociatedWindow(this._lineUpListWindow);
    this.addWindow(this._lineUpListWindow);
};

Scene_Misc.prototype.createLineUpStatusWindow = function () {
    let x = this._lineUpListWindow.x + this._lineUpListWindow.width;
    this._lineUpStatusWindow = new Window_BattleStatus(x, 48, undefined, 'center');
    this._lineUpStatusWindow.hide();
    this._lineUpPartyWindow.setStatusWindow(this._lineUpStatusWindow);
    this.addWindow(this._lineUpStatusWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Misc.prototype.commandLineUp = function () {
    this._commandWindow.showBackgroundDimmer();
    this._lineUpPartyWindow.select(0);
    this._lineUpPartyWindow.activate();
    this._lineUpStatusWindow.show();
};

Scene_Misc.prototype.commandSettings = function () {
    this.setLastCommand(this._commandWindow.currentSymbol());
    SceneManager.push(Scene_Settings);
};

Scene_Misc.prototype.onLineUpPartyCancel = function () {
    if (this._lineUpListWindow._list.length) { // if there's items to remove from the list window
        this._lineUpPartyWindow.updateAssociatedWindow(this._lineUpPartyWindow.currentSymbol(), false);
        this._lineUpPartyWindow.activate();
    } else {
        this._commandWindow.hideBackgroundDimmer();
        this._lineUpPartyWindow.deselect();
        this._lineUpStatusWindow.hide();
        this._commandWindow.activate();
    }
};

//////////////////////////////
// Functions - data
//////////////////////////////

Scene_Misc.prototype.selectLastCommand = function () {
    this._commandWindow.selectSymbol(Scene_Misc._lastCommandSymbol);
    // clear last command
    this.setLastCommand(null);
};

/**
 * @param {String} symbol of last command selected in _commandWindow
 */
Scene_Misc.prototype.setLastCommand = function (symbol) {
    Scene_Misc._lastCommandSymbol = symbol;
};

//////////////////////////////
// Functions - selection callbacks
//////////////////////////////

/**
 * @param {String} symbol the command windows current selection
 */
Scene_Misc.prototype.changeWindows = function (symbol) {
    if (this._windowsCreated) {
        switch (symbol) {
            case 'Heal All':
                this._helpWindow.setItem('Quickly and easily restore all your party members to full health.');
                this._helpWindow.show();
                this._lineUpPartyWindow.hide();
                break;
            case 'Line-up':
                this._lineUpPartyWindow.show();
                this._lineUpStatusWindow.hide();
                this._helpWindow.hide();
                break;
            case 'Battle Music':
                this._helpWindow.hide();
                this._lineUpPartyWindow.hide();
                break;
            case 'Settings':
                this._helpWindow.setItem('Configure various game settings.');
                this._helpWindow.show();
                this._lineUpPartyWindow.hide();
                break;
        }
    }
};
