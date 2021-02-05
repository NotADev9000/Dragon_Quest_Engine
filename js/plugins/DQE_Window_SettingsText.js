//=============================================================================
// Dragon Quest Engine - Window Settings - Text
// DQE_Window_SettingsText.js                                                             
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
Imported.DQEng_Window_SettingsText = true;

var DQEng = DQEng || {};
DQEng.Window_SettingsText = DQEng.Window_SettingsText || {};

//-----------------------------------------------------------------------------
// Window_SettingsText
//-----------------------------------------------------------------------------

function Window_SettingsText() {
    this.initialize.apply(this, arguments);
}

Window_SettingsText.prototype = Object.create(Window_Settings.prototype);
Window_SettingsText.prototype.constructor = Window_SettingsText;

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_SettingsText.prototype.makeCommandList = function () {
    this.addCommand('Battle Text Speed', 'battleTextSpeed', Window_Settings.COMMAND_TYPE_TEXT_SPEED);
};
