//=============================================================================
// Dragon Quest Engine - Window Battle Actor
// DQE_Window_BattleActor.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for selecting a party member in battle - V0.1
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
Imported.DQEng_Window_BattleActor = true;

var DQEng = DQEng || {};
DQEng.Window_BattleActor = DQEng.Window_BattleActor || {};

//-----------------------------------------------------------------------------
// Window_BattleActor
//-----------------------------------------------------------------------------

function Window_BattleActor() {
    this.initialize.apply(this, arguments);
}

Window_BattleActor.prototype = Object.create(Window_Selectable.prototype);
Window_BattleActor.prototype.constructor = Window_BattleActor;

Window_BattleActor.prototype.initialize = function (x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.hide();
};

Window_BattleActor.prototype.windowWidth = function () {
    return 354;
};

Window_BattleActor.prototype.windowHeight = function () {
    return this.fittingHeight(this.numVisibleRows());
};

Window_BattleActor.prototype.numVisibleRows = function () {
    return this.maxItems();
};

Window_BattleActor.prototype.maxItems = function () {
    return Math.min($gameParty.battleMembers().length, 4);
};

Window_BattleActor.prototype.show = function () {
    this.select(0);
    Window_Selectable.prototype.show.call(this);
};

Window_BattleActor.prototype.hide = function () {
    Window_Selectable.prototype.hide.call(this);
};

Window_BattleActor.prototype.select = function (index) {
    Window_Selectable.prototype.select.call(this, index);
};

Window_BattleActor.prototype.drawItem = function (index) {
    var actor = $gameParty.battleMembers()[index];
    var rect = this.itemRectForText(index);
    this.drawText(actor._name, rect.x, rect.y, rect.width);
};
