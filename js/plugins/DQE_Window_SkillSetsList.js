//=============================================================================
// Dragon Quest Engine - Window Skill Sets List
// DQE_Window_SkillSetsList.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying an actors' skill sets - V0.1
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
Imported.DQEng_Window_SkillSetsList = true;

var DQEng = DQEng || {};
DQEng.Window_SkillSetsList = DQEng.Window_SkillSetsList || {};

//-----------------------------------------------------------------------------
// Window_SkillSetsList
//-----------------------------------------------------------------------------

function Window_SkillSetsList() {
    this.initialize.apply(this, arguments);
}

Window_SkillSetsList.prototype = Object.create(Window_Pagination.prototype);
Window_SkillSetsList.prototype.constructor = Window_SkillSetsList;

Window_SkillSetsList.prototype.initialize = function (x, y, width, height) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._data = [];
    this._noData = 'No Skill Sets!';
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_SkillSetsList.prototype.lineGap = function () {
    return 15;
};

Window_SkillSetsList.prototype.titleBlockHeight = function () {
    return 54;
};

Window_SkillSetsList.prototype.pageBlockHeight = function () {
    return this.titleBlockHeight();
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_SkillSetsList.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = $gameParty.members()[this._category];
        this.refresh();
    }
};

Window_SkillSetsList.prototype.item = function () {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
};

Window_SkillSetsList.prototype.makeItemList = function () {
    if (this._actor) {
        this._data = this._actor.skillSets();
    } else {
        this._data = [];
    }
};

Window_SkillSetsList.prototype.maxItems = function () {
    return this._data ? this._data.length : 1;
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

/**
 * window does not have to be active to call update help
 */
Window_SkillSetsList.prototype.callUpdateHelp = function () {
    if (this._helpWindow?.length) this.updateHelp();
};

Window_SkillSetsList.prototype.updateHelp = function () {
    this.setHelpWindowItem(this.index());
};

Window_SkillSetsList.prototype.callUpdateSingleHelp = function (helpWindow) {
    this.updateSingleHelp(helpWindow);
};

Window_SkillSetsList.prototype.updateSingleHelp = function (helpWindow) {
    this.setSingleHelpWindowItem(this.index(), helpWindow);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SkillSetsList.prototype.drawPageBlock = function () {
    this.drawTitleBlock();
};

Window_SkillSetsList.prototype.drawTitleBlock = function () {
    const title = 'Skill Sets';
    const itemHeight = this.itemHeight() + this.lineGap();
    let y = this.extraPadding();

    // window title
    this.drawText(title, 0, y, this.contentsWidth(), 'center');
    // icons (switching pages)
    if (this._numPages > 1) {
        // left icon
        let icon = this.getHandlerIcon('pagedown');
        this.drawTextEx(` \\i[${icon}]`, 0, y);
        // right icon
        const rightIconX = this.contentsWidth() - Window_Base._iconWidth - this.textWidth(' ');
        icon = this.getHandlerIcon('pageup');
        this.drawTextEx(`\\i[${icon}] `, rightIconX, y);
    }
    y += itemHeight;
    // horizontal rule
    this.drawHorzLine(0, y);
};

Window_SkillSetsList.prototype.drawAllItems = function () {
    if (!this._data.length) { // if actor has no skill sets
        this.drawText(this._noData, 0, this.extraPadding() + this.titleBlockHeight(), this.contentsWidth(), 'center');
    } else {
        Window_Pagination.prototype.drawAllItems.call(this);
    }
};

Window_SkillSetsList.prototype.drawItem = function (index) {
    const item = this._data[index];
    if (item) {
        const rect = this.itemRectForText(index);
        // skill set complete color change
        if (item.complete) this.changeTextColor(this.completeSkillSetColor());
        // skill set name
        this.drawText(item.name, rect.x, rect.y, rect.width);
        // nodes unlocked / total nodes
        const nodesUnlocked = item.nodesUnlocked;
        const nodesTotal = $gameSystem.getSkillSetNodeAmount(item);
        this.drawText(`${nodesUnlocked}/${nodesTotal}`, rect.x, rect.y, rect.width, 'right');
        this.resetTextColor();
    }
};

Window_SkillSetsList.prototype.itemRect = function (index) {
    let rect = Window_Pagination.prototype.itemRect.call(this, index);
    rect.y += this.titleBlockHeight();
    return rect;
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_SkillSetsList.prototype.cursorRight = function () {
};

Window_SkillSetsList.prototype.cursorLeft = function () {
};

Window_SkillSetsList.prototype.cursorPagedown = function () {
    Window_Pagination.prototype.cursorLeft.call(this);
};

Window_SkillSetsList.prototype.cursorPageup = function () {
    Window_Pagination.prototype.cursorRight.call(this);
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_SkillSetsList.prototype.refresh = function (resetLastSelected = true) {
    if (this._actor) {
        this.makeItemList();
        this.createContents();
        Window_Pagination.prototype.refresh.call(this, resetLastSelected);
        this.drawAllItems();
    }
};
