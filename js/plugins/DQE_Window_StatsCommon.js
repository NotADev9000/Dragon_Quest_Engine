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
    let actorName = this._actor.name();
    let actorLv = this._actor.level;
    let text = `${actorName} Lv.${actorLv}`;
    let itemHeight = this.lineHeight() + this.lineGap();
    let y = this.extraPadding();
    this.drawText(text, 0, y, this.contentsWidth(), 'center');
    y += itemHeight;
    this.drawHorzLine(0, y);
    y += this.lineGap() + 3;
    this.drawText(title, 0, y, this.contentsWidth(), 'center');
    y += itemHeight;
    this.drawHorzLine(0, y);
};