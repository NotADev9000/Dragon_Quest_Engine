//=============================================================================
// Dragon Quest Engine - Window Party Command
// DQE_Window_PartyCommand.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Static class for managing the battle - V0.1
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
Imported.DQEng_Window_PartyCommand = true;

var DQEng = DQEng || {};
DQEng.Window_PartyCommand = DQEng.Window_PartyCommand || {};

//-----------------------------------------------------------------------------
// Window_PartyCommand
//-----------------------------------------------------------------------------

Window_PartyCommand.prototype.initialize = function (x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this.openness = 0;
    this.deactivate();
};

Window_PartyCommand.prototype.windowWidth = function () {
    return 228;
};

Window_PartyCommand.prototype.standardPadding = function () {
    return 24;
};

Window_PartyCommand.prototype.lineGap = function () {
    return 15;
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_PartyCommand.prototype.makeCommandList = function () {
    this.addCommand(TextManager.fight, 'Fight');
    this.addCommand('Misc.', 'Misc.');
    this.addCommand('Line-Up', 'Line-Up');
    this.addCommand(TextManager.escape, 'Escape', BattleManager.canEscape());
};

Window_PartyCommand.prototype.isCurrentItemEnabled = function () {
    return this.isEnabled(this.currentSymbol());
};

Window_PartyCommand.prototype.isEnabled = function (symbol) {
    switch (symbol) {
        case 'Line-Up':
            return $gameParty.allMembers().length > 4;
        default:
            return true;
    }
};

//////////////////////////////
// Functions - settings
//////////////////////////////

Window_PartyCommand.prototype.processOk = function () {
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.updateInputData();
        this.deactivate();
        this.callHandler('Disabled');
    }
};
