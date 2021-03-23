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

Window_IconHelp.prototype.initialize = function (x, y, width, height, handler, text) {
    this._handler = handler;
    this._text = text;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.drawInfo();
};

Window_IconHelp.prototype.standardPadding = function () {
    return 15;
};

Window_IconHelp.prototype.drawInfo = function () {
    const icon = this.getHandlerIcon(this._handler);
    const text = `\\i[${icon}] ${this._text}`;
    this.drawTextEx(text, 0, 12);
};
