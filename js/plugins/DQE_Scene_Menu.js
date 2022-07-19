//=============================================================================
// Dragon Quest Engine - Scene Menu
// DQE_Scene_Menu.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The scene for the main menu - V0.1
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
Imported.DQEng_Scene_Menu = true;

var DQEng = DQEng || {};
DQEng.Scene_Menu = DQEng.Scene_Menu || {};

//-----------------------------------------------------------------------------
// Scene_Menu
//-----------------------------------------------------------------------------

Scene_Menu.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
    this._moreMembers = $gameParty.members().length > 4;
};

DQEng.Scene_Menu.create = Scene_Menu.prototype.create;
Scene_Menu.prototype.create = function () {
    DQEng.Scene_Menu.create.call(this);
    if (this._moreMembers) this.createIconWindows(); // icon windows for showing other party members
};

Scene_Menu.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    this.refreshStatusWindow();
};

Scene_Menu.prototype.createCommandWindow = function () {
    this._commandWindow = new Window_MenuCommand(48, 48);
    this._commandWindow.setHandler('item', this.commandItem.bind(this));
    this._commandWindow.setHandler('skill', this.commandSkill.bind(this));
    this._commandWindow.setHandler('equip', this.commandEquip.bind(this));
    this._commandWindow.setHandler('quests', this.commandQuests.bind(this));
    this._commandWindow.setHandler('status', this.commandStatus.bind(this));
    this._commandWindow.setHandler('misc', this.commandMisc.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    if (this._moreMembers) {
        this._commandWindow.setHandler('previous', this.changeStatusWindows.bind(this));
        this._commandWindow.setHandler('next', this.changeStatusWindows.bind(this));
    }
    this.addWindow(this._commandWindow);
};

Scene_Menu.prototype.createGoldWindow = function () {
    this._goldWindow = new Window_Gold(0, 48);
    this._goldWindow.x = (Graphics.boxWidth - this._goldWindow.width) - 48;
    this.addWindow(this._goldWindow);
};

Scene_Menu.prototype.createStatusWindow = function () {
    this._statusWindow = [];
    const partyMembers = $gameParty.members();

    for (let i = 0; i < Math.min(partyMembers.length, 4); i++) {
        this._statusWindow[i] = new Window_MenuStatus(144 + (Window_MenuStatus.prototype.windowWidth() * i), 570, partyMembers[i]);
        this.addWindow(this._statusWindow[i]);
    }
    this._statusMode = true; // t = first 4 party members, f = remaining members
};

Scene_Menu.prototype.createIconWindows = function () {
    let x = 144 - 75; // at start of status windows
    let y = 570;
    this._iconWindowL = new Window_Icon(x, y, 75, 75, 'previous');
    x = this._statusWindow[3].x + this._statusWindow[0].width; // at end of status windows
    this._iconWindowR = new Window_Icon(x, y, 75, 75, 'next');
    this.addWindow(this._iconWindowL);
    this.addWindow(this._iconWindowR);
};

Scene_Menu.prototype.commandQuests = function () {
    SceneManager.push(Scene_Quests);
};

Scene_Menu.prototype.commandSkill = function () {
    SceneManager.push(Scene_Skill);
};

Scene_Menu.prototype.commandEquip = function () {
    SceneManager.push(Scene_Equip);
};

Scene_Menu.prototype.commandStatus = function () {
    SceneManager.push(Scene_Status);
};

Scene_Menu.prototype.commandMisc = function () {
    SceneManager.push(Scene_Misc);
};

Scene_Menu.prototype.changeStatusWindows = function () {
    let index = this._statusMode ? 4 : 0;
    this._statusWindow.forEach((statusWindow) => {
        statusWindow.setCategory(index, true);
        index++;
    });
    this._statusMode = !this._statusMode;
};
