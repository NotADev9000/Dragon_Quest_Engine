//=============================================================================
// Dragon Quest Engine - Window Icon Help
// DQE_Window_IconHelp.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Displays an icon and some text - V0.1
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
DQEng.Window_IconHelp = DQEng.Window_IconHelp || {};

//-----------------------------------------------------------------------------
// Window_IconHelp
//-----------------------------------------------------------------------------

function Window_IconHelp() {
    this.initialize.apply(this, arguments);
}

Window_IconHelp.prototype = Object.create(Window_Base.prototype);
Window_IconHelp.prototype.constructor = Window_IconHelp;

/**
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Array} handlers 
 * @param {Array} texts 
 * @param {Number} standardPadding 
 * @param {Number} extraPadding 
 */
Window_IconHelp.prototype.initialize = function (x, y, width, height, handlers, texts, standardPadding = 9, extraPadding = 18, lineGap = 33) {
    this._handlers = handlers;
    this._texts = texts;
    this._standPad = standardPadding;
    this._extraPad = extraPadding;
    this._lineGap = lineGap;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.drawInfo();
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_IconHelp.prototype.standardPadding = function () {
    return this._standPad;
};

Window_IconHelp.prototype.extraPadding = function () {
    return this._extraPad;
};

Window_IconHelp.prototype.lineGap = function () {
    return this._lineGap;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_IconHelp.prototype.drawInfo = function () {
    const ep = this.extraPadding();
    let y = ep;
    this._texts.forEach((text, i) => {
        this.drawHandlerAsIcon(this._handlers[i], 6, y, '', ' ' + text, false, false);
        y += this.itemHeight();
    });
};
