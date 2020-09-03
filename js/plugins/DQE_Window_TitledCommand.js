//=============================================================================
// Dragon Quest Engine - Command list with a title
// DQE_Window_TitledCommand.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The command list window with a title - V0.1
*
*
* @help
* The window for selecting a command from a list
* the window will have a displayed title and any
* passed in commands
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_TitledCommand = true;

var DQEng = DQEng || {};
DQEng.Window_TitledCommand = DQEng.Window_TitledCommand || {};

//-----------------------------------------------------------------------------
// Window_TitledCommand
//-----------------------------------------------------------------------------

function Window_TitledCommand() {
    this.initialize.apply(this, arguments);
}

Window_TitledCommand.prototype = Object.create(Window_Command.prototype);
Window_TitledCommand.prototype.constructor = Window_TitledCommand;

/**
 * @param {String} menuTitle the displayed title of the window
 * @param {Array} commands commands that will be displayed below the title
 */
Window_TitledCommand.prototype.initialize = function (x, y, windowWidth, menuTitle, commands) {
    this._windowWidth = windowWidth;
    this._menuTitle = menuTitle || "???"
    this._commands = commands;
    Window_Command.prototype.initialize.call(this, x, y);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_TitledCommand.prototype.windowWidth = function () {
    return this._windowWidth;
};

Window_TitledCommand.prototype.windowHeight = function () {
    return this.fittingHeight(this.numVisibleRows());
};

/**
 * Fitting height calculated by adding the height of each command,
 * the gaps between commands, the padding on both sides
 * and the title block
 * 
 * @param {number} numLines the number of commands
 */
Window_TitledCommand.prototype.fittingHeight = function (numLines) {
    return numLines * this.lineHeight()
        + (this.standardPadding() + this.extraPadding()) * 2
        + (this.lineGap() * Math.max(numLines - 1, 0))
        + this.titleBlockHeight();
};

/**
 * The height of the windows title block (from standard padding to horizontal line)
 */
Window_TitledCommand.prototype.titleBlockHeight = function () {
    return 51;
};

/**
 * Padding is 9 so horizontal rule covers the whole window
 */
Window_TitledCommand.prototype.standardPadding = function () {
    return 9;
};

/**
 * Extra padding added to correctly position text.
 * The horizontal line ignores this padding
 */
Window_TitledCommand.prototype.extraPadding = function () {
    return 15;
};

Window_TitledCommand.prototype.lineGap = function () {
    return 15;
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_TitledCommand.prototype.makeCommandList = function () {
    if (this._commands != undefined) { this.addCommands(); }
};

Window_TitledCommand.prototype.addCommands = function () {
    this._commands.forEach(command => {
        this.addCommand(command, command, true);
    });
}

//////////////////////////////
// Functions - drawing to window
//////////////////////////////

/**
 * Draws window title and horizontal line
 */
Window_TitledCommand.prototype.drawTitleBlock = function () {
    var titleWidth = this.windowWidth() - (this.standardPadding() + this.extraPadding()) * 2;

    this.drawText(this._menuTitle, this.extraPadding(), this.extraPadding(), titleWidth, 'center');
    this.drawHorzLine(0, 51);
}

/**
 * extraPadding is added to properly adjust commands
 * titleblockHeight is added to y position to place commands below the title block
 */
Window_TitledCommand.prototype.itemRect = function (index) {
    var rect = Window_Selectable.prototype.itemRect.call(this, index);
    rect.x += this.extraPadding();
    rect.y += this.extraPadding() + this.titleBlockHeight();
    return rect;
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_TitledCommand.prototype.refresh = function () {
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
