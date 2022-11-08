//=============================================================================
// Dragon Quest Engine - Window Shop Carry
// DQE_Window_ShopCarry.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for the shop's Carry list - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Window_ShopCarry = DQEng.Window_ShopCarry || {};

//-----------------------------------------------------------------------------
// Window_ShopCarry
//-----------------------------------------------------------------------------

function Window_ShopCarry() {
    this.initialize.apply(this, arguments);
}

Window_ShopCarry.prototype = Object.create(Window_Base.prototype);
Window_ShopCarry.prototype.constructor = Window_ShopCarry;

Window_ShopCarry.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._item = null;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_ShopCarry.prototype.standardPadding = function () {
    return 9;
};

Window_ShopCarry.prototype.extraPadding = function () {
    return 15;
};

Window_ShopCarry.prototype.titleBlockHeight = function () {
    return 54;
};

Window_ShopCarry.prototype.itemWidth = function () {
    return 576;
};

Window_ShopCarry.prototype.spacing = function () {
    return 144;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_ShopCarry.prototype.setItem = function (item) {
    this._item = item;
    this.refresh();
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_ShopCarry.prototype.drawTitle = function () {
    this.drawText('Carrying', 0, this.extraPadding(), this.contentsWidth(), 'center');
    this.drawHorzLine(0, this.titleBlockHeight() - 3);
};

Window_ShopCarry.prototype.drawAll = function () {
    const iw = this.itemWidth();
    let index = 0;
    let rect, amount;
    // actors
    $gameParty.members().forEach((actor) => {
        rect = this.itemRect(index);
        // name
        this.drawText(actor.name(), rect.x, rect.y);
        // value
        amount = actor.amountOfItem(this._item, 0);
        this.drawText(amount, rect.x, rect.y, iw, 'right');
        // index
        index++;
    });
    // bag
    rect = this.itemRect(index);
    // name
    this.drawText('Bag', rect.x, rect.y);
    // value
    amount = $gameParty.numItems(this._item);
    this.drawText(amount, rect.x, rect.y, iw, 'right');
};

Window_ShopCarry.prototype.itemRect = function (index) {
    const ep = this.extraPadding();
    let rect = new Rectangle();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = ep + (index % 2 * (rect.width + this.spacing()));
    rect.y = this.titleBlockHeight() + ep + (Math.floor(index / 2) * rect.height);
    return rect;
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_ShopCarry.prototype.refresh = function () {
    if (this._item) {
        this.contents.clear();
        this.drawTitle();
        this.drawAll();
    }
};