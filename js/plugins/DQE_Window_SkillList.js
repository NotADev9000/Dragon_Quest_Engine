//=============================================================================
// Dragon Quest Engine - Window Skill List
// DQE_Window_SkillList.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying skills - V0.1
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
Imported.DQEng_Window_SkillList = true;

var DQEng = DQEng || {};
DQEng.Window_SkillList = DQEng.Window_SkillList || {};

//-----------------------------------------------------------------------------
// Window_SkillList
//-----------------------------------------------------------------------------

Window_SkillList.prototype = Object.create(Window_ItemListBase.prototype);

Window_SkillList.prototype.initialize = function (x, y, width, height) {
    Window_ItemListBase.prototype.initialize.call(this, x, y, width, height);
};

Window_SkillList.prototype.includes = function (item, actor) {
    return actor.isOccasionOk(item);
};

Window_SkillList.prototype.makeItemList = function () {
        var actor = $gameParty.members()[this._category];
        this._data = actor.skills().filter(function (item) {
            return this.includes(item, actor);
        }, this);
};

/**
 * Draws item to window
 * Number of items is only drawn when viewing party inventory
 */
Window_SkillList.prototype.drawItem = function (index) {
    var item = this._data[index];
    if (item) {
        var rect = this.itemRectForText(index);
        var width = this.contentsWidth() - (this.extraPadding() * 2);
        this.drawText(item.name, rect.x, rect.y, width);
    }
};
