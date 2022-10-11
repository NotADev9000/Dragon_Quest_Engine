//=============================================================================
// Dragon Quest Engine - Window Settings - Text
// DQE_Window_Settings_Text.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window for changing text settings - V0.1
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
Imported.DQEng_Window_Settings_Text = true;

var DQEng = DQEng || {};
DQEng.Window_Settings_Text = DQEng.Window_Settings_Text || {};

//-----------------------------------------------------------------------------
// Window_Settings_Text
//-----------------------------------------------------------------------------

function Window_Settings_Text() {
    this.initialize.apply(this, arguments);
}

Window_Settings_Text.prototype = Object.create(Window_Settings.prototype);
Window_Settings_Text.prototype.constructor = Window_Settings_Text;

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_Settings_Text.prototype.makeCommandList = function () {
    this.addCommand('Battle Text Speed', 'battleTextSpeed', Window_Settings.COMMAND_TYPE_TEXT_SPEED);
};
