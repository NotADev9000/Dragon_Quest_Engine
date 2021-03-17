//=============================================================================
// Dragon Quest Engine - Window Settings - Battle
// DQE_Window_SettingsBattle.js                                                             
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
Imported.DQEng_Window_SettingsBattle = true;

var DQEng = DQEng || {};
DQEng.Window_SettingsBattle = DQEng.Window_SettingsBattle || {};

//-----------------------------------------------------------------------------
// Window_SettingsBattle
//-----------------------------------------------------------------------------

function Window_SettingsBattle() {
    this.initialize.apply(this, arguments);
}

Window_SettingsBattle.prototype = Object.create(Window_Settings.prototype);
Window_SettingsBattle.prototype.constructor = Window_SettingsBattle;

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_SettingsBattle.prototype.makeCommandList = function () {
    this.addCommand(TextManager.bgmVolume, 'bgmVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.bgsVolume, 'bgsVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.seVolume, 'seVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.settings_cursorBeep, 'cursorBeep', Window_Settings.COMMAND_TYPE_BOOL_ONOFF);
    this.addCommand('Battle Text Speed', 'battleTextSpeed', Window_Settings.COMMAND_TYPE_TEXT_SPEED);
};
