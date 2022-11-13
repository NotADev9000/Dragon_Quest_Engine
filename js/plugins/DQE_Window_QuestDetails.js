//=============================================================================
// Dragon Quest Engine - Window Quest Details
// DQE_Window_QuestDetails.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Details of the selected quest - V0.1
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
Imported.DQEng_Window_QuestDetails = true;

var DQEng = DQEng || {};
DQEng.Window_QuestDetails = DQEng.Window_QuestDetails || {};

//-----------------------------------------------------------------------------
// Window_QuestDetails
//-----------------------------------------------------------------------------

function Window_QuestDetails() {
    this.initialize.apply(this, arguments);
}

Window_QuestDetails.prototype = Object.create(Window_Base.prototype);
Window_QuestDetails.prototype.constructor = Window_QuestDetails;

Window_QuestDetails.prototype.initialize = function (x, y, width) {
    this._quest = {};
    this._stage = 0; // index of stage displayed
    this._latestStage = 0; // index of highest stage player has unlocked
    this._objectivesPage = 0; // page of objectives displayed
    this._objectivesThisStage = 0; // how many objectives for current shown stage
    this._totalObjectivePages = 1;
    this._objectivesPerPage = 2;
    Window_Base.prototype.initialize.call(this, x, y, width, this.windowHeight());
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_QuestDetails.prototype.windowHeight = function () {
    return this._objectivesThisStage > 0 ? 714 : 453;
};

Window_QuestDetails.prototype.lineGap = function () {
    return 9;
};

Window_QuestDetails.prototype.standardPadding = function () {
    return 9;
};

Window_QuestDetails.prototype.extraPadding = function () {
    return 15;
};

/**
 * height of the section the name is displayed in
 */
Window_QuestDetails.prototype.nameBlockHeight = function () {
    return 54;
};

/**
 * maximum height of the description/location section (not including any horizontal rules)
 */
Window_QuestDetails.prototype.descriptionBlockHeight = function () {
    return 381;
};

/**
 * maximum height of the description text
 */
Window_QuestDetails.prototype.descriptionTextHeight = function () {
    return 300;
};

/**
 * height of the section 'objectives' is displayed in
 */
Window_QuestDetails.prototype.objectivesBlockHeight = function () {
    return 57;
};

/**
 * maximum height of an objective text
 */
Window_QuestDetails.prototype.objectiveTextHeight = function () {
    return 90;
};

/**
 * y co-ord of the objectives
 */
Window_QuestDetails.prototype.objectiveStartY = function () {
    return this.nameBlockHeight() + this.descriptionBlockHeight() + this.objectivesBlockHeight() + this.extraPadding();
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_QuestDetails.prototype.setItem = function (quest) {
    if (this._quest !== quest) {
        this._quest = quest;
        this._latestStage = this._stage = quest.currentStage();
        this.refreshObjectives();
        this.refresh();
    }
};

Window_QuestDetails.prototype.totalObjectivePages = function () {
    return Math.ceil(this._objectivesThisStage / this._objectivesPerPage);
};

/**
 * Gets the two objectives currently being displayed
 * 
 * @returns both objectives in an array - the icon for the state of the objective + the objective description
 */
Window_QuestDetails.prototype.getObjectives = function () {
    const startIndex = this._objectivesPage * this._objectivesPerPage; // index of first objective needed
    const endIndex = startIndex + this._objectivesPerPage; // index after last objective needed
    const descriptions = this._quest.stageObjectiveDescriptions(this._stage, startIndex, endIndex);
    const states = this._quest.stageObjectiveStates(this._stage, startIndex, endIndex);
    return this.combineObjectiveDetails(descriptions, states);
};

Window_QuestDetails.prototype.combineObjectiveDetails = function (descriptions, states) {
    const combined = [];
    for (let i = 0; i < descriptions.length; i++) {
        let state = states[i] ? '}' : '{';
        combined.push(`${state} ${descriptions[i]}`);
    }
    return combined;
};

//////////////////////////////
// Functions - stage pages
//////////////////////////////

Window_QuestDetails.prototype.changeStage = function (next) {
    if (this._latestStage > 0) {
        next ? this.goNextStage() : this.goPreviousStage();
        this.refreshObjectives();
        this.refresh();
    }
};

Window_QuestDetails.prototype.goNextStage = function () {
    this._stage++;
    if (this._stage > this._latestStage) {
        this._stage = 0;
    }
};

Window_QuestDetails.prototype.goPreviousStage = function () {
    this._stage--;
    if (this._stage < 0) {
        this._stage = this._latestStage;
    }
};

//////////////////////////////
// Functions - objective pages
//////////////////////////////

Window_QuestDetails.prototype.changeObjective = function (next) {
    if (this._totalObjectivePages > 1) {
        next ? this.goNextObjective() : this.goPreviousObjective();
        this.redrawObjectives();
    }
};

Window_QuestDetails.prototype.goNextObjective = function () {
    this._objectivesPage++;
    if (this._objectivesPage >= this._totalObjectivePages) {
        this._objectivesPage = 0;
    }
};

Window_QuestDetails.prototype.goPreviousObjective = function () {
    this._objectivesPage--;
    if (this._objectivesPage <= -1) {
        this._objectivesPage = this._totalObjectivePages - 1;
    }
};

/**
 * Called whenever the stage is changed (e.g. changing quests, moving stage)
 * Calculates & resets objectives
 * Changes window size depending on number of objectives
 */
Window_QuestDetails.prototype.refreshObjectives = function () {
    this._objectivesPage = 0;
    this._objectivesThisStage = this._quest.stageNumObjectives(this._stage);
    this._totalObjectivePages = this.totalObjectivePages();
    this.height = this.windowHeight();
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_QuestDetails.prototype.drawDetails = function () {
    this.drawName();
    this.drawDescription();
    this.drawLocation();
};

Window_QuestDetails.prototype.drawName = function () {
    const name = this._quest.name();
    const cw = this.contentsWidth();
    const ep = this.extraPadding();
    // icons (switching pages)
    if (this._latestStage > 0) this.drawPageUpDownAtEdges(ep);
    // name
    this.drawText(name, 0, ep, cw, 'center');
    this.drawHorzLine(0, this.nameBlockHeight() - 3);
};

Window_QuestDetails.prototype.drawDescription = function () {
    const description = this._quest.stageDescription(this._stage);
    const ep = this.extraPadding();
    const y = ep + this.nameBlockHeight();
    this.drawTextEx(description, ep, y);
};

Window_QuestDetails.prototype.drawLocation = function () {
    const location = `~${this._quest.stageLocation(this._stage)}`;
    const ep = this.extraPadding();
    const y = ep + this.nameBlockHeight() + this.descriptionTextHeight();
    this.drawTextEx(location, ep, y);
};

Window_QuestDetails.prototype.drawObjectivesSection = function () {
    this.drawObjectivesTitle();
    this.drawObjectives();
};

Window_QuestDetails.prototype.drawObjectivesTitle = function () {
    const text = `Objectives`;
    const ep = this.extraPadding();
    const cw = this.contentsWidth();
    let y = this.nameBlockHeight() + this.descriptionBlockHeight();
    this.drawHorzLine(0, y);
    y += ep + 3;
    // icons (switching pages)
    if (this._totalObjectivePages > 1) this.drawPreviousNextAtEdges(y);
    // title
    this.drawText(text, ep, y, cw, 'center');
    y += ep + this.lineHeight();
    this.drawHorzLine(0, y);
};

Window_QuestDetails.prototype.drawObjectives = function () {
    const objectives = this.getObjectives();
    const ep = this.extraPadding();
    const oth = this.objectiveTextHeight();
    let y = this.objectiveStartY();
    objectives.forEach(objective => {
        this.drawTextEx(objective, ep, y);
        y += oth;
    });
};

/**
 * Redraws the objectives section of the window only
 */
Window_QuestDetails.prototype.redrawObjectives = function () {
    const height = this.objectiveTextHeight() * this._objectivesPerPage;
    this.contents.clearRect(0, this.objectiveStartY(), this.width, height);
    this.drawObjectives();
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_QuestDetails.prototype.refresh = function () {
    this.createContents();
    this.drawDetails();
    if (this._objectivesThisStage > 0) this.drawObjectivesSection();
};
