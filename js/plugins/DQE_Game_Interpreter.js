//=============================================================================
// Dragon Quest Engine - Game Interpreter
// DQE_Game_Interpreter.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The game object class for the Interpreter - V0.1
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
Imported.DQEng_Game_Interpreter = true;

var DQEng = DQEng || {};
DQEng.Game_Interpreter = DQEng.Game_Interpreter || {};

//-----------------------------------------------------------------------------
// Game_Interpreter
//-----------------------------------------------------------------------------

Game_Interpreter.FORCEDCHARACTER = null;

// Set Movement Route
Game_Interpreter.prototype.command205 = function () {
    $gameMap.refreshIfNeeded();
    this._character = Game_Interpreter.FORCEDCHARACTER || this.character(this._params[0]);
    if (this._character) {
        this._character.forceMoveRoute(this._params[1]);
        var eventInfo = JsonEx.makeDeepCopy(this._eventInfo);
        eventInfo.line = this._index + 1;
        this._character.setCallerEventInfo(eventInfo);
        if (this._params[1].wait) {
            this.setWaitMode('route');
        }
    }
    Game_Interpreter.FORCEDCHARACTER = null;
    return true;
};
