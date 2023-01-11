//=============================================================================
// Dragon Quest Engine - Window Zoom
// DQE_Window_Zoom.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window showing Zoom locations - V0.1
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
DQEng.Window_Zoom = DQEng.Window_Zoom || {};

//-----------------------------------------------------------------------------
// Window_Zoom
//-----------------------------------------------------------------------------

function Window_Zoom() {
    this.initialize.apply(this, arguments);
}

Window_Zoom.prototype = Object.create(Window_Pagination.prototype);
Window_Zoom.prototype.constructor = Window_Zoom;

Window_Zoom.prototype.initialize = function (x, y, width, height, menuTitle = '???') {
    this._menuTitle = menuTitle;
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Zoom.prototype.titleBlockHeight = function () {
    return 54;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_Zoom.prototype.item = function () {
    return $gameParty.zoomPoints()[this.index()];
};

Window_Zoom.prototype.maxItems = function () {
    return $gameParty.zoomPoints().length;
};

//////////////////////////////
// Functions - row
//////////////////////////////

Window_Zoom.prototype.maxRows = function () {
    if (this._maxRows != -1) return this._maxRows;
    const pageHeight = this.height - (this.padding * 2) - this.pageBlockHeight() - this.titleBlockHeight();
    return Math.floor(pageHeight / this.itemHeight());
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Zoom.prototype.drawTitle = function () {
    this.drawText(this._menuTitle, 0, this.extraPadding(), this.contentsWidth(), 'center');
    this.drawHorzLine(0, 51);
};

Window_Zoom.prototype.drawItem = function (index) {
    const point = $gameParty.zoomPoints()[index];
    if (point) {
        const rect = this.itemRectForText(index);
        this.drawText(point.name, rect.x, rect.y);
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_Zoom.prototype.refresh = function () {
    this.createContents();
    this.drawTitle();
    Window_Pagination.prototype.refresh.call(this);
    this.drawAllItems();
};
