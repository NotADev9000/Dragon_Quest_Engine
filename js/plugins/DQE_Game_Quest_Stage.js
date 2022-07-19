//=============================================================================
// Dragon Stage Engine - Game Quest Stage
// DQE_Game_Quest_Stage.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The game object class for a stage of a quest. Contains where the objectives state is tracked - V0.1
*
* @help
* _objectives stores the state for whether an objective has been completed. 0 = not finished, 1 = finished.
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Game_Quest_Stage = true;

var DQEng = DQEng || {};
DQEng.Game_Quest_Stage = DQEng.Game_Quest_Stage || {};

//-----------------------------------------------------------------------------
// Game_Quest_Stage
//-----------------------------------------------------------------------------

function Game_Quest_Stage() {
    this.initialize.apply(this, arguments);
}

Game_Quest_Stage.prototype.initialize = function (stage) {
    this._objectives = this.setupObjectives(stage.objectives.length);
};

Game_Quest_Stage.prototype.setupObjectives = function (numObjectives) {
    const objectives = [];

    for (let i = 0; i < numObjectives; i++) {
        objectives.push(0);
    }

    return objectives;
};