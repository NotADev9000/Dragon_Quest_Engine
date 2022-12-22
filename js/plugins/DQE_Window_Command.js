//=============================================================================
// Dragon Quest Engine - Window Command
// DQE_Window_Command.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The superclass of windows for selecting a command - V0.1
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
Imported.DQEng_Window_Command = true;

//-----------------------------------------------------------------------------
// Window_Command
//-----------------------------------------------------------------------------

Window_Command.prototype.updateWindowDisplay = function () {
    this.height = this.windowHeight();
    this.width = this.windowWidth();
    this.refresh(false);
};
