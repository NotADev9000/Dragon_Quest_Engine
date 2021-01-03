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

Scene_Status.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._category = 0;
};

Scene_Status.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createStatusWindow();
    this.createEquipmentWindow();
};

Scene_Status.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
};

//////////////////////////////
// Functions - create windows
//////////////////////////////

Scene_Status.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_TitledPartyCommand(48, 48, 354, TextManager.status, ['Everyone'], [], undefined, Scene_Status.prototype.setCategory);
    // this._commandWindow.setHandler('ok', this.onCommandOk.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

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

//////////////////////////////
// Functions - selection callbacks
//////////////////////////////

Scene_Status.prototype.setCategory = function (category) {
    if (!(Number.isInteger(category) && Number.isInteger(this._category)) && this._category !== category) {
        this._category = category;
        this.changeMode();
    }
};

Scene_Status.prototype.changeMode = function () {
    if (Number.isInteger(this._category)) { // player mode
        this._statusWindow.show();
        this._equipmentWindow.show();
    } else { // everyone mode
        this._statusWindow.hide();
        this._equipmentWindow.hide();
    }
};
