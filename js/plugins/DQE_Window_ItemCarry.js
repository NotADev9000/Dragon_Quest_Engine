//=============================================================================
// Dragon Quest Engine - Window Item Carry
// DQE_Window_ItemCarry.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying amount of a singular item held - V0.1
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
Imported.DQEng_Window_ItemCarry = true;

var DQEng = DQEng || {};
DQEng.Window_ItemCarry = DQEng.Window_ItemCarry || {};

//-----------------------------------------------------------------------------
// Window_ItemCarry
//-----------------------------------------------------------------------------

function Window_ItemCarry() {
    this.initialize.apply(this, arguments);
}

Window_ItemCarry.prototype = Object.create(Window_Base.prototype);
Window_ItemCarry.prototype.constructor = Window_ItemCarry;

Window_ItemCarry.prototype.initialize = function (x, y, width) {
    Window_Base.prototype.initialize.call(this, x, y, width, this.windowHeight());
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_ItemCarry.prototype.windowHeight = function () {
    return 123;
};

Window_ItemCarry.prototype.standardPadding = function () {
    return 9;
};

Window_ItemCarry.prototype.extraPadding = function () {
    return 15;
};

Window_ItemCarry.prototype.textWidth = function () {
    return this.width - (this.standardPadding() + this.extraPadding()) * 2;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_ItemCarry.prototype.setItem = function (item) {
    this._item = item;
    this.refresh();
};

Window_ItemCarry.prototype.getCarry = function () {
    return $gameParty.numItems(this._item);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_ItemCarry.prototype.drawTitle = function () {
    const ep = this.extraPadding();
    this.drawText('In Bag', ep, ep, this.textWidth(), 'center');
};

Window_ItemCarry.prototype.drawCarry = function () {
    const carry = this.getCarry();
    this.drawText(carry, this.extraPadding(), 69, this.textWidth(), 'center');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_ItemCarry.prototype.refresh = function () {
    this.contents.clear();
    this.drawTitle();
    this.drawHorzLine(0, 51);
    if (this._item) this.drawCarry();
};
