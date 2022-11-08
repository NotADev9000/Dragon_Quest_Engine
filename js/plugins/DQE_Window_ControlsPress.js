//=============================================================================
// Dragon Quest Engine - Window Controls Press
// DQE_Window_ControlsPress.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Displays information about changing buttons - V0.1
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
Imported.DQEng_Window_ControlsPress = true;

var DQEng = DQEng || {};
DQEng.Window_ControlsPress = DQEng.Window_ControlsPress || {};

//-----------------------------------------------------------------------------
// Window_ControlsPress
//-----------------------------------------------------------------------------

function Window_ControlsPress() {
    this.initialize.apply(this, arguments);
}

Window_ControlsPress.prototype = Object.create(Window_Base.prototype);
Window_ControlsPress.prototype.constructor = Window_ControlsPress;

Window_ControlsPress.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.drawInfo();
};

Window_ControlsPress.prototype.drawInfo = function () {
    const width = this.contentsWidth();
    let text = 'Press new button';
    let y = 0;
    this.drawText(text, 0, y, width, 'center');
    y += this.itemHeight();
    text = 'Press Esc to cancel';
    this.drawText(text, 0, y, width, 'center');
};
