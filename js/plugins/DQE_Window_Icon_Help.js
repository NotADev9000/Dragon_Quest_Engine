//=============================================================================
// Dragon Quest Engine - Window Icon Help
// DQE_Window_Icon_Help.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Displays rows of icons with adjacent (optional) text - V0.1
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
Imported.DQE_Window_Icon_Help = true;

//-----------------------------------------------------------------------------
// Window_Icon_Help
//-----------------------------------------------------------------------------

function Window_Icon_Help() {
    this.initialize.apply(this, arguments);
}

Window_Icon_Help.prototype = Object.create(Window_Base.prototype);
Window_Icon_Help.prototype.constructor = Window_Icon_Help;

/**
 * @param {Number} x         x position of window in scene
 * @param {Number} y         y position of window in scene
 * @param {Number} width     width of window
 * @param {Array}  handlers  input handlers that will be drawn as corresponding icon
 * @param {Array}  texts     the text to display in line with icons
 */
Window_Icon_Help.prototype.initialize = function (x, y, width, handlers = [], texts = []) {
    this._handlers = handlers;
    this._texts = texts;
    Window_Base.prototype.initialize.call(this, x, y, width, this.windowHeight());
    this.drawInfo();
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Icon_Help.prototype.standardPadding = function () {
    return 9;
};

Window_Icon_Help.prototype.extraPadding = function () {
    return 18;
};

Window_Icon_Help.prototype.windowHeight = function () {
    const numRows = this._handlers.length;
    return this.fittingHeight(numRows);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Icon_Help.prototype.iconPadding = function () {
    return 6;
};

Window_Icon_Help.prototype.drawInfo = function () {
    const x = this.iconPadding();
    let y = this.extraPadding();
    this._handlers.forEach((handle, i) => {
        this.drawHandlerAsIcon(handle, x, y, '', ' ' + this._texts[i]);
        y += this.itemHeight();
    });
};
