//=============================================================================
// Dragon Quest Engine - Menu Command
// DQE_Window_MenuCommand.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The main menu command list - V0.1
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
Imported.DQEng_Window_MenuCommand = true;

var DQEng = DQEng || {};
DQEng.Window_MenuCommand = DQEng.Window_MenuCommand || {};

//-----------------------------------------------------------------------------
// Window_MenuCommand
//-----------------------------------------------------------------------------

Window_MenuCommand.prototype.standardPadding = function () {
    return 27;
};

Window_MenuCommand.prototype.windowWidth = function () {
    return 453;
};

Window_MenuCommand.prototype.maxCols = function () {
    return 2;
};

Window_MenuCommand.prototype.numVisibleRows = function () {
    return Math.ceil(this.maxItems()/2);
};

Window_MenuCommand.prototype.spacing = function () {
    return 27;
};

Window_MenuCommand.prototype.lineGap = function () {
    return 27;
};

Window_MenuCommand.prototype.makeCommandList = function () {
    this.addMainCommands();
    this.addFormationCommand();
    this.addOriginalCommands();
    this.addSaveCommand();
};

Window_MenuCommand.prototype.addMainCommands = function () {
    var enabled = this.areMainCommandsEnabled();
    if (this.needsCommand('item')) {
        this.addCommand(TextManager.item, 'item', enabled);
    }
    if (this.needsCommand('skill')) {
        this.addCommand(TextManager.skill, 'skill', enabled);
    }
    if (this.needsCommand('equip')) {
        this.addCommand(TextManager.equip, 'equip', enabled);
    }
    if (this.needsCommand('options')) {
        this.addCommand(TextManager.options, 'options', enabled);
    }
    if (this.needsCommand('status')) {
        this.addCommand(TextManager.status, 'status', enabled);
    }
};

Window_MenuCommand.prototype.itemWidth = function () {
    return Math.floor((this.width - this.padding * 2 +
        this.spacing()) / this.maxCols());
};
