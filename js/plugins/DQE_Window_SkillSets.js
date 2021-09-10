//=============================================================================
// Dragon Quest Engine - Window Skill Sets
// DQE_Window_SkillSets.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for unlocking nodes in skill set - V0.1
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
Imported.DQEng_Window_SkillSets = true;

var DQEng = DQEng || {};
DQEng.Window_SkillSets = DQEng.Window_SkillSets || {};

//-----------------------------------------------------------------------------
// Window_SkillSets
//-----------------------------------------------------------------------------

function Window_SkillSets() {
    this.initialize.apply(this, arguments);
}

Window_SkillSets.prototype = Object.create(Window_Pagination.prototype);
Window_SkillSets.prototype.constructor = Window_SkillSets;

Window_SkillSets.prototype.initialize = function (x, y, width, height, selectable) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    // actor
    this._category = -1;
    this._actor = null;
    // skillset
    this._skillSetIndex = -1;
    // display data
    this._data = [];
    this._page = 1;
    // determines whether the items are drawn with cursor space
    this._selectable = selectable;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_SkillSets.prototype.lineGap = function () {
    return 15;
};

Window_SkillSets.prototype.titleBlockHeight = function () {
    return 108;
};

//////////////////////////////
// Functions - data
//////////////////////////////

/**
 * different to how other windows use this method.
 * Called by parent window which then sets the skill set
 * and refreshes this window
 * 
 * @param {number} category index of party member
 */
Window_SkillSets.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = $gameParty.members()[this._category];
    }
};

Window_SkillSets.prototype.setItem = function (index) {
    if (this._skillSetIndex !== index) {
        this._skillSetIndex = index;
        this.refresh();
    }
};

Window_SkillSets.prototype.item = function () {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
};

/**
 * if _skillSetIndex === -1 then the data should not change.
 * This prevents _data from being erased when deselecting the parent window
 * but allows emptying of _data when an actor has no skill sets
 */
Window_SkillSets.prototype.makeItemList = function () {
    if (this._skillSetIndex >= 0)  {
        this._data = this._actor.skillSets()[this._skillSetIndex];
    } else if (this._skillSetIndex < -1) {
        this._data = [];
    }
};

Window_SkillSets.prototype.maxItems = function () {
    return this._data ? this._data.length : 1;
};

//////////////////////////////
// Functions - index
//////////////////////////////

/**
 * @returns the current layers index in the skillset
 */
Window_SkillSets.prototype.getLayerIndex = function () {
    return this._page - 1;
};

Window_SkillSets.prototype.topIndex = function () {
    return 0;
};

/**
 * trueIndex always = index in this window
 */
Window_SkillSets.prototype.trueIndex = function (index) {
    return index;
};

//////////////////////////////
// Functions - page
//////////////////////////////

/**
 * Returns the current page being displayed
 */
Window_SkillSets.prototype.page = function () {
    const index = this.index();
    if (index < 0) return 1;
    return Math.floor((index / this.maxItemsOnPage()) + 1);
};

Window_SkillSets.prototype.numPages = function () {
    return this._data.length ? this._data.layers.length : 1;
};

Window_SkillSets.prototype.itemsOnPage = function () {
    return this._data.layers?.[this.getLayerIndex()].nodes.length ?? 0;
};

//////////////////////////////
// Functions - row/column
//////////////////////////////

Window_SkillSets.prototype.row = function () {
    return Math.floor(this.index() / this.maxCols());
};

Window_SkillSets.prototype.column = function () {
    return 0;
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_SkillSets.prototype.cursorDown = function () {
    Window_Selectable.prototype.cursorDown.call(this);
};

Window_SkillSets.prototype.cursorUp = function () {
    Window_Selectable.prototype.cursorUp.call(this);
};

Window_SkillSets.prototype.cursorRight = function () {
    this.gotoNextPage();
};

Window_SkillSets.prototype.cursorLeft = function () {
    this.gotoNextPage(-1);
};

/**
 * Sets this._page to next/previous page
 * 
 * @param {Number} next +1 if next page, -1 if previous
 */
Window_SkillSets.prototype.gotoNextPage = function (next = 1) {
    if (this._numPages <= 1) return;
    this._page = this.getNextPage(next);
    // force refresh
    this.select(this.index(), true);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SkillSets.prototype.drawTitleBlock = function () {
    const title = this._data.name || 'No Skill Set';
    const lineGap = this.lineGap();
    const itemHeight = this.itemHeight() + lineGap;
    let y = this.extraPadding();

    // window title
    this.drawText(title, 0, y, this.contentsWidth(), 'center');

    // icons (switching pages)
    if (this._actor.numSkillSets() > 1) {
        // left icon
        let icon = this.getHandlerIcon('previous');
        this.drawTextEx(` \\i[${icon}]`, 0, y);
        // right icon
        const rightIconX = this.contentsWidth() - Window_Base._iconWidth - this.textWidth(' ');
        icon = this.getHandlerIcon('next');
        this.drawTextEx(`\\i[${icon}] `, rightIconX, y);
    }

    y += itemHeight;
    // horizontal rule
    this.drawHorzLine(0, y);
    y += 3 + lineGap;

    // layer number
    this.drawText(`Layer ${this._page}`, this.extraPadding(), y);

    // layer status
    // layer unlocked info here

    y += itemHeight;
    // horizontal rule
    this.drawHorzLine(0, y);
};

Window_SkillSets.prototype.itemRect = function (index) {
    let rect = Window_Pagination.prototype.itemRect.call(this, index);
    rect.y += this.titleBlockHeight();
    return rect;
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_SkillSets.prototype.select = function (index, refresh = false) {
    this._index = Math.min(this.maxItems() - 1, index);
    this._stayCount = 0;
    if (this._index > -1) {
        this.setLastSelected(this._index);
        if (refresh) this.refresh(false);
    }
    this.updateCursor();
    this.callUpdateHelp();
};

Window_SkillSets.prototype.refresh = function () {
    if (this._actor) {
        this.makeItemList();
        this.createContents();
        this.drawTitleBlock();
        Window_Pagination.prototype.refresh.call(this);
        this.drawAllItems();
    }
};
