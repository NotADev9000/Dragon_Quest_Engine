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

Window_SkillSets.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = $gameParty.members()[this._category];
        this.refresh();
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

Window_SkillSets.prototype.makeItemList = function () {
    if (this._skillSetIndex >= 0) this._data = this._actor.skillSets()[this._skillSetIndex];
};

Window_SkillSets.prototype.maxItems = function () {
    return this._data ? this._data.length : 1;
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

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SkillSets.prototype.drawTitleBlock = function () {
    const title = this._data.name || 'No Skill Set';
    const itemHeight = this.itemHeight() + this.lineGap();
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
};

Window_SkillSets.prototype.itemRect = function (index) {
    let rect = Window_Pagination.prototype.itemRect.call(this, index);
    rect.y += this.titleBlockHeight();
    return rect;
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_SkillSets.prototype.refresh = function () {
    if (this._actor) {
        this.makeItemList();
        this.createContents();
        this.drawTitleBlock();
        // this.drawLayerBlock();
        Window_Pagination.prototype.refresh.call(this);
        this.drawAllItems();
    }
};
