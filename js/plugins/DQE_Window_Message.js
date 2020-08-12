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
    var yOffset = this._positionType === 0 ? tileHeight : this._positionType === 2 ? -tileHeight : 0;
    this._positionType = $gameMessage.positionType();
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
