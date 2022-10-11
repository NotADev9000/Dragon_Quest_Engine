//=============================================================================
// Dragon Quest Engine - Window Settings - Battle
// DQE_Window_Settings_Battle.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window for changing battle settings - V0.1
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
Imported.DQEng_Window_Settings_Battle = true;

var DQEng = DQEng || {};
DQEng.Window_Settings_Battle = DQEng.Window_Settings_Battle || {};

//-----------------------------------------------------------------------------
// Window_Settings_Battle
//-----------------------------------------------------------------------------

function Window_Settings_Battle() {
    this.initialize.apply(this, arguments);
}

Window_Settings_Battle.prototype = Object.create(Window_Settings.prototype);
Window_Settings_Battle.prototype.constructor = Window_Settings_Battle;

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_Settings_Battle.prototype.makeCommandList = function () {
    this.addCommand(TextManager.bgmVolume, 'bgmVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.bgsVolume, 'bgsVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.seVolume, 'seVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.settings_cursorBeep, 'cursorBeep', Window_Settings.COMMAND_TYPE_BOOL_ONOFF);
    this.addCommand('Battle Text Speed', 'battleTextSpeed', Window_Settings.COMMAND_TYPE_TEXT_SPEED);
};
