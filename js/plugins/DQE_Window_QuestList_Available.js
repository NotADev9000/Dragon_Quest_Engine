//=============================================================================
// Dragon Quest Engine - Window Quest List Available
// DQE_Window_QuestList_Available.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Lists the available quests (those unlocked but yet to be activated) - V0.1
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
Imported.DQEng_Window_QuestList_Available = true;

var DQEng = DQEng || {};
DQEng.Window_QuestList_Available = DQEng.Window_QuestList_Available || {};

//-----------------------------------------------------------------------------
// Window_QuestList_Available
//-----------------------------------------------------------------------------

function Window_QuestList_Available() {
    this.initialize.apply(this, arguments);
}

Window_QuestList_Available.prototype = Object.create(Window_QuestList.prototype);
Window_QuestList_Available.prototype.constructor = Window_QuestList_Available;

Window_QuestList_Available.prototype.initialize = function (x, y, width, height) {
    Window_QuestList.prototype.initialize.call(this, x, y, width, height, false, 'No available Quests!');
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_QuestList_Available.prototype.item = function (index = this.index()) {
    return $DQE_dataQuests[this._data[index]];
};

Window_QuestList_Available.prototype.makeItemList = function () {
    this._data = $gameParty.availableQuests().filter(n => Number.isInteger(n));
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

Window_QuestList_Available.prototype.updateHelp = function () {
    const quest = this.item();
    if (quest) {
        this._helpWindow[0].setItem(quest.name, quest.locator);
        this.showAllHelpWindows();
    } else {
        // if no quests, hide details window
        this.hideAllHelpWindows();
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_QuestList_Available.prototype.drawItem = function (index) {
    const name = this.item(index).name;
    if (name) {
        const rect = this.itemRectForText(index);
        // truncate name if too long for window
        if (name.length > 21) {
            name = name.slice(0, 21);
            name += '$';
        }
        this.drawText(name, rect.x, rect.y);
    }
};
