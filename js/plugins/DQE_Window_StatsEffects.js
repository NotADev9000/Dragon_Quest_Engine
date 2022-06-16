//=============================================================================
// Dragon Quest Engine - Window Stats Effects
// DQE_Window_StatsEffects.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window breaking down an actors' effects - V0.1
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
Imported.DQEng_Window_StatsEffects = true;

var DQEng = DQEng || {};
DQEng.Window_StatsEffects = DQEng.Window_StatsEffects || {};

//-----------------------------------------------------------------------------
// Window_StatsEffects
//-----------------------------------------------------------------------------

function Window_StatsEffects() {
    this.initialize.apply(this, arguments);
}

Window_StatsEffects.prototype = Object.create(Window_StatsMagic.prototype);
Window_StatsEffects.prototype.constructor = Window_StatsEffects;

Window_StatsEffects.prototype.initialize = function (x, y, width, height) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this._category = -1;
    this._actor = null;
    this._data = [];
    this._title = 'Effects';
    this._noData = 'No Effects!';
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_StatsEffects.prototype.itemWidth = function () {
    return 609;
};

Window_StatsEffects.prototype.spacing = function () {
    return 60;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_StatsEffects.prototype.makeItemList = function () {
    this._data = this._actor.changedEffects();
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_StatsEffects.prototype.drawItem = function (index) {
    let item = this._data[index];
    if (item) {
        // effect name
        let text; 
        switch (item[0]) {
            case 0:
                // UNIMPLEMENTED
                break;
            case 1:
                text = TextManager.xparam(item[1]);
                break;
            case 2:
                text = TextManager.sparam(item[1]);
                break;
            case 3:
                text = $dataStates[item[1]].meta.resistName;
                break;
        }
        let rect = this.itemRectForText(index);
        let width = this.itemWidth();
        this.drawText(text, rect.x, rect.y, width);
        // effect value
        text = this._actor.displayEffects(item[0], item[1]);
        this.drawText(`${text}%`, rect.x, rect.y, width, 'right');
    }
};

Window_StatsEffects.prototype.drawDescriptionBlock = function () {
    let item = this._data[this.index()];
    let desc = '-';
    let y = this.titleBlockHeight() + this.itemBlockHeight();
    this.drawHorzLine(0, y);
    y += this.extraPadding() + 3;
    if (item) {
        switch (item[0]) {
            case 0:
                // UNIMPLEMENTED
                break;
            case 1:
                desc = TextManager.xparamDescription(item[1]);
                break;
            case 2:
                desc = TextManager.sparamDescription(item[1]);
                break;
            case 3:
                desc = TextManager.stateResistDescription(item[1]);
                break;
        }
    }
    this.drawTextEx(desc, this.extraPadding(), y);
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_StatsEffects.prototype.refresh = function () {
    if (this._actor) {
        this.makeItemList();
        this.contents.clear();
        Window_Pagination.prototype.refresh.call(this);
        Window_StatsCommon.prototype.drawNameTitle.call(this, this._title);
        this.drawAllItems();
        this.drawDescriptionBlock();
    }
};
