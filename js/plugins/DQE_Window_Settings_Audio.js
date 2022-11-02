//=============================================================================
// Dragon Quest Engine - Window Settings - Audio
// DQE_Window_Settings_Audio.js                                                             
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
Imported.DQEng_Window_Settings_Audio = true;

var DQEng = DQEng || {};
DQEng.Window_Settings_Audio = DQEng.Window_Settings_Audio || {};

//-----------------------------------------------------------------------------
// Window_Settings_Audio
//-----------------------------------------------------------------------------

function Window_Settings_Audio() {
    this.initialize.apply(this, arguments);
}

Window_Settings_Audio.prototype = Object.create(Window_Settings.prototype);
Window_Settings_Audio.prototype.constructor = Window_Settings_Audio;

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_Settings_Audio.prototype.makeCommandList = function () {
    this.addCommand(TextManager.bgmVolume, 'bgmVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.bgsVolume, 'bgsVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.seVolume, 'seVolume', Window_Settings.COMMAND_TYPE_VOLUME);
    this.addCommand(TextManager.settings_cursorBeep, 'cursorBeep', Window_Settings.COMMAND_TYPE_BOOL_ONOFF);
};

Window_Settings_Audio.prototype.changeValue = function (symbol, value) {
    Window_Settings.prototype.changeValue.call(this, symbol, value);
    if (symbol === 'seVolume') this.playOkSound(); // play sfx when changing sound effect volume
};
