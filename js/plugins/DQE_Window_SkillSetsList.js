//=============================================================================
// Dragon Quest Engine - Window Skill Sets List
// DQE_Window_SkillSetsList.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying an actors' list of skill sets - V0.1
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
    this._hideCursor = false;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_SkillSetsList.prototype.titleBlockHeight = function () {
    return 54;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_SkillSetsList.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = $gameParty.members()[this._category];
        this.setSkillSetWindowActor(); // assign the skill set window the same actor
        this._index = 0; // selection must be reset on actor change
        this.refresh(); // update data & display
        this.callUpdateHelp(); // update the data in skill window
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

Window_SkillSetsList.prototype.hasSkillSets = function () {
    return this._data.length > 0;
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

/**
 * help window should be a skill set window
 * before updating the help window the actor must be set
 * 
 * @param {Window_SkillSets} helpWindow 
 */
Window_SkillSetsList.prototype.setHelpWindow = function (helpWindow) {
    this._helpWindow.push(helpWindow);
    this.setSkillSetWindowActor();
    this.callUpdateSingleHelp(helpWindow);
};

Window_SkillSetsList.prototype.setSkillSetWindowActor = function () {
    this._helpWindow[0]?.setCategory(this._category);
};

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

Window_SkillSetsList.prototype.setHelpWindowItem = function (index) {
    this._helpWindow.forEach(helpWindow => {
        this.setSingleHelpWindowItem(index, helpWindow);
    }, this);
};

Window_SkillSetsList.prototype.setSingleHelpWindowItem = function (index, helpWindow) {
    // if actor has no skill sets
    if (!this.hasSkillSets()) index = -2;
    helpWindow.setItem(index);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SkillSetsList.prototype.drawPageBlock = function () {
    this.drawTitleBlock();
};

Window_SkillSetsList.prototype.drawTitleBlock = function () {
    const title = 'Skill Sets';
    let y = this.extraPadding();

    // window title
    this.drawText(title, 0, y, this.contentsWidth(), 'center');
    // icons (switching pages)
    if (this._numPages > 1) this.drawPageUpDownAtEdges(y);
    y += this.itemHeight();
    // horizontal rule
    this.drawHorzLine(0, y);
};

Window_SkillSetsList.prototype.drawAllItems = function () {
    if (!this.hasSkillSets()) { // if actor has no skill sets
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

//////////////////////////////
// Functions - cursor
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

Window_SkillSetsList.prototype.moveToNextSkillSet = function () {
    let next = this.index() + 1;
    // loop to start of skill sets
    if (next >= this._data.length) next = 0;  
    this.select(next);
};

Window_SkillSetsList.prototype.moveToPreviousSkillSet = function () {
    let prev = this.index() - 1;
    // loop to end of skill sets
    if (prev < 0) prev = this._data.length - 1;
    this.select(prev);
};

Window_SkillSetsList.prototype.isCursorVisible = function () {
    if (this._hideCursor) return false;
    return Window_Pagination.prototype.isCursorVisible.call(this);
};

Window_SkillSetsList.prototype.setHideCursor = function (hideCursor) {
    this._hideCursor = hideCursor;
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
