//=============================================================================
// Dragon Quest Engine - Window Item Actor Stat
// DQE_Window_ItemActorStat.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying party members stats in the item menu - V0.1
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
Imported.DQEng_Window_ItemActorStat = true;

var DQEng = DQEng || {};
DQEng.Window_ItemActorStat = DQEng.Window_ItemActorStat || {};

//-----------------------------------------------------------------------------
// Window_ItemActorStat
//-----------------------------------------------------------------------------

function Window_ItemActorStat() {
    this.initialize.apply(this, arguments);
}

Window_ItemActorStat.prototype = Object.create(Window_Base.prototype);
Window_ItemActorStat.prototype.constructor = Window_ItemActorStat;

Window_ItemActorStat.prototype.initialize = function (x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._stat = -1;
};

Window_ItemActorStat.prototype.windowWidth = function () {
    return 264;
};

Window_ItemActorStat.prototype.windowHeight = function () {
    return 123;
};

Window_ItemActorStat.prototype.standardPadding = function () {
    return 9;
};

Window_ItemActorStat.prototype.extraPadding = function () {
    return 15;
};

Window_ItemActorStat.prototype.setStat = function (stat) {
    this._stat = stat;
    this.refresh();
};

Window_ItemActorStat.prototype.drawStat = function () {
    var textWidth = this.windowWidth() - (this.standardPadding() * 2);
    var text = '';
    switch (this._stat) {
        case 0:
            text = 'HP';
            break;
    }
    this.drawText(text, 0, 0, textWidth);
};

Window_ItemActorStat.prototype.drawStatValue = function () {
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
};

Window_ItemActorStat.prototype.refresh = function () {
    this.contents.clear();
    this.drawStat();
    this.drawHorzLine(0, 51);
    this.drawStatValue();
};
