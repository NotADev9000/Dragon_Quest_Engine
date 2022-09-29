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

// Reward types
Game_Quest.REWARDS_GOLD = 'gold';
Game_Quest.REWARDS_ITEM = 'item';
Game_Quest.REWARDS_WEAPON = 'weapon';
Game_Quest.REWARDS_ARMOR = 'armor';
Game_Quest.REWARDS_MISC = 'misc';

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

Game_Quest.prototype.stages = function () {
    return this._stages;
};

Game_Quest.prototype.numStages = function () {
    return this._stages.length;
};

Game_Quest.prototype.stage = function (stageNum) {
    return $DQE_dataQuests[this._id].stages[stageNum];
};

Game_Quest.prototype.stageDescription = function (stageNum) {
    return this.stage(stageNum).description;
};

Game_Quest.prototype.stageLocation = function (stageNum) {
    return this.stage(stageNum).location;
};

Game_Quest.prototype.stageAllObjectives = function (stageNum) {
    return this.stage(stageNum).objectives;
};

Game_Quest.prototype.stageObjectiveDescriptions = function (stageNum, startIndex, endIndex) {
    const selectedObjs = this.stageAllObjectives(stageNum).slice(startIndex, endIndex);
    const objectives = [];
    selectedObjs.forEach(obj => objectives.push(obj.description));
    return objectives;
};

Game_Quest.prototype.stageAllObjectiveStates = function (stageNum) {
    return this._stages[stageNum].objectives();
};

Game_Quest.prototype.stageObjectiveStates = function (stageNum, startIndex, endIndex) {
    return this.stageAllObjectiveStates(stageNum).slice(startIndex, endIndex);
};

/**
 * Number of objectives for a stage
 */
Game_Quest.prototype.stageNumObjectives = function (stageNum) {
    return this.stageAllObjectiveStates(stageNum).length;
};

Game_Quest.prototype.currentStage = function () {
    return this._currentStage;
};

Game_Quest.prototype.rewards = function () {
    return $DQE_dataQuests[this._id].rewards;
};

Game_Quest.prototype.isComplete = function () {
    return this._completed;
};

//////////////////////////////
// Functions - setters
//////////////////////////////

Game_Quest.prototype.setCurrentStage = function (stage) {
    const numStages = this.numStages();
    // limit to last stage
    if (stage >= numStages) stage = numStages; 
    return this._currentStage = stage;
};

Game_Quest.prototype.nextStage = function () {
    this.setCurrentStage(this._currentStage+1);
};
