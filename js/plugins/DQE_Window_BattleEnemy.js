//=============================================================================
// Dragon Quest Engine - Window Battle Enemy
// DQE_Window_BattleEnemy.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window that displays party member status in battle - V0.1
*
*
* @help
* @Param _groups:
* name {String} - the name of the group displayed in battle
* enemies {Array} - an array of Game_Enemy objects containing all enemies in the group
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_BattleEnemy = true;

var DQEng = DQEng || {};
DQEng.Window_BattleEnemy = DQEng.Window_BattleEnemy || {};

//-----------------------------------------------------------------------------
// Window_BattleEnemy
//-----------------------------------------------------------------------------

DQEng.Window_BattleEnemy.initialize = Window_BattleEnemy.prototype.initialize;
Window_BattleEnemy.prototype.initialize = function (x, y) {
    this._groups = [];
    DQEng.Window_BattleEnemy.initialize.call(this, x, y);
}

Window_BattleEnemy.prototype.windowWidth = function () {
    return 744;
};

Window_BattleEnemy.prototype.standardPadding = function () {
    return 24;
};

Window_BattleEnemy.prototype.lineGap = function () {
    return 15;
};

Window_BattleEnemy.prototype.maxCols = function () {
    return 1;
};

Window_BattleEnemy.prototype.maxItems = function () {
    return this._groups.length;
};

Window_BattleEnemy.prototype.drawItem = function (index) {
    this.resetTextColor();
    var group = this._groups[index];
    var name = group.name;
    var amount = group.enemies.length;
    var rect = this.itemRectForText(index);
    this.drawText(name, rect.x, rect.y, rect.width);
    this.drawText(amount, 672, rect.y, 16);
};

Window_BattleEnemy.prototype.show = function () {
    this.refresh();
    Window_Selectable.prototype.show.call(this);
};

Window_BattleEnemy.prototype.refresh = function () {
    this._enemies = $gameTroop.aliveMembers();
    this._groups = $gameTroop.aliveAllGroups();
    Window_Selectable.prototype.refresh.call(this);
};
