//=============================================================================
// Dragon Quest Engine - Window Titled List
// DQE_Window_TitledList.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Displays a list with a title - V0.1
*
*
* @help
* Displays a numbered list with whatever data is passed.
* Inherits from titled command window but isn't intended
* to be an interactable window.
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_TitledList = true;

var DQEng = DQEng || {};
DQEng.Window_TitledList = DQEng.Window_TitledList || {};

//-----------------------------------------------------------------------------
// Window_TitledList
//-----------------------------------------------------------------------------

function Window_TitledList() {
    this.initialize.apply(this, arguments);
}

Window_TitledList.prototype = Object.create(Window_TitledCommand.prototype);
Window_TitledList.prototype.constructor = Window_TitledList;

Window_TitledList.prototype.initialize = function (x, y, width, menuTitle = '???', rows) {
    this._rows = rows;
    this._list = [];
    Window_TitledCommand.prototype.initialize.call(this, x, y, width, menuTitle);
    this.deselect();
};

Window_TitledList.prototype.numVisibleRows = function () {
    return this._rows;
};

Window_TitledList.prototype.drawTitleBlock = function () {
    var titleWidth = this.windowWidth() - (this.standardPadding() + this.extraPadding()) * 2;

    this.drawText(this._menuTitle, this.extraPadding(), this.extraPadding(), titleWidth, 'center');
    this.drawHorzLine(0, 51);
};

Window_TitledList.prototype.drawList = function () {
    var members = $gameParty.allMembers();
    for (let i = 0; i < this._rows; i++) {
        let rect = this.itemRect(i);
        let item = this._list.length > i ? members[this._list[i]].name() : '';
        this.resetTextColor();
        this.drawText(i+1 + '. ' + item, rect.x, rect.y, rect.width);
    }
};

Window_TitledList.prototype.addData = function (data) {
    this._list.push(data);
    this.refresh();
};

Window_TitledList.prototype.removeData = function () {
    this._list.pop();
    this.refresh();
};

Window_TitledList.prototype.clearData = function () {
    this._list = [];
    this.refresh();
};

Window_TitledList.prototype.refresh = function () {
    this.contents.clear();
    this.drawTitleBlock();
    this.drawList();
};
