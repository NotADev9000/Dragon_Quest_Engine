//=============================================================================
// Dragon Quest Engine - Window Stats
// DQE_Window_Stats.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window displaying actor stats - V0.1
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
Imported.DQEng_Window_Stats = true;

var DQEng = DQEng || {};
DQEng.Window_Stats = DQEng.Window_Stats || {};

//-----------------------------------------------------------------------------
// Window_Stats
//-----------------------------------------------------------------------------

function Window_Stats() {
    this.initialize.apply(this, arguments);
}

Window_Stats.prototype = Object.create(Window_Status.prototype);
Window_Stats.prototype.constructor = Window_Stats;

Window_Stats.prototype.initialize = function (x, y, width, drawName = false) {
    this._drawName = drawName;
    Window_Status.prototype.initialize.call(this, x, y, width);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Stats.prototype.windowHeight = function () {
    return this._drawName ? 483 : 429;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Stats.prototype.drawStats = function () {
    const ep = this.extraPadding();
    const cw = this.contentsWidth() - (ep * 2);
    const lineGap = this.lineGap();
    const itemHeight = this.lineHeight() + lineGap;
    let y = ep;
    let text, value;

    // actor name
    if (this._drawName) {
        this.drawText(this._actor.name(), ep, y, cw, 'center');
        y += itemHeight;
        this.drawHorzLine(0, y);
        y += 3 + lineGap;
    }

    // stats
    for (let i = 0; i < 11; i++) {
        if (i < 9) {
            text = `${TextManager.param(i)}:`;
            value = this._actor.param(i);
        } else {
            text = `${TextManager.baseparam(i - 7)}:`;
            value = this._actor.uparam(i);
        }
        this.drawText(text, ep, y);
        this.drawText(value, ep, y, cw, 'right');
        y += itemHeight;
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_Stats.prototype.refresh = function () {
    if (this._actor) {
        this.contents.clear();
        this.drawStats();
    }
};
