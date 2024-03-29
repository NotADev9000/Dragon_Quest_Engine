//=============================================================================
// Dragon Quest Engine - Window Quest List
// DQE_Window_QuestList.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Lists the active quests - V0.1
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
Imported.DQEng_Window_QuestList = true;

var DQEng = DQEng || {};
DQEng.Window_QuestList = DQEng.Window_QuestList || {};

//-----------------------------------------------------------------------------
// Window_QuestList
//-----------------------------------------------------------------------------

function Window_QuestList() {
    this.initialize.apply(this, arguments);
}

Window_QuestList.prototype = Object.create(Window_Pagination.prototype);
Window_QuestList.prototype.constructor = Window_QuestList;

Window_QuestList.prototype.initialize = function (x, y, width, height, activate = true, noData = 'No active Quests!') {
    this._data = [];
    this._noData = noData;
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.select(0);
    if (activate) this.activate();
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_QuestList.prototype.item = function () {
    return this._data[this.index()];
};

Window_QuestList.prototype.maxItems = function () {
    return this._data.length;
};

Window_QuestList.prototype.makeItemList = function () {
    // use Boolean constructor to filter out falsey values: https://stackoverflow.com/questions/28607451/removing-undefined-values-from-array
    this._data = $gameParty.quests().filter(Boolean);
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

Window_QuestList.prototype.updateHelp = function () {
    const quest = this.item();
    if (quest) {
        this.setHelpWindowItem(quest);
        this.showAllHelpWindows();
    } else {
        // if no quests, hide details/rewards window
        this.hideAllHelpWindows();
    }
};

Window_QuestList.prototype.updateSingleHelp = function () {
    this.updateHelp();
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_QuestList.prototype.drawAllItems = function () {
    if (!this.maxItems()) { // no active quests
        this.drawText(this._noData, 0, this.extraPadding(), this.contentsWidth(), 'center');
    } else {
        Window_Pagination.prototype.drawAllItems.call(this);
    }
};

Window_QuestList.prototype.drawItem = function (index) {
    const quest = this._data[index];
    if (quest) {
        const rect = this.itemRectForText(index);
        // tick and complete color
        if (quest.isComplete()) {
            this.changeTextColor(this.completeSkillSetColor());
            this.drawText('^', rect.x, rect.y, rect.width, 'right');
        }
        let name = quest.name();
        // truncate name if too long for window
        if (name.length > 21) {
            name = name.slice(0 ,21);
            name += '$';
        }
        this.drawText(name, rect.x, rect.y);
        this.resetTextColor();
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_QuestList.prototype.refresh = function () {
    this.makeItemList();
    this.createContents();
    Window_Pagination.prototype.refresh.call(this);
    this.drawAllItems();
};
