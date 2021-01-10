//=============================================================================
// Dragon Quest Engine - Window Stats Attributes
// DQE_Window_StatsAttributes.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window breaking down an actors' attributes - V0.1
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
Imported.DQEng_Window_StatsAttributes = true;

var DQEng = DQEng || {};
DQEng.Window_StatsAttributes = DQEng.Window_StatsAttributes || {};

//-----------------------------------------------------------------------------
// Window_StatsAttributes
//-----------------------------------------------------------------------------

function Window_StatsAttributes() {
    this.initialize.apply(this, arguments);
}

Window_StatsAttributes.StatBase = 'Base';
Window_StatsAttributes.StatOther = 'Other';
Window_StatsAttributes.StatEquips = 'Equips';
Window_StatsAttributes.StatTotal = 'Total';

Window_StatsAttributes.prototype = Object.create(Window_Selectable.prototype);
Window_StatsAttributes.prototype.constructor = Window_StatsAttributes;

Window_StatsAttributes.prototype.initialize = function (x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._category = -1;
    this._actor = null;
    this._stats = [
                    Window_StatsAttributes.StatBase, 
                    Window_StatsAttributes.StatOther, 
                    Window_StatsAttributes.StatEquips, 
                    Window_StatsAttributes.StatTotal
                ];
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_StatsAttributes.prototype.standardPadding = function () {
    return 9;
};

Window_StatsAttributes.prototype.extraPadding = function () {
    return 15;
};

Window_StatsAttributes.prototype.lineGap = function () {
    return 15;
};

Window_StatsAttributes.prototype.itemHeight = function () {
    return this.lineHeight() + this.lineGap();
};

Window_StatsAttributes.prototype.titleBlockHeight = function () {
    return 108;
};

/**
 * width includes the 3 pixels for the vertical line
 */
Window_StatsAttributes.prototype.statBlockWidth = function () {
    return 177;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_StatsAttributes.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = $gameParty.members()[this._category];
        this.refresh();
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_StatsAttributes.prototype.drawNameTitle = function () {
    let actorName = this._actor.name();
    let actorLv = this._actor.level;
    let text = `${actorName} Lv.${actorLv}`;
    let itemHeight = this.itemHeight();
    let y = this.extraPadding();
    this.drawText(text, 0, y, this.contentsWidth(), 'center');
    y += itemHeight;
    this.drawHorzLine(0, y);
    y += this.lineGap() + 3;
    this.drawText('Attributes', 0, y, this.contentsWidth(), 'center');
    y += itemHeight;
    this.drawHorzLine(0, y);
};

Window_StatsAttributes.prototype.drawAttributeBlock = function () {
    let y = this.titleBlockHeight() + 51;
    this.drawHorzLine(0, y);
    y += this.lineGap() + 3;
    let text;
    for (let i = 0; i < 11; i++) {
        if (i < 9) {
            text = `${TextManager.param(i)}:`;
        } else {
            let id = i - 7;
            text = `${TextManager.terms.baseParams[id]}:`;
        }
        this.drawText(text, this.extraPadding(), y);
        y += this.itemHeight();
    }
};

Window_StatsAttributes.prototype.drawStats = function () {
    let x = this.contentsWidth() - this.statBlockWidth();
    let y = this.titleBlockHeight();
    let valueWidth = this.statBlockWidth() - 3 - this.extraPadding(); // text width of stat value
    for (let i = 0; i < this._stats.length; i++) {
        let stat = this._stats[i];
        let values;
        // draw the vertical line & stat title
        this.drawVertLine(x, y);
        y += this.lineGap();
        this.drawText(stat, x + 3, y, this.statBlockWidth() - 3, 'center');
        // get/draw stat values
        y += this.itemHeight() + 3 + this.lineGap();
        switch (stat) {
            case Window_StatsAttributes.StatBase:
                values = this.getBaseStats();
                break;
            case Window_StatsAttributes.StatOther:
                values = this.getOtherStats();
                break;
            case Window_StatsAttributes.StatEquips:
                values = this.getEquipsStats();
                break;
            case Window_StatsAttributes.StatTotal:
                values = this.getTotalStats();
                break;
        }
        for (let j = 0; j < 11; j++) {
            this.drawText(values[j], x + 3, y, valueWidth, 'right');
            y += this.itemHeight();
        }
        // reset position to top of stat blocks
        // move x position to the left so next block can be drawn
        y = this.titleBlockHeight();
        x -= this.statBlockWidth();
    }
};

Window_StatsAttributes.prototype.getBaseStats = function () {
    let stats = [];
    for (let i = 0; i < 11; i++) {
        if (i < 9) {
            stats.push(this._actor.paramBase(i));
        } else {
            stats.push(this._actor.paramBase(i - 7));
        }
    }
    return stats;
};

Window_StatsAttributes.prototype.getOtherStats = function () {
    let stats = [];
    for (let i = 0; i < 11; i++) {
        if (i === 2 || i === 3) {
            stats.push('-');
        } else if (i < 9) {
            stats.push(Game_Battler.prototype.paramPlus.call(this._actor, i) || '-');
        } else {
            stats.push(Game_Battler.prototype.paramPlus.call(this._actor, i - 7) || '-');
        }
    }
    return stats;
};

Window_StatsAttributes.prototype.getEquipsStats = function () {
    let stats = [];
    for (let i = 0; i < 11; i++) {
        if (i < 9) {
            stats.push(this._actor.paramEquips(i) || '-');
        } else {
            stats.push('-');
        }
    }
    return stats;
};

Window_StatsAttributes.prototype.getTotalStats = function () {
    let stats = [];
    for (let i = 0; i < 11; i++) {
        if (i < 9) {
            stats.push(this._actor.param(i));
        } else {
            stats.push(this._actor.paramBasePermPlus(i - 7));
        }
    }
    return stats;
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_StatsAttributes.prototype.refresh = function () {
    if (this._actor) {
        this.contents.clear();
        this.drawNameTitle();
        this.drawAttributeBlock();
        this.drawStats();
    }
};