//=============================================================================
// Dragon Quest Engine - Window Help
// DQE_Window_Help.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying the description of the selected item - V0.1
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
Imported.DQEng_Window_Help = true;

var DQEng = DQEng || {};
DQEng.Window_Help = DQEng.Window_Help || {};

//-----------------------------------------------------------------------------
// Window_Help
//-----------------------------------------------------------------------------

Window_Help.prototype.initialize = function (x, y, width, numLines = 2, height = 0) {
    var winHeight = height ? height : this.fittingHeight(numLines);
    Window_Base.prototype.initialize.call(this, x, y, width, winHeight);
    this._text = '';
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Help.prototype.lineGap = function () {
    return 9;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_Help.prototype.setItem = function (item) {
    this.setText(item ? item.description || item : '');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_Help.prototype.refresh = function () {
    this.contents.clear();
    this.drawTextEx(this._text, 0, 0);
};
