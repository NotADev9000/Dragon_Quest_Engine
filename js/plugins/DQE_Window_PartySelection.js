//=============================================================================
// Dragon Quest Engine - Command list with party members
// DQE_Window_PartySelection.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The command list window with party members - V0.1
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
Imported.DQEng_Window_PartySelection = true;

var DQEng = DQEng || {};
DQEng.Window_PartySelection = DQEng.Window_PartySelection || {};

//-----------------------------------------------------------------------------
// Window_PartySelection
//-----------------------------------------------------------------------------

function Window_PartySelection() {
    this.initialize.apply(this, arguments);
}

Window_PartySelection.prototype = Object.create(Window_Command.prototype);
Window_PartySelection.prototype.constructor = Window_PartySelection;

Window_PartySelection.prototype.initialize = function (x, y, windowWidth, commandType) {
    this._windowWidth = windowWidth;
    this._commandType = commandType;
    Window_Command.prototype.initialize.call(this, x, y);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_PartySelection.prototype.windowWidth = function () {
    return this._windowWidth;
};

Window_PartySelection.prototype.windowHeight = function () {
    return this.fittingHeight(this.numVisibleRows());
};

Window_PartySelection.prototype.standardPadding = function () {
    return 24;
};

Window_PartySelection.prototype.lineGap = function () {
    return 15;
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_PartySelection.prototype.makeCommandList = function () {
    switch (this._commandType) {
        case 'frontline':
            this.addFrontlineCommands();
            break;
        default:
            this.addAllCommands();
            break;
    }
};

Window_PartySelection.prototype.addFrontlineCommands = function () {
    let frontline = $gameParty.frontline();
    frontline.forEach((member, index) => {
        this.addCommand(member._name, index);
    });
};

Window_PartySelection.prototype.addAllCommands = function () {
    let all = $gameParty.members();
    all.forEach((member, index) => {
        this.addCommand(member._name, index);
    });
};
