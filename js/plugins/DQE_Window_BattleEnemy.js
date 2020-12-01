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

Window_BattleEnemy.STATE_GROUP  = 1;
Window_BattleEnemy.STATE_SINGLE = 2;

DQEng.Window_BattleEnemy.initialize = Window_BattleEnemy.prototype.initialize;
Window_BattleEnemy.prototype.initialize = function (x, y) {
    this._state = Window_BattleEnemy.STATE_GROUP;
    this._groups = [];
    DQEng.Window_BattleEnemy.initialize.call(this, x, y);
}

Window_BattleEnemy.prototype.windowWidth = function () {
    return 840;
};

Window_BattleEnemy.prototype.standardPadding = function () {
    return 24;
};

Window_BattleEnemy.prototype.lineGap = function () {
    return 15;
};

Window_BattleEnemy.prototype.maxCols = function () {
    switch (this._state) {
        case 2:
            return 2;
        default:
            return 1;
    }
};

Window_BattleEnemy.prototype.maxItems = function () {
    switch (this._state) {
        case 2:
            return this._enemies.length;
        default:
            return this._groups.length;
    }
};

Window_BattleEnemy.prototype.group = function () {
    return this._groups[this.index()];
};

Window_BattleEnemy.prototype.enemiesInGroup = function () {
    var group = this.group();
    return group ? group.enemies : undefined;
};

Window_BattleEnemy.prototype.groupIndex = function () {
    return this._groups[this.index()].troopIndex;
};

Window_BattleEnemy.prototype.drawItem = function (index) {
    this.resetTextColor();
    var rect = this.itemRectForText(index);
    switch (this._state) {
        case 2:
            var name = this._enemies[index].name();
            this.drawText(name, rect.x, rect.y, rect.width);
            break;
        default:
            var group = this._groups[index];
            var name = group.name;
            var amount = group.enemies.length;
            this.drawText(name, rect.x, rect.y, rect.width);
            this.drawText(amount, this.windowWidth()-72, rect.y, 16);
            break;
    }
};

Window_BattleEnemy.prototype.setState = function (state) {
    this._state = state;
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

Window_BattleEnemy.prototype.select = function (index) {
    Window_Selectable.prototype.select.call(this, index);
    var enemies = this._state === Window_BattleEnemy.STATE_GROUP ? this.enemiesInGroup() : [this.enemy()];
    $gameTroop.select(enemies);
};
