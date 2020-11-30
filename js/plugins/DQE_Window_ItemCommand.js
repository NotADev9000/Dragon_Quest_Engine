//=============================================================================
// Dragon Quest Engine - Item Command
// DQE_Window_ItemCommand.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The item menu command list - V0.1
*
*
* @help
* The window for selecting which item inventory to view
* (party member, item, equipment or important)
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_ItemCommand = true;

var DQEng = DQEng || {};
DQEng.Window_ItemCommand = DQEng.Window_ItemCommand || {};

//-----------------------------------------------------------------------------
// Window_ItemCommand
//-----------------------------------------------------------------------------\

function Window_ItemCommand() {
    this.initialize.apply(this, arguments);
}

Window_ItemCommand.prototype = Object.create(Window_TitledPartyCommand.prototype);
Window_ItemCommand.prototype.constructor = Window_ItemCommand;

Window_ItemCommand.prototype.isCurrentItemEnabled = function () {
    return this._associatedWindow[0]._data.length;
};
