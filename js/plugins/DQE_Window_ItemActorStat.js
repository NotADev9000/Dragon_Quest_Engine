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
* N/A
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

Window_ItemActorStat.STAT_HP = 0;
Window_ItemActorStat.STAT_MP = 1;

Window_ItemActorStat.prototype = Object.create(Window_Base.prototype);
Window_ItemActorStat.prototype.constructor = Window_ItemActorStat;

Window_ItemActorStat.prototype.initialize = function (x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._stat = -1;
    this._actorIndex = -1;
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

Window_ItemActorStat.prototype.textWidth = function () {
    return this.windowWidth() - (this.standardPadding() + this.extraPadding()) * 2;
};

Window_ItemActorStat.prototype.setCategory = function (category) {
    if (this._actorIndex !== category) {
        this._actorIndex = category;
        this.refresh();
    }
};

Window_ItemActorStat.prototype.setAction = function (action) {
    this.setStat(action);
    this.refresh();
};

Window_ItemActorStat.prototype.setStat = function (action) {
    if (action.isHpRecover()) {
        this._stat = Window_ItemActorStat.STAT_HP;
    } else if (action.isMpRecover()) {
        this._stat = Window_ItemActorStat.STAT_MP;
    }
};

Window_ItemActorStat.prototype.drawStat = function () {
    var text = '';
    var pos = this.extraPadding();
    switch (this._stat) {
        case Window_ItemActorStat.STAT_HP:
            text = 'HP';
            break;
        case Window_ItemActorStat.STAT_MP:
            text = 'MP';
            break;
    }
    this.changeTextColor(this.hpColor($gameParty.battleMembers()[this._actorIndex]));
    this.drawText(text, pos, pos, this.textWidth(), 'center');
};

Window_ItemActorStat.prototype.drawStatValue = function () {
    var actor = $gameParty.battleMembers()[this._actorIndex];
    var text = '';
    switch (this._stat) {
        case Window_ItemActorStat.STAT_HP:
            padHp = actor.hp.toString();
            text = `${padHp}/${actor.mhp}`;
            break;
        case Window_ItemActorStat.STAT_MP:
            padMp = actor.mp.toString();
            text = `${padMp}/${actor.mmp}`;
            break;
        default:
            break;
    }
    var y = 69;
    this.changeTextColor(this.hpColor(actor));
    this.drawText(text, this.extraPadding(), y, this.textWidth(), 'center');
};

Window_ItemActorStat.prototype.show = function () {
    this._stat >= 0 && Window_Base.prototype.show.call(this);
};

Window_ItemActorStat.prototype.hide = function () {
    this._stat = -1;
    Window_Base.prototype.hide.call(this);
};

Window_ItemActorStat.prototype.refresh = function () {
    if (this._stat >= 0) {
        this.contents.clear();
        this.drawStat();
        this.drawHorzLine(0, 51);
        this.drawStatValue();
    }
};
