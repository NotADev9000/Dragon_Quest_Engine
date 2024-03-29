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

/**
 * @param {array} commands extra commands in list that are below the party names
 * @param {array} excludeActors index of actors to exclude from command list
 * @param {String} commandType which set of actors should be included in the list
 * @param {function} updateExtra the function to be called when an EXTRA command is currently selected
 */
Window_TitledPartyCommand.prototype.initialize = function (x, y, windowWidth, menuTitle = '???', commands, selectCallback, excludeActors = [], commandType) {
    this._excludeActors = excludeActors;
    this._commandType = commandType;
    Window_TitledCommand.prototype.initialize.call(this, x, y, windowWidth, menuTitle, commands, selectCallback);
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_TitledPartyCommand.prototype.makeCommandList = function () {
    switch (this._commandType) {
        case 'backline':
            this.addBacklineCommands();
            break;
        default:
            this.addPartyCommands();
            break;
    }
    if (this._commands != undefined) { this.addCommands(); }
};

Window_TitledPartyCommand.prototype.addBacklineCommands = function () {
    var backline = $gameParty.backline();
    backline.forEach((member, index) => {
        index += 4; // add 4 so it lines up with all party members
        if (this._excludeActors.indexOf(index) === -1) {
            this.addCommand(member._name, index, true);
        }
    });
};

/**
 * Add party member names as commands
 */
Window_TitledPartyCommand.prototype.addPartyCommands = function () {
    var partyMembers = $gameParty.members();
    partyMembers.forEach((member, index) => {
        if (this._excludeActors.indexOf(index) === -1) {
            this.addCommand(member._name, index, true);
        }
    });
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

Window_TitledPartyCommand.prototype.updateHelp = function () {
    const symbol = this.currentSymbol();
    this._helpWindow.forEach(helpWindow => {
        helpWindow.setCategory(symbol);
    });
};

Window_TitledPartyCommand.prototype.updateSingleHelp = function (helpWindow) {
    helpWindow.setCategory(this.currentSymbol());
};
