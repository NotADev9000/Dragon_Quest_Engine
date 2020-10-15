//=============================================================================
// Dragon Quest Engine - Window Battle Message
// DQE_Window_BattleMessage.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Battle message window for Dragon Quest Engine - V0.1
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
Imported.DQEng_Window_BattleMessage = true;

var DQEng = DQEng || {};
DQEng.Window_BattleMessage = DQEng.Window_BattleMessage || {};

//-----------------------------------------------------------------------------
// Window_BattleMessage
//-----------------------------------------------------------------------------

function Window_BattleMessage() {
    this.initialize.apply(this, arguments);
}

Window_BattleMessage.prototype = Object.create(Window_Message.prototype);
Window_BattleMessage.prototype.constructor = Window_BattleMessage;

Window_BattleMessage.prototype.lineHeight = function () {
    return 21;
};

Window_BattleMessage.prototype.lineGap = function () {
    return 3;
};

Window_BattleMessage.prototype.standardPadding = function () {
    return 24;
};

Window_BattleMessage.prototype.numVisibleRows = function () {
    return 5;
};

Window_BattleMessage.prototype.fittingHeight = function (numLines) {
    return Window_Base.prototype.fittingHeight.call(this, numLines);
};

Window_BattleMessage.prototype.calcTextHeight = function () {
    return Window_Base.prototype.calcTextHeight.call(this);
};

Window_BattleMessage.prototype.normalColor = function () {
    return this.textColor(0);
};

Window_BattleMessage.prototype.updatePlacement = function () {
    this.y = 540
};

/**
 * Calls processCharacter with added 'true' parameter
 * to autowrap text in the window
 */
Window_BattleMessage.prototype.updateMessage = function () {
    if (this._textState) {
        while (!this.isEndOfText(this._textState)) {
            if (this.needsNewPage(this._textState)) {
                this.newPage(this._textState);
            }
            this.updateShowFast();
            if (!this._showFast && !this._lineShowFast && this._textSpeedCount < this._textSpeed) {
                this._textSpeedCount++;
                break;
            }
            this._textSpeedCount = 0;
            this.processCharacter(this._textState, true);
            if (!this._showFast && !this._lineShowFast && this._textSpeed !== -1) {
                break;
            }
            if (this.pause || this._waitCount > 0) {
                break;
            }
        }
        if (this.isEndOfText(this._textState)) {
            this.onEndOfText();
        }
        return true;
    } else {
        return false;
    }
};
