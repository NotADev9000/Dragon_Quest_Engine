//=============================================================================
// Dragon Quest Engine - Window Settings - Audio
// DQE_Window_SettingsAudio.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window for changing audio settings - V0.1
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
Imported.DQEng_Window_SettingsAudio = true;

var DQEng = DQEng || {};
DQEng.Window_SettingsAudio = DQEng.Window_SettingsAudio || {};

//-----------------------------------------------------------------------------
// Window_SettingsAudio
//-----------------------------------------------------------------------------

function Window_SettingsAudio() {
    this.initialize.apply(this, arguments);
}

Window_SettingsAudio.prototype = Object.create(Window_Settings.prototype);
Window_SettingsAudio.prototype.constructor = Window_SettingsAudio;

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_SettingsAudio.prototype.makeCommandList = function () {
    this.addCommand(TextManager.bgmVolume, 'bgmVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.bgsVolume, 'bgsVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.seVolume, 'seVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.settings_cursorBeep, 'cursorBeep', Window_Settings.COMMAND_TYPE_BOOL_ONOFF);
};
