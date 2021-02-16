//=============================================================================
// Dragon Quest Engine - Window Battle Skill
// DQE_Window_BattleSkill.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window that displays skills to use in battle - V0.1
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
Imported.DQEng_Window_BattleSkill = true;

var DQEng = DQEng || {};
DQEng.Window_BattleSkill = DQEng.Window_BattleSkill || {};

//-----------------------------------------------------------------------------
// Window_BattleSkill
//-----------------------------------------------------------------------------

function Window_BattleSkill() {
    this.initialize.apply(this, arguments);
}

Window_BattleSkill.prototype = Object.create(Window_Pagination.prototype);
Window_BattleSkill.prototype.constructor = Window_BattleSkill;

Window_BattleSkill.prototype.initialize = function (x, y, width, height) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._stypeId = 0;
    this._data = [];
    this.hide();
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_BattleSkill.prototype.lineGap = function () {
    return 15;
};

Window_BattleSkill.prototype.pageBlockHeight = function () {
    return 48;
}

//////////////////////////////
// Functions - data
//////////////////////////////

Window_BattleSkill.prototype.setActor = function (actor) {
    this._actor = actor;
    this.refresh();
};

Window_BattleSkill.prototype.setStypeId = function (stypeId) {
    if (this._stypeId !== stypeId) {
        this._stypeId = stypeId;
        this.refresh();
        this.resetScroll();
    }
};

Window_BattleSkill.prototype.setHelpWindowItem = function (item, actor) {
    if (this._helpWindow && this._helpWindow.length) {
        this._helpWindow[0].setItem(item, actor);
    }
};

Window_BattleSkill.prototype.includes = function (item) {
    return item && item.stypeId === this._stypeId && this._actor.isOccasionOk(item);
};

Window_BattleSkill.prototype.item = function () {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
};

Window_BattleSkill.prototype.makeItemList = function () {
    if (this._actor) {
        this._data = this._actor.skills().filter(function (item) {
            return this.includes(item);
        }, this);
    } else {
        this._data = [];
    }
};

Window_BattleSkill.prototype.maxItems = function () {
    return this._data ? this._data.length : 1;
};

Window_BattleSkill.prototype.isCurrentItemEnabled = function () {
    return this.isEnabled(this._data[this.index()]);
};

Window_BattleSkill.prototype.isEnabled = function (item) {
    return this._actor && this._actor.canUse(item);
};

Window_BattleSkill.prototype.selectLast = function () {
    var skill = this._actor.lastBattleSkill();
    var index = this._data.indexOf(skill);
    this.select(index >= 0 ? index : 0);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_BattleSkill.prototype.drawPageBlock = function () {
    var skill = this._data[this.index()];
    if (skill) {
        var blockY = this.height - this.pageBlockHeight() - (this.padding + this.extraPadding()) + 6;
        var requirement = $dataSystem.weaponTypes[this.item().requiredWtypeId1];
        var display = requirement ? `${requirement} required` : 'No requirements';
        var displayWidth = this.width - (this.standardPadding() + this.extraPadding()) * 2;

        this.drawHorzLine(0, blockY);
        blockY += 15;
        this.drawText(display, this.extraPadding(), blockY, displayWidth, 'center');
        if (this._numPages > 1) { this.drawText('>', 498, blockY, 24); }
    }
};

Window_BattleSkill.prototype.drawItem = function (index) {
    var skill = this._data[index];
    if (skill) {
        var rect = this.itemRectForText(index);
        if (!this.isEnabled(skill)) { this.changeTextColor(this.disabledColor()); }
        this.drawText(skill.name, rect.x, rect.y, rect.width);
        this.resetTextColor();
    }
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_BattleSkill.prototype.cursorDown = function () {
    Window_Pagination.prototype.cursorDown.call(this);
    this.refresh();
};

Window_BattleSkill.prototype.cursorUp = function () {
    Window_Pagination.prototype.cursorUp.call(this);
    this.refresh();
};

//////////////////////////////
// Functions - updates to window
//////////////////////////////

Window_BattleSkill.prototype.updateHelp = function () {
    this.setHelpWindowItem(this.item(), this._actor);
};

Window_BattleSkill.prototype.showBackgroundDimmer = function () {
    this.showHelpWindowBackgroundDimmer();
    Window_Pagination.prototype.showBackgroundDimmer.call(this);
};

Window_BattleSkill.prototype.hideBackgroundDimmer = function () {
    this.hideHelpWindowBackgroundDimmer();
    Window_Pagination.prototype.hideBackgroundDimmer.call(this);
};

Window_BattleSkill.prototype.show = function () {
    this.selectLast();
    this.showHelpWindow();
    Window_Pagination.prototype.show.call(this);
};

Window_BattleSkill.prototype.hide = function () {
    this.hideHelpWindow();
    Window_Pagination.prototype.hide.call(this);
};

Window_BattleSkill.prototype.refresh = function () {
    this.makeItemList();
    this.createContents();
    Window_Pagination.prototype.refresh.call(this);
    this.drawAllItems();
};
