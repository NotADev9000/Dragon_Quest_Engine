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
* must inherit from Window_Settings_Audio for the 'changeValue' function
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

Window_Settings_Battle.prototype = Object.create(Window_Settings_Audio.prototype);
Window_Settings_Battle.prototype.constructor = Window_Settings_Battle;

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_Settings_Battle.prototype.makeCommandList = function () {
    Window_Settings_Audio.prototype.makeCommandList.call(this);
    Window_Settings_Text.prototype.makeCommandList.call(this);
};
