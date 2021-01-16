//=============================================================================
// Dragon Quest Engine - Window Stats Magic
// DQE_Window_StatsMagic.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window breaking down an actors' magic - V0.1
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
Imported.DQEng_Window_StatsMagic = true;

var DQEng = DQEng || {};
DQEng.Window_StatsMagic = DQEng.Window_StatsMagic || {};

//-----------------------------------------------------------------------------
// Window_StatsMagic
//-----------------------------------------------------------------------------

function Window_StatsMagic() {
    this.initialize.apply(this, arguments);
}

Window_StatsMagic.prototype = Object.create(Window_Pagination.prototype);
Window_StatsMagic.prototype.constructor = Window_StatsMagic;

Window_StatsMagic.prototype.initialize = function (x, y, width, height) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this._category = -1;
    this._actor = null;
    this._data = [];
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_StatsMagic.prototype.lineGap = function () {
    return 15;
};

Window_StatsMagic.prototype.titleBlockHeight = function () {
    return 108;
};

Window_StatsMagic.prototype.itemBlockHeight = function () {
    return 396;
};

Window_StatsMagic.prototype.mpCostBlockHeight = function () {
    return 54;
};

Window_StatsMagic.prototype.descriptionBlockHeight = function () {
    return 84;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_StatsMagic.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = $gameParty.members()[this._category];
        this.refresh();
    }
};

Window_StatsMagic.prototype.item = function () {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
};

Window_StatsMagic.prototype.maxItems = function () {
    return this._data ? this._data.length : 1;
};

Window_StatsMagic.prototype.includes = function (item) {
    return item.stypeId === 2;
};

Window_StatsMagic.prototype.makeItemList = function () {
    this._data = this._actor.skills().filter(function (item) {
        return this.includes(item);
    }, this);
};

//////////////////////////////
// Functions - row
//////////////////////////////

Window_StatsMagic.prototype.maxRows = function () {
    if (this._maxRows != -1) return this._maxRows;
    return Math.floor((this.itemBlockHeight() - (this.standardPadding() * 2)) / (this.lineHeight() + this.lineGap()));
};

Window_StatsMagic.prototype.maxCols = function () {
    return 2;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_StatsMagic.prototype.drawAllItems = function () {
    if (!this._data.length) { // if actor has no spells
        this.drawText('No Spells!', 0, this.extraPadding() + this.titleBlockHeight(), this.contentsWidth(), 'center');
    } else {
        Window_Pagination.prototype.drawAllItems.call(this);
    }
};

Window_StatsMagic.prototype.drawItem = function (index) {
    var item = this._data[index];
    if (item) {
        var rect = this.itemRectForText(index);
        var width = this.contentsWidth() - (this.extraPadding() * 2);
        this.drawText(item.name, rect.x, rect.y, width);
    }
};

Window_StatsMagic.prototype.drawMPCostBlock = function (item) {
    let y = this.titleBlockHeight() + this.itemBlockHeight();
    let cost, requirement;
    this.drawHorzLine(0, y);
    y += this.extraPadding() + 3;
    if (item) {
        cost = item.mpCost;
        requirement = item.requiredWtypeId1 ? `${$dataSystem.weaponTypes[item.requiredWtypeId1]} required` : 'No requirements';
    } else {
        cost = '-';
        requirement = '';
    }
    this.drawText(`MP Cost: ${cost}`, this.extraPadding(), y);
    this.drawText(requirement, 0, y, this.contentsWidth() - this.extraPadding(), 'right');
};

Window_StatsMagic.prototype.drawDescriptionBlock = function (item) {
    let y = this.titleBlockHeight() + this.itemBlockHeight() + this.mpCostBlockHeight();
    this.drawHorzLine(0, y);
    y += this.extraPadding() + 3;
    let desc = item ? item.description : '-';
    this.drawTextEx(desc, this.extraPadding(), y);
};

Window_StatsMagic.prototype.itemRect = function (index) {
    var rect = Window_Pagination.prototype.itemRect.call(this, index);
    rect.x += this.extraPadding();
    rect.y += this.extraPadding() + this.titleBlockHeight();
    rect.width -= this.extraPadding() * 2;
    return rect;
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_StatsMagic.prototype.hide = function () {
    this.setLastSelected(this.index());
    Window_Pagination.prototype.hide.call(this);
};

Window_StatsMagic.prototype.select = function (index) {
    this._index = Math.min(this.maxItems() - 1, index);
    this._stayCount = 0;
    this.refresh();
    this.updateCursor();
};

Window_StatsMagic.prototype.refresh = function () {
    if (this._actor) {
        this.makeItemList();
        this.contents.clear();
        Window_Pagination.prototype.refresh.call(this);
        Window_StatsCommon.prototype.drawNameTitle.call(this, 'Magic');
        this.drawAllItems();
        let item = this.item();
        this.drawMPCostBlock(item);
        this.drawDescriptionBlock(item);
    }
};