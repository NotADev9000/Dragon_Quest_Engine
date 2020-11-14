//=============================================================================
// Dragon Quest Engine - Window Battle Actor Stat
// DQE_Window_BattleActorStat.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying party members stats in battle - V0.1
*
*
* @help
* _stat:
* 0 = hp
* 1 = mp
* 
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_BattleActorStat = true;

var DQEng = DQEng || {};
DQEng.Window_BattleActorStat = DQEng.Window_BattleActorStat || {};

//-----------------------------------------------------------------------------
// Window_BattleActorStat
//-----------------------------------------------------------------------------

function Window_BattleActorStat() {
    this.initialize.apply(this, arguments);
}

Window_BattleActorStat.prototype = Object.create(Window_Base.prototype);
Window_BattleActorStat.prototype.constructor = Window_BattleActorStat;

Window_BattleActorStat.prototype.initialize = function (x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._stat = -1;
};

Window_BattleActorStat.prototype.windowWidth = function () {
    return 297;
};

Window_BattleActorStat.prototype.windowHeight = function () {
    return this.fittingHeight(this.numVisibleRows());
};

Window_BattleActorStat.prototype.standardPadding = function () {
    return 24;
};

Window_BattleActorStat.prototype.lineGap = function () {
    return 15;
};

Window_BattleActorStat.prototype.numVisibleRows = function () {
    return this.maxItems();
};

Window_BattleActorStat.prototype.maxItems = function () {
    return Math.min($gameParty.battleMembers().length, 4);
};

Window_BattleActorStat.prototype.setStat = function (stat) {
    this._stat = stat;
    this.refresh();
};

Window_BattleActorStat.prototype.drawStats = function () {
    for (let index = 0; index < this.maxItems(); index++) {
        var actor = $gameParty.battleMembers()[index];
        var text = '';
        switch (this._stat) {
            case 0:
                padHp = actor.hp.toString().padStart(3, ' ');
                text = `HP: ${padHp}/${actor.mhp}`;
                break;
            case 1:
                padMp = actor.mp.toString().padStart(3, ' ');
                text = `MP: ${padMp}/${actor.mmp}`;
                break;
            default:
                break;
        }
        var textWidth = this.windowWidth() - (this.standardPadding() * 2);
        var y = index * (this.lineHeight() + this.lineGap());
        this.drawText(text, 0, y, textWidth);
    }
};

Window_BattleActorStat.prototype.refresh = function () {
    this.contents.clear();
    this.drawStats();
};
