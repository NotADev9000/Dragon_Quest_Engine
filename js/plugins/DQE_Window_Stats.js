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

Window_Stats.prototype.initialize = function (x, y, width) {
    Window_Status.prototype.initialize.call(this, x, y, width);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Stats.prototype.standardPadding = function () {
    return 24;
};

Window_Stats.prototype.windowHeight = function () {
    return 429;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Stats.prototype.drawStats = function () {
    let height = this.lineHeight() + 15;
    let text, value;
    for (var i = 0; i < 11; i++) {
        let y = i * height;
        if (i < 9) {
            text = `${TextManager.param(i)}:`;
            value = this._actor.param(i);
        } else {
            let id = i - 7;
            text = `${TextManager.terms.baseParams[id]}:`;
            value = this._actor.paramBasePermPlus(id);
        }
        this.drawText(text, 0, y);
        this.drawText(value, 0, y, this.contentsWidth(), 'right');
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
