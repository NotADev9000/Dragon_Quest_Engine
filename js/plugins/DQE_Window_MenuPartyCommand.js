//=============================================================================
// Dragon Quest Engine - Party Select Base
// DQE_Window_MenuPartyCommand.js                                                             
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
Imported.DQEng_Window_MenuPartyCommand = true;

var DQEng = DQEng || {};
DQEng.Window_MenuPartyCommand = DQEng.Window_MenuPartyCommand || {};

//-----------------------------------------------------------------------------
// Window_MenuPartyCommand
//-----------------------------------------------------------------------------

function Window_MenuPartyCommand() {
    this.initialize.apply(this, arguments);
}

Window_MenuPartyCommand.prototype = Object.create(Window_Command.prototype);
Window_MenuPartyCommand.prototype.constructor = Window_MenuPartyCommand;

/**
 * @param {String} menuTitle the displayed title of the window
 * @param {Array} optionalCommands optional commands that will be displayed below the party list
 */
Window_MenuPartyCommand.prototype.initialize = function (x, y, menuTitle, optionalCommands) {
    this._menuTitle = menuTitle || "???"
    this._optionalCommands = optionalCommands;
    Window_Command.prototype.initialize.call(this, x, y);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_MenuPartyCommand.prototype.windowWidth = function () {
    return 354;
};

Window_MenuPartyCommand.prototype.windowHeight = function () {
    return this.fittingHeight(this.numVisibleRows());
};

/**
 * Fitting height calculated by adding the height of each command,
 * the gaps between commands, the padding on both sides
 * and the title block
 * 
 * @param {number} numLines the number of commands
 */
Window_MenuPartyCommand.prototype.fittingHeight = function (numLines) {
    return numLines * this.lineHeight() 
    + (this.standardPadding() + this.extraPadding()) * 2 
    + (this.lineGap() * Math.max(numLines - 1, 0))
    + this.titleBlockHeight();
};

/**
 * The height of the windows title block (from standard padding to horizontal line)
 */
Window_MenuPartyCommand.prototype.titleBlockHeight = function () {
    return 51;
};

/**
 * Padding is 9 so horizontal rule covers the whole window
 */
Window_MenuPartyCommand.prototype.standardPadding = function () {
    return 9;
};

/**
 * Extra padding added to correctly position text.
 * The horizontal line ignores this padding
 */
Window_MenuPartyCommand.prototype.extraPadding = function () {
    return 15;
};

Window_MenuPartyCommand.prototype.lineGap = function () {
    return 15;
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_MenuPartyCommand.prototype.makeCommandList = function () {
    this.addPartyCommands();
    if (this._optionalCommands != undefined) { this.addOptionalCommands(); }
};

/**
 * Add party member names as command
 */
Window_MenuPartyCommand.prototype.addPartyCommands = function () {
    var partyMembers = $gameParty.members();
    partyMembers.forEach(member => {
        this.addCommand(member._name, member._name, true);
    });
};

Window_MenuPartyCommand.prototype.addOptionalCommands = function () {
    this._optionalCommands.forEach(command => {
        this.addCommand(command, command, true);
    });
}

//////////////////////////////
// Functions - drawing to window
//////////////////////////////

/**
 * Draws window title and horizontal line
 */
Window_MenuPartyCommand.prototype.drawTitleBlock = function () {
    var titleWidth = this.windowWidth() - (this.standardPadding() + this.extraPadding()) * 2;

    this.drawText(this._menuTitle, this.extraPadding(), this.extraPadding(), titleWidth, 'center');
    this.drawHorzLine(0, 51);
}

/**
 * extraPadding is added to properly adjust commands
 * titleblockHeight is added to y position to place commands below the title block
 */
Window_MenuPartyCommand.prototype.itemRect = function (index) {
    var rect = Window_Selectable.prototype.itemRect.call(this, index);
    rect.x += this.extraPadding();
    rect.y += this.extraPadding() + this.titleBlockHeight();
    return rect;
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_MenuPartyCommand.prototype.refresh = function () {
    // set up commands
    this.clearCommandList();
    this.makeCommandList();
    // set up window content
    this.createContents();
    this.contents.clear();
    // draw window content
    this.drawTitleBlock();
    this.drawAllItems();
};
