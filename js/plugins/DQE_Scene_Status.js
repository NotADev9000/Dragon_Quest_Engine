//=============================================================================
// Dragon Quest Engine - Scene Status
// DQE_Scene_Status.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the status menu - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Scene_Status = true;

var DQEng = DQEng || {};
DQEng.Scene_Status = DQEng.Scene_Status || {};

//-----------------------------------------------------------------------------
// Scene_Status
//-----------------------------------------------------------------------------

Scene_Status.WinAttribute = 'Attribute';
Scene_Status.WinMagic = 'Magic';
Scene_Status.WinOtherAbilities = 'OtherAbilities';
Scene_Status.WinEffects = 'Effects';

Scene_Status.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._category = 0;
    this._activeWindow = null;
    this._windowsCreated = false; // have all windows in scene been created?
};

Scene_Status.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    // character windows
    this.createStatusWindow();
    this.createEquipmentWindow();
    this.createStatsWindow();
    this.createStatsAttributesWindow();
    this.createStatsMagicWindow();
    this.createStatsOtherAbilitiesWindow();
    this.createStatsEffectsWindow();
    // everyone windows
    this.createEveryoneStatsWindow();
    // set windows created
    this._windowsCreated = true;
};

Scene_Status.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Status.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledPartyCommand(48, 48, 354, TextManager.status, ['Everyone'], Scene_Status.prototype.setCategory);
    this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this._activeWindow = this._commandWindow;
    this.addWindow(this._commandWindow);
};

// character windows

Scene_Status.prototype.createStatusWindow = function () {
    let x = this._commandWindow.x + this._commandWindow.width;
    let y = this._commandWindow.y;
    this._statusWindow = new Window_Status(x, y, 504);
    this.addWindow(this._statusWindow);
    this._commandWindow.setAssociatedWindow(this._statusWindow);
};

Scene_Status.prototype.createEquipmentWindow = function () {
    let x = this._statusWindow.x;
    let y = this._statusWindow.y + this._statusWindow.height;
    this._equipmentWindow = new Window_SimpleEquipmentList(x, y, 504);
    this.addWindow(this._equipmentWindow);
    this._commandWindow.setAssociatedWindow(this._equipmentWindow);
};

Scene_Status.prototype.createStatsWindow = function () {
    let x = this._statusWindow.x + this._statusWindow.width;
    let y = this._statusWindow.y;
    this._statsWindow = new Window_Stats(x, y, 513);
    this.addWindow(this._statsWindow);
    this._commandWindow.setAssociatedWindow(this._statsWindow);
};

Scene_Status.prototype.createStatsAttributesWindow = function () {
    let x = this._commandWindow.x;
    let y = this._commandWindow.y;
    this._statsAttributesWindow = new Window_StatsAttributes(x, y, 1344, 591);
    this._statsAttributesWindow.setHandler('cancel', this.onStatsAttributesCancel.bind(this));
    this._statsAttributesWindow.setHandler('sort', this.previousActor.bind(this, this._statsAttributesWindow));
    this._statsAttributesWindow.setHandler('filter', this.nextActor.bind(this, this._statsAttributesWindow));
    this._statsAttributesWindow.setHandler('pagedown', this.onNextWindow.bind(this, Scene_Status.WinEffects));
    this._statsAttributesWindow.setHandler('pageup', this.onNextWindow.bind(this, Scene_Status.WinMagic));
    this._statsAttributesWindow.hide();
    this.addWindow(this._statsAttributesWindow);
};

Scene_Status.prototype.createStatsMagicWindow = function () {
    let x = this._commandWindow.x;
    let y = this._commandWindow.y;
    this._statsMagicWindow = new Window_StatsMagic(x, y, 1344, 714);
    this._statsMagicWindow.setHandler('cancel', this.onStatsMagicCancel.bind(this));
    this._statsMagicWindow.setHandler('sort', this.previousActor.bind(this, this._statsMagicWindow));
    this._statsMagicWindow.setHandler('filter', this.nextActor.bind(this, this._statsMagicWindow));
    this._statsMagicWindow.setHandler('pagedown', this.onNextWindow.bind(this, Scene_Status.WinAttribute));
    this._statsMagicWindow.setHandler('pageup', this.onNextWindow.bind(this, Scene_Status.WinOtherAbilities));
    this._statsMagicWindow.hide();
    this.addWindow(this._statsMagicWindow);
};

Scene_Status.prototype.createStatsOtherAbilitiesWindow = function () {
    let x = this._commandWindow.x;
    let y = this._commandWindow.y;
    this._statsOtherAbilitiesWindow = new Window_StatsOtherAbilities(x, y, 1344, 714);
    this._statsOtherAbilitiesWindow.setHandler('cancel', this.onStatsOtherAbilitiesCancel.bind(this));
    this._statsOtherAbilitiesWindow.setHandler('sort', this.previousActor.bind(this, this._statsOtherAbilitiesWindow));
    this._statsOtherAbilitiesWindow.setHandler('filter', this.nextActor.bind(this, this._statsOtherAbilitiesWindow));
    this._statsOtherAbilitiesWindow.setHandler('pagedown', this.onNextWindow.bind(this, Scene_Status.WinMagic));
    this._statsOtherAbilitiesWindow.setHandler('pageup', this.onNextWindow.bind(this, Scene_Status.WinEffects));
    this._statsOtherAbilitiesWindow.hide();
    this.addWindow(this._statsOtherAbilitiesWindow);
};

Scene_Status.prototype.createStatsEffectsWindow = function () {
    let x = this._commandWindow.x;
    let y = this._commandWindow.y;
    this._statsEffectsWindow = new Window_StatsEffects(x, y, 1344, 714);
    this._statsEffectsWindow.setHandler('cancel', this.onStatsEffectsCancel.bind(this));
    this._statsEffectsWindow.setHandler('sort', this.previousActor.bind(this, this._statsEffectsWindow));
    this._statsEffectsWindow.setHandler('filter', this.nextActor.bind(this, this._statsEffectsWindow));
    this._statsEffectsWindow.setHandler('pagedown', this.onNextWindow.bind(this, Scene_Status.WinOtherAbilities));
    this._statsEffectsWindow.setHandler('pageup', this.onNextWindow.bind(this, Scene_Status.WinAttribute));
    this._statsEffectsWindow.hide();
    this.addWindow(this._statsEffectsWindow);
};

// everyone windows

Scene_Status.prototype.createEveryoneStatsWindow = function () {
    let x = this._commandWindow.x;
    let y = this._commandWindow.y;
    this._everyoneStatsWindow = new Window_EveryoneStats(x, y, 0, 573);
    this._everyoneStatsWindow.setHandler('cancel', this.onEveryoneStatsCancel.bind(this));
    this._everyoneStatsWindow.hide();
    this.addWindow(this._everyoneStatsWindow);
};

//////////////////////////////
// Functions - on handlers
//////////////////////////////

Scene_Status.prototype.onCommandOk = function () {
    if (this._category >= 0) { // party member selected
        let actorIndex = this._commandWindow.currentSymbol();
        $gameParty.setMenuActor($gameParty.members()[actorIndex]);
        this.hideCharacterWindows();
        this._statsAttributesWindow.setCategory(actorIndex);
        this._statsAttributesWindow.show();
        this.activateWindow(this._statsAttributesWindow);
    } else { // everyone selected
        this._everyoneStatsWindow.select(0);
        this._everyoneStatsWindow.show();
        this.activateWindow(this._everyoneStatsWindow);
    }
};

Scene_Status.prototype.onStatsAttributesCancel = function () {
    this.showCharacterWindows();
    this._statsAttributesWindow.hide();
    this.activateWindow(this._commandWindow);
};

Scene_Status.prototype.onStatsMagicCancel = function () {
    this.showCharacterWindows();
    this._statsMagicWindow.setLastSelected(this._statsMagicWindow.index());
    this._statsMagicWindow.hide();
    this.activateWindow(this._commandWindow);
};

Scene_Status.prototype.onStatsOtherAbilitiesCancel = function () {
    this.showCharacterWindows();
    this._statsOtherAbilitiesWindow.setLastSelected(this._statsOtherAbilitiesWindow.index());
    this._statsOtherAbilitiesWindow.hide();
    this.activateWindow(this._commandWindow);
};

Scene_Status.prototype.onStatsEffectsCancel = function () {
    this.showCharacterWindows();
    this._statsEffectsWindow.setLastSelected(this._statsEffectsWindow.index());
    this._statsEffectsWindow.hide();
    this.activateWindow(this._commandWindow);
};

Scene_Status.prototype.onEveryoneStatsCancel = function () {
    this._everyoneStatsWindow.hide();
    this.activateWindow(this._commandWindow);
};

Scene_Status.prototype.onNextWindow = function (windowName) {
    this._activeWindow.hide();
    switch (windowName) {
        case Scene_Status.WinAttribute:
            this._statsAttributesWindow.setCategory(this._commandWindow.currentSymbol());
            this._statsAttributesWindow.show();
            this.activateWindow(this._statsAttributesWindow);
            break;
        case Scene_Status.WinMagic:
            this._statsMagicWindow.setCategory(this._commandWindow.currentSymbol());
            this._statsMagicWindow.select(this._statsMagicWindow._lastSelected)
            this._statsMagicWindow.show();
            this.activateWindow(this._statsMagicWindow);
            break;
        case Scene_Status.WinOtherAbilities:
            this._statsOtherAbilitiesWindow.setCategory(this._commandWindow.currentSymbol());
            this._statsOtherAbilitiesWindow.select(this._statsOtherAbilitiesWindow._lastSelected)
            this._statsOtherAbilitiesWindow.show();
            this.activateWindow(this._statsOtherAbilitiesWindow);
            break;
        case Scene_Status.WinEffects:
            this._statsEffectsWindow.setCategory(this._commandWindow.currentSymbol());
            this._statsEffectsWindow.select(this._statsEffectsWindow._lastSelected)
            this._statsEffectsWindow.show();
            this.activateWindow(this._statsEffectsWindow);
            break;
    }
};

Scene_Status.prototype.onActorChange = function () {
    let members = $gameParty.members();
    if (members.length > 1) {
        let actorIndex = members.indexOf(this.actor());
        this._activeWindow.setCategory(actorIndex);
        this._activeWindow.select(0);
        this._commandWindow.select(actorIndex);
    }
};

//////////////////////////////
// Functions - displaying windows
//////////////////////////////

/**
 * shows the basic character windows
 */
Scene_Status.prototype.showCharacterWindows = function () {
    this._statusWindow.show();
    this._equipmentWindow.show();
    this._statsWindow.show();
};

/**
 * hides the basic character windows
 */
Scene_Status.prototype.hideCharacterWindows = function () {
    this._statusWindow.hide();
    this._equipmentWindow.hide();
    this._statsWindow.hide();
};

Scene_Status.prototype.activateWindow = function (window) {
    window.activate();
    this._activeWindow = window;
};

//////////////////////////////
// Functions - selection callbacks
//////////////////////////////

Scene_Status.prototype.setCategory = function (category) {
    if (this._windowsCreated) {
        this._category = category;
        this.changeMode();
    }
};

Scene_Status.prototype.changeMode = function () {
    if (Number.isInteger(this._category)) { // player mode
        this.showCharacterWindows();
    } else { // everyone mode
        this.hideCharacterWindows();
    }
};
