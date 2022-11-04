//=============================================================================
// Dragon Quest Engine - Window Ailments & Buffs
// DQE_Window_AilmentsBuffs.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window breaking down a battlers ailments & buffs - V0.1
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
Imported.DQEng_Window_AilmentsBuffs = true;

var DQEng = DQEng || {};
DQEng.Window_AilmentsBuffs = DQEng.Window_AilmentsBuffs || {};

//-----------------------------------------------------------------------------
// Window_AilmentsBuffs
//-----------------------------------------------------------------------------

function Window_AilmentsBuffs() {
    this.initialize.apply(this, arguments);
}

Window_AilmentsBuffs.prototype = Object.create(Window_Selectable.prototype);
Window_AilmentsBuffs.prototype.constructor = Window_AilmentsBuffs;

Window_AilmentsBuffs.prototype.initialize = function (x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.updateData();
    this._category = -1;
    this._battler = null;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_AilmentsBuffs.prototype.standardPadding = function () {
    return 9;
};

Window_AilmentsBuffs.prototype.extraPadding = function () {
    return 15;
};

Window_AilmentsBuffs.prototype.itemHeight = function () {
    return this.lineHeight() + this.lineGap();
};

Window_AilmentsBuffs.prototype.itemWidth = function () {
    return 528;
};

Window_AilmentsBuffs.prototype.spacing = function () {
    return 24;
};

Window_AilmentsBuffs.prototype.titleBlockHeight = function () {
    return 108;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_AilmentsBuffs.prototype.battlerData = function () {
    return BattleManager.allMembers();
};

Window_AilmentsBuffs.prototype.updateData = function () {
    this._data = this.battlerData();
};

// called when line-up is changed in battle
Window_AilmentsBuffs.prototype.updateBattler = function () {
    this._battler = this._data[0];
};

Window_AilmentsBuffs.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._battler = this._data[this._category];
    }
    this.refresh();
};

Window_AilmentsBuffs.prototype.nextBattler = function (forward) {
    let nextCat = this._category;
    if (forward) { // next battler
        if (nextCat >= (this._data.length - 1)) {
            nextCat = 0;
        } else {
            nextCat++;
        }
    } else { // previous battler
        if (nextCat <= 0) {
            nextCat = this._data.length - 1;
        } else {
            nextCat--;
        }
    }
    this.setCategory(nextCat); 
};

Window_AilmentsBuffs.prototype.updateCursor = function () {
    // don't show cursor
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_AilmentsBuffs.prototype.drawNameTitle = function () {
    let text = 'Buffs and Ailments';
    let rightIconX = this.contentsWidth() - Window_Base._iconWidth - this.textWidth(' ');
    let y = this.extraPadding();
    let itemHeight = this.itemHeight();
    this.drawText(text, 0, y, this.contentsWidth(), 'center');
    y += itemHeight;
    this.drawHorzLine(0, y);
    y += this.lineGap() + 3;
    // icons (switching battler)
    let icon = this.getHandlerIcon('previous');
    this.drawTextEx(` \\i[${icon}]`, 0, y);
    icon = this.getHandlerIcon('next');
    this.drawTextEx(`\\i[${icon}] `, rightIconX, y);
    // battler name
    text = this._battler.name();
    this.drawText(text, 0, y, this.contentsWidth(), 'center');
    // horizontal rule
    y += itemHeight;
    this.drawHorzLine(0, y);
};

Window_AilmentsBuffs.prototype.drawAilmentsBuffs = function () {
    let ep = this.extraPadding();
    let tbh = this.titleBlockHeight();
    let yZero = ep + tbh; // top row of items Y position
    let x;
    let y;
    let itemHeight = this.itemHeight();
    let itemWidth = this.itemWidth();
    let itemSpacing = this.spacing();
    let itemDiff = itemWidth + itemSpacing; // x position difference of 1st & 2nd column
    let battler = this._battler;
    let numBuffs = battler.buffLength(); // how many buffs in the game NOT how many buffs battler has
    let text, value;
    // buffs
    for (var i = 0; i < numBuffs; i++) {
        x = ep + (itemDiff * (i%2));
        y = yZero + (itemHeight * Math.floor(i/2));

        value = battler.buff(i);
        this.changeTextColor(this.paramchangeTextColor(value));
        text = TextManager.paramFromBuffID(i);
        this.drawText(text, x, y); // param name

        if (value >= 0) value = `+${value}`;
        this.drawText(value, x, y, itemWidth, 'right'); // buff value
        this.resetTextColor();
    }
    // ailments
    battler.states().forEach(state => {
        if (state.priority > 0) {
            x = ep + (itemDiff * (i % 2));
            y = yZero + (itemHeight * Math.floor(i / 2));
            
            this.changeTextColor(this.textColor(state.meta.color));
            this.drawText(state.name, x, y);
            this.resetTextColor();
            i++;
        }
    });
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_AilmentsBuffs.prototype.refresh = function () {
    if (this._battler) {
        this.contents.clear();
        this.drawNameTitle();
        this.drawAilmentsBuffs();
    }
};
