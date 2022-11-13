//=============================================================================
// Dragon Quest Engine - Window Stats Common
// DQE_Window_StatsCommon.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc NOT A USEABLE WINDOW; holds common functions between the "window_stats" windows - V0.1
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
Imported.DQEng_Window_StatsCommon = true;

var DQEng = DQEng || {};
DQEng.Window_StatsCommon = DQEng.Window_StatsCommon || {};

//-----------------------------------------------------------------------------
// Window_StatsCommon
//-----------------------------------------------------------------------------

function Window_StatsCommon() {}

Window_StatsCommon.prototype.drawNameTitle = function (title) {
    const actorName = this._actor.name();
    const actorLv = this._actor.level;
    const text = `${actorName} Lv.${actorLv}`;
    const ih = this.itemHeight();
    let y = this.extraPadding();
    // icons (switching windows)
    this.drawPageUpDownAtEdges(y);
    // window name
    this.drawText(title, 0, y, this.contentsWidth(), 'center');
    y += ih;
    // horizontal rule
    this.drawHorzLine(0, y);
    y += this.lineGap() + 3;
    // icons (switching actors)
    this.drawPreviousNextAtEdges(y);
    // actor name & level
    this.drawText(text, 0, y, this.contentsWidth(), 'center');
    y += ih;
    // horizontal rule
    this.drawHorzLine(0, y);
};