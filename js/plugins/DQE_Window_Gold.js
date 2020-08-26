//=============================================================================
// Dragon Quest Engine - Window Gold
// DQE_Window_Gold.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc similar to default window but with different size/padding - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_Gold = true;

var DQEng = DQEng || {};
DQEng.Window_Gold = DQEng.Window_Gold || {};

//-----------------------------------------------------------------------------
// Window_Base
//-----------------------------------------------------------------------------

/**
 * Format Gold amount when displayed in a window
 * e.g. 10000 becomes 10,000
 *
 * @gameMatch custom
 */
Window_Base.prototype.drawCurrencyValue = function (value, unit, x, y, width) {
    var unitWidth = Math.min(80, this.textWidth(unit));
    var currencyUnitX = width - unitWidth;

    if (value > 9999) value = value.toLocaleString();
    this.resetTextColor();
    this.drawText(value, x, y, currencyUnitX - 24, 'right');
    this.changeTextColor(this.goldColor());
    this.drawText(unit, currencyUnitX, y, unitWidth, 'right');
};

//-----------------------------------------------------------------------------
// Window_Gold
//-----------------------------------------------------------------------------

Window_Gold.prototype.lineHeight = function () {
    return 21;
};

Window_Gold.prototype.windowWidth = function () {
    return 306;
};

Window_Gold.prototype.windowHeight = function () {
    return this.lineHeight() + (this.standardPadding() * 2);
};

Window_Gold.prototype.standardPadding = function () {
    return 24;
};

Window_Gold.prototype.refresh = function () {
    this.contents.clear();
    this.drawCurrencyValue(this.value(), this.currencyUnit(), 0, 0, this.contents.width);
};