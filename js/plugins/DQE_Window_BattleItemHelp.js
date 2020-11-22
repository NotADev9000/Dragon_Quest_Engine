//=============================================================================
// Dragon Quest Engine - Window Battle Item Help
// DQE_Window_BattleItemHelp.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying the skill description/cost - V0.1
*
*
* @help
* _useage:
* 0: unlimited uses
* 1: consumed upon use
* 
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_BattleItemHelp = true;

var DQEng = DQEng || {};
DQEng.Window_BattleItemHelp = DQEng.Window_BattleItemHelp || {};

//-----------------------------------------------------------------------------
// Window_BattleItemHelp
//-----------------------------------------------------------------------------

function Window_BattleItemHelp() {
    this.initialize.apply(this, arguments);
}

Window_BattleItemHelp.prototype = Object.create(Window_BattleHelp.prototype);
Window_BattleItemHelp.prototype.constructor = Window_BattleSkillHelp;

Window_BattleItemHelp.prototype.initialize = function (x, y, width, numLines = 3, titleBlock = true) {
    Window_BattleHelp.prototype.initialize.call(this, x, y, width, numLines, titleBlock);
    this._useage = 0;
};

Window_BattleItemHelp.prototype.setText = function (desc, useage) {
    if (this._text !== desc || this._useage !== useage) {
        this._text = desc;
        this._useage = useage;
        this.refresh();
    }
};

Window_BattleItemHelp.prototype.setItem = function (item) {
    var desc = item ? item.description : '';
    var useage = item.consumable ? 1: 0;

    this.setText(desc, useage);
};

/**
 * Draws the bottom section of the window to useage
 */
Window_BattleItemHelp.prototype.drawTitleBlock = function () {
    var blockY = this.height - this.titleBlockHeight() - (this.padding + this.extraPadding()) + 6;
    var textWidth = this.width - (this.standardPadding() + this.extraPadding()) * 2;
    var text = '';
    switch (this._useage) {
        case 1:
            text = 'Consumed upon use';
            break;
        default:
            text = 'Unlimited uses';
            break;
    }

    this.drawHorzLine(0, blockY);
    blockY += 15;
    this.drawText(text, this.extraPadding(), blockY, textWidth, 'center');
};
