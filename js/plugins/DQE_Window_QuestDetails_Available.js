//=============================================================================
// Dragon Quest Engine - Window Quest Details Available
// DQE_Window_QuestDetails_Available_Available.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Details of the selected available quest - V0.1
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
Imported.DQEng_Window_QuestDetails_Available = true;

var DQEng = DQEng || {};
DQEng.Window_QuestDetails_Available = DQEng.Window_QuestDetails_Available || {};

//-----------------------------------------------------------------------------
// Window_QuestDetails_Available
//-----------------------------------------------------------------------------

function Window_QuestDetails_Available() {
    this.initialize.apply(this, arguments);
}

Window_QuestDetails_Available.prototype = Object.create(Window_Base.prototype);
Window_QuestDetails_Available.prototype.constructor = Window_QuestDetails_Available;

Window_QuestDetails_Available.prototype.initialize = function (x, y, width) {
    this._name = '';
    this._details = {};
    Window_Base.prototype.initialize.call(this, x, y, width, this.windowHeight());
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_QuestDetails_Available.prototype.windowHeight = function () {
    return 453;
};

Window_QuestDetails_Available.prototype.lineGap = function () {
    return 9;
};

Window_QuestDetails_Available.prototype.standardPadding = function () {
    return 9;
};

Window_QuestDetails_Available.prototype.extraPadding = function () {
    return 15;
};

/**
 * height of the section the name is displayed in
 */
Window_QuestDetails_Available.prototype.nameBlockHeight = function () {
    return 54;
};

/**
 * maximum height of the description/location section (not including any horizontal rules)
 */
Window_QuestDetails_Available.prototype.descriptionBlockHeight = function () {
    return 381;
};

/**
 * maximum height of the description text
 */
Window_QuestDetails_Available.prototype.descriptionTextHeight = function () {
    return 300;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_QuestDetails_Available.prototype.setItem = function (name, details) {
    if (this._name !== name) {
        this._name = name;
        this._details = details;
        this.refresh();
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_QuestDetails_Available.prototype.drawDetails = function () {
    this.drawName();
    this.drawDescription();
    this.drawLocation();
};

Window_QuestDetails_Available.prototype.drawName = function () {
    this.drawText(this._name, 0, this.extraPadding(), this.contentsWidth(), 'center');
    this.drawHorzLine(0, this.nameBlockHeight() - 3);
};

Window_QuestDetails_Available.prototype.drawDescription = function () {
    const description = this._details.description;
    const ep = this.extraPadding();
    const y = ep + this.nameBlockHeight();
    this.drawTextEx(description, ep, y);
};

Window_QuestDetails_Available.prototype.drawLocation = function () {
    const location = `~${this._details.location}`;
    const ep = this.extraPadding();
    const y = ep + this.nameBlockHeight() + this.descriptionTextHeight();
    this.drawTextEx(location, ep, y);
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_QuestDetails_Available.prototype.refresh = function () {
    this.createContents();
    this.drawDetails();
};
