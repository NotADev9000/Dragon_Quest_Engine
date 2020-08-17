//=============================================================================
// Dragon Quest Engine - Window Choice
// DQE_Window_ChoiceList.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Choice window for Dragon Quest Engine - V0.1
*
* @param Choice Y Offset
* @desc How far should the Y position of the choice window be positioned from the message box. Default: 48.
* @default
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

var parameters = PluginManager.parameters('DQE_Window_ChoiceList');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Window_ChoiceList = {};
DQEng.Parameters.Window_ChoiceList.ChoiceYOffset = Number(parameters["Choice Y Offset"]) || 48;

//-----------------------------------------------------------------------------
// Window_ChoiceList
//-----------------------------------------------------------------------------

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
        this.y = messageY - this.height - DQEng.Parameters.Window_ChoiceList.ChoiceYOffset;
    } else {
        this.y = messageY + this._messageWindow.height + DQEng.Parameters.Window_ChoiceList.ChoiceYOffset;
    }
};