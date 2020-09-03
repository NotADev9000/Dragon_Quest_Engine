//=============================================================================
// Dragon Quest Engine - Party Select Base
// DQE_Window_TitledPartyCommand.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The party command base - V0.1
*
*
* @help
* The window for selecting a party member from a list
* the window will have a displayed title, the names of all active party members
* and an optional command at the bottom of the window
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_TitledPartyCommand = true;

var DQEng = DQEng || {};
DQEng.Window_TitledPartyCommand = DQEng.Window_TitledPartyCommand || {};

//-----------------------------------------------------------------------------
// Window_TitledPartyCommand
//-----------------------------------------------------------------------------

function Window_TitledPartyCommand() {
    this.initialize.apply(this, arguments);
}

Window_TitledPartyCommand.prototype = Object.create(Window_TitledCommand.prototype);
Window_TitledPartyCommand.prototype.constructor = Window_TitledPartyCommand;

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_TitledPartyCommand.prototype.makeCommandList = function () {
    this.addPartyCommands();
    if (this._commands != undefined) { this.addCommands(); }
};

/**
 * Add party member names as commands
 */
Window_TitledPartyCommand.prototype.addPartyCommands = function () {
    var partyMembers = $gameParty.members();
    partyMembers.forEach(member => {
        this.addCommand(member._name, member._name, true);
    });
};
