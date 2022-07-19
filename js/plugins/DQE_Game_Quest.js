//=============================================================================
// Dragon Quest Engine - Game Quest
// DQE_Game_Quest.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The game object class for a quest - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Game_Quest = true;

var DQEng = DQEng || {};
DQEng.Game_Quest = DQEng.Game_Quest || {};

//-----------------------------------------------------------------------------
// Game_Quest
//-----------------------------------------------------------------------------

function Game_Quest() {
    this.initialize.apply(this, arguments);
}

Game_Quest.prototype.initialize = function (quest) {
    this._id = quest.id;
    // details
    this._stages = this.setupStages(quest.stages);
    // state
    this._currentStage = 0; // which stage is the player currently at within this questline
    this._completed = false;
};

Game_Quest.prototype.setupStages = function (data) {
    const stages = [];

    data.forEach(stage => {
        stages.push(new Game_Quest_Stage(stage));
    });

    return stages;
};

//////////////////////////////
// Functions - getters
//////////////////////////////

Game_Quest.prototype.questId = function () {
    return this._id;
};

Game_Quest.prototype.name = function () {
    return $DQE_dataQuests[this._id].name;
};

Game_Quest.prototype.isComplete = function () {
    return this._completed;
};
