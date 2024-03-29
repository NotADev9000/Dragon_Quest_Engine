//=============================================================================
// Dragon Quest Engine - Window SavefileList
// DQE_Window_SavefileList.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The savefile list window - V0.1
*
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Window_SavefileList = DQEng.Window_SavefileList || {};

//-----------------------------------------------------------------------------
// Window_SavefileList
//-----------------------------------------------------------------------------

Window_SavefileList.prototype.initialize = function (x, y, width, mode = 0) {
    const height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._mode = mode;
    this.refresh();
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_SavefileList.prototype.standardPadding = function () {
    return 9;
};

Window_SavefileList.prototype.extraPadding = function () {
    return 15;
};

Window_SavefileList.prototype.itemHeight = function () {
    return 126;
};

/**
 * height of a single line of text + the gap below it
 */
Window_SavefileList.prototype.textRowHeight = function () {
    return this.lineHeight() + this.lineGap();
};

Window_SavefileList.prototype.titleBlockHeight = function () {
    return 54;
};

Window_SavefileList.prototype.windowHeight = function () {
    return (this.standardPadding() * 2)
        + this.titleBlockHeight()
        + (this.itemHeight() * this.maxItems())
        - 3;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_SavefileList.prototype.maxItems = function () {
    return DataManager.maxSavefiles();
};

Window_SavefileList.prototype.savefileId = function () {
    return this.index() + 1;
};

Window_SavefileList.prototype.isCurrentItemEnabled = function () {
    return this._mode === 0 ? true : DataManager.isThisGameFile(this.savefileId());
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SavefileList.prototype.drawTitle = function () {
    const title = 'Adventure Log';
    const ep = this.extraPadding();
    const x = ep;
    let y = ep;
    this.drawText(title, x, y);
    y += this.textRowHeight();
    this.drawHorzLine(0, y);
};

Window_SavefileList.prototype.drawItem = function (index) {
    const id = index + 1;
    const valid = DataManager.isThisGameFile(id);
    const info = DataManager.loadSavefileInfo(id);
    const rect = this.itemRectForText(index);
    const rowHeight = this.textRowHeight();
    // row 1
    // ID + Level
    let text = `${id}: `;
    text += valid ? `Lv.${info.level}` : `-`;
    this.drawText(text, rect.x, rect.y);
    // Map
    if (valid) this.drawText(info.map, rect.x + 216, rect.y);
    rect.y += rowHeight;
    // row 2
    if (valid) {
        text = `\\c[10]Play Time: \\c[0]${info.playtime}`;
        this.drawTextEx(text, rect.x, rect.y);
    }
    rect.y += rowHeight;
    // row 3
    if (valid) {
        text = `\\c[8]Saved On: \\c[0]${info.date}  ${info.time}`;
        this.drawTextEx(text, rect.x, rect.y);
    }
    rect.y += rowHeight;
    // horizontal rule
    this.drawHorzLine(0, rect.y);
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_SavefileList.prototype.refresh = function () {
    if (this.contents) {
        this.contents.clear();
        this.drawTitle();
        this.drawAllItems();
    }
};