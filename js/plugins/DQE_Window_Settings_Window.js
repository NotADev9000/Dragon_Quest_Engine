//=============================================================================
// Dragon Quest Engine - Window Settings - Window
// DQE_Window_Settings_Window.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window for changing window settings - V0.1
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
Imported.DQEng_Window_Settings_Window = true;

var DQEng = DQEng || {};
DQEng.Window_Settings_Window = DQEng.Window_Settings_Window || {};

//-----------------------------------------------------------------------------
// Window_Settings_Window
//-----------------------------------------------------------------------------

function Window_Settings_Window() {
    this.initialize.apply(this, arguments);
}

Window_Settings_Window.prototype = Object.create(Window_Settings__Description.prototype);
Window_Settings_Window.prototype.constructor = Window_Settings_Window;

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_Settings_Window.prototype.makeCommandList = function () {
    this.addCommand('Window Scale', 'windowScale', Window_Settings.COMMAND_TYPE_SCALE, !ConfigManager.fullscreen);
    this.addCommand('Fullscreen', 'fullscreen', Window_Settings.COMMAND_TYPE_BOOL_ONOFF);
};

Window_Settings_Window.prototype.makeDescriptions = function () {
    this._descriptions = [
        `Change the size of the game window when fullscreen is OFF.<BR>x3 is the default value.`,   // WINDOW SCALE
        `Toggle fullscreen.<BR>Can be done anytime by pressing F4 on your keyboard.`                // FULLSCREEN
    ];
};
