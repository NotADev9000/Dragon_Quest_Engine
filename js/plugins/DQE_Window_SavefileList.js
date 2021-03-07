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

Window_SavefileList.prototype.initialize = function (x, y, width) {
    const height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
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

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SavefileList.prototype.drawTitle = function () {
    const title = 'Adventure Log';
    const ep = this.extraPadding();
    const x = ep;
    let y = ep;
    this.drawText(title, x, y);
    y += this.lineHeight() + this.lineGap();
    this.drawHorzLine(0, y);
};

Window_SavefileList.prototype.drawItem = function (index) {
    let id = index + 1;
    let valid = DataManager.isThisGameFile(id);
    let info = DataManager.loadSavefileInfo(id);
    let rect = this.itemRectForText(index);
    let rowHeight = this.lineHeight() + this.lineGap();
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

Window_SavefileList.prototype.itemRect = function (index) {
    let ep = this.extraPadding();
    let iw = this.itemWidth();
    let ih = this.itemHeight();
    let rect = new Rectangle();
    rect.width = iw;
    rect.height = ih;
    rect.x = ep;
    rect.y = this.titleBlockHeight() + ep + (index * ih);
    return rect;
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