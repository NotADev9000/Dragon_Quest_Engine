//=============================================================================
// Dragon Quest Engine - Window Icon
// DQE_Window_Icon.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Displays an icon in a window - V0.1
*
*
* @help
* N/A
*
*/

//------
// Namespace
//------

var DQEng = DQEng || {};
DQEng.Window_Icon = DQEng.Window_Icon || {};

//-----------------------------------------------------------------------------
// Window_Icon
//-----------------------------------------------------------------------------

function Window_Icon() {
    this.initialize.apply(this, arguments);
}

Window_Icon.prototype = Object.create(Window_Base.prototype);
Window_Icon.prototype.constructor = Window_Icon;

Window_Icon.prototype.initialize = function (x, y, width, height, handler) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.drawInfo(handler);
};

Window_Icon.prototype.standardPadding = function () {
    return 15;
};

Window_Icon.prototype.drawInfo = function (handler) {
    let icon = this.getHandlerIcon(handler);
    let text = `\\i[${icon}]`;
    this.drawTextEx(text, 0, 12);
};
