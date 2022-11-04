//=============================================================================
// Dragon Quest Engine - Window Choice List
// DQE_Window_ChoiceList.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window used for the event command [Show Choices] - V0.1
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
Imported.DQEng_Window_ChoiceList = true;

var DQEng = DQEng || {};
DQEng.Window_ChoiceList = DQEng.Window_ChoiceList || {};

//-----------------------------------------------------------------------------
// Window_ChoiceList
//-----------------------------------------------------------------------------

Window_ChoiceList.ChoiceYOffset = 48; // the gap between this window and the message window

/**
 * Position the window on the screen
 * 0: left - in line with message window
 * 1: middle - in middle of message window
 * 2: right - in line with end of message window
 * 
 * windows Y position is just above/below message window with a gap
 *
 * @gameMatch Custom
 */
Window_ChoiceList.prototype.updatePlacement = function () {
    var positionType = $gameMessage.choicePositionType();
    var messageY = this._messageWindow.y;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    switch (positionType) {
        case 0:
            this.x = this._messageWindow.x;
            break;
        case 1:
            this.x = (Graphics.boxWidth - this.width) / 2;
            break;
        case 2:
            this.x = (this._messageWindow.x + this._messageWindow.width) - this.width;
            break;
    }
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height - Window_ChoiceList.ChoiceYOffset;
    } else {
        this.y = messageY + this._messageWindow.height + Window_ChoiceList.ChoiceYOffset;
    }
};

Window_ChoiceList.prototype.lineGap = function () {
    return 18;
};

Window_ChoiceList.prototype.contentsHeight = function () {
    return this.height - this.standardPadding() * 2;
};

Window_ChoiceList.prototype.open = function () {
    SoundManager.playChoice();
    Window_Base.prototype.open.call(this);
};

Window_ChoiceList.prototype.updateOpen = function () {
    if (this._opening) {
        this.openness += 32;
        if (this.isOpen()) {
            this._opening = false;
        }
    }
};

DQEng.Window_ChoiceList.drawTextEx = Window_ChoiceList.prototype.drawTextEx;
Window_ChoiceList.prototype.drawTextEx = function (text, x, y) {
    return DQEng.Window_ChoiceList.drawTextEx.call(this, text, x, y, false, false);
};