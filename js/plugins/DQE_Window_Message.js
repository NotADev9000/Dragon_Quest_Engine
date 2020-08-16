//=============================================================================
// Dragon Quest Engine - Window Message
// DQE_Window_Message.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Message window for Dragon Quest Engine - V0.1
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
Imported.DQEng_Window_Message = true;

var DQEng = DQEng || {};
DQEng.Window_Message = DQEng.Window_Message || {};

//-----------------------------------------------------------------------------
// Window
//-----------------------------------------------------------------------------

/**
 * adjust Y position of pause arrow in windows
 * subtracted 9 from Y position
 * 
 * @gameMatch Custom
 */
Window.prototype._refreshPauseSign = function () {
    var sx = 144;
    var sy = 96;
    var p = 24;
    this._windowPauseSignSprite.bitmap = this._windowskin;
    this._windowPauseSignSprite.anchor.x = 0.5;
    this._windowPauseSignSprite.anchor.y = 1;
    this._windowPauseSignSprite.move(this._width / 2, this._height - 9);
    this._windowPauseSignSprite.setFrame(sx, sy, p, p);
    this._windowPauseSignSprite.alpha = 0;
};

//-----------------------------------------------------------------------------
// Window_Message
//-----------------------------------------------------------------------------

/**
 * positions message window: adjusting the Y position to match DQ
 * top & bottom placed windows will be offset by +/-48
 *
 * @gameMatch DQ1+2 SNES
 */
Window_Message.prototype.updatePlacement = function () {
    var tileHeight = $gameMap.tileHeight();
    this._positionType = $gameMessage.positionType();
    var yOffset = this._positionType === 0 ? tileHeight : this._positionType === 2 ? -tileHeight : 0;
    this.y = (this._positionType * (Graphics.boxHeight - this.height) / 2) + yOffset; 
    this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
};

/**
 * Gets the width of the message window
 *
 * @gameMatch DQ11 Sw (2D)
 * @return {Number} width of message window
 */
Window_Message.prototype.windowWidth = function () {
    return 980;
};

/**
 * Gets the line height of the message window
 *
 * @gameMatch Custom
 * @return {Number} line height
 */
Window_Message.prototype.lineHeight = function () {
    return 41;
};

/**
 * Calculates and returns the height of the message window
 * 20 pixels were added to fit the cursor at the bottom of window
 * this somewhat matches DQ1+2 SNES
 *
 * @gameMatch DQ1+2 SNES
 * @return {Number} height of message window
 */
Window_Message.prototype.fittingHeight = function (numLines) {
    return (numLines * this.lineHeight() + this.standardPadding() * 2) + 20;
};

/**
 * Gets the height of each character (in this case is = lineheight)
 *
 * @gameMatch Custom
 * @return {Number} character height
 */
Window_Message.prototype.calcTextHeight = function (textState, all) {
    return this.lineHeight();
};
