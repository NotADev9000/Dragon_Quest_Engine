//=============================================================================
// Dragon Quest Engine - Window Stats Level Up
// DQE_Window_Stats_LevelUp_LevelUp.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window displaying change in actors stats on level up - V0.1
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
Imported.DQEng_Window_Stats_LevelUp = true;

var DQEng = DQEng || {};
DQEng.Window_Stats_LevelUp = DQEng.Window_Stats_LevelUp || {};

//-----------------------------------------------------------------------------
// Window_Stats_LevelUp
//-----------------------------------------------------------------------------

function Window_Stats_LevelUp() {
    this.initialize.apply(this, arguments);
}

Window_Stats_LevelUp.prototype = Object.create(Window_Stats.prototype);
Window_Stats_LevelUp.prototype.constructor = Window_Stats_LevelUp;

Window_Stats_LevelUp.prototype.initialize = function (x, y, width) {
    Window_Stats.prototype.initialize.call(this, x, y, width);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Stats.prototype.windowHeight = function () {
    return 355;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Stats_LevelUp.prototype.drawStats = function () {
    const ep = this.extraPadding();
    const cw = this.contentsWidth() - (ep * 2);
    const itemHeight = this.lineHeight() + this.lineGap();
    let y = ep;
    let text, prevValue, newValue;

    // stats
    for (let i = 0; i < 11; i++) {
        // level up window doesn't display attack or defence
        if (i === 2 || i === 3) continue;
        // get stat info
        if (i < 9) {
            text = `${TextManager.param(i)}:`;
            prevValue = this._actor.param(i, -1);
            newValue = this._actor.param(i);
        } else {
            text = `${TextManager.baseparam(i - 7)}:`;
            prevValue = this._actor.uparam(i, -1);
            newValue = this._actor.uparam(i);
        }
        // stat name
        this.drawText(text, ep, y);
        // new stat value
        this.changeTextColor(this.paramchangeTextColor(newValue - prevValue));
        newValue = `${newValue}`.padStart(3, ' '); // new value should be padded to line up > symbol
        this.drawText(newValue, ep, y, cw, 'right');
        this.resetTextColor();
        // previous stat value
        this.drawText(`${prevValue} > `, ep, y, cw - this.contents.measureTextWidth(newValue), 'right');
        y += itemHeight;
    }
};
