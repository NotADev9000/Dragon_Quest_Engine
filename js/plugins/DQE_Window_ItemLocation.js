//=============================================================================
// Dragon Quest Engine - Window Item Location
// DQE_Window_ItemLocation.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying an item and its location - V0.1
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
Imported.DQEng_Window_ItemLocation = true;

var DQEng = DQEng || {};
DQEng.Window_ItemLocation = DQEng.Window_ItemLocation || {};

//-----------------------------------------------------------------------------
// Window_ItemLocation
//-----------------------------------------------------------------------------

function Window_ItemLocation() {
    this.initialize.apply(this, arguments);
}

Window_ItemLocation.prototype = Object.create(Window_SkillCost.prototype);
Window_ItemLocation.prototype.constructor = Window_ItemLocation;

Window_ItemLocation.prototype.initialize = function (x, y) {
    Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this._equipped = false;
    this._location = -1;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_ItemLocation.prototype.windowWidth = function () {
    return 354;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_ItemLocation.prototype.setItem = function (equipped, location) {
    if (this._equipped !== equipped || this._location != location) {
        this._equipped = equipped;
        this._location = location;
        this.refresh();
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_ItemLocation.prototype.drawTitle = function () {
    let pos = this.extraPadding();
    let text = this._equipped ? 'Equipped by' : 'Held by';
    this.drawText(text, pos, pos, this.textWidth(), 'center');
};

Window_ItemLocation.prototype.drawLocation = function () {
    let y = 69;
    let text = this._location === -1 ? 'Bag' : $gameParty.allMembers()[this._location].name();
    this.drawText(text, this.extraPadding(), y, this.textWidth(), 'center');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_ItemLocation.prototype.refresh = function () {
    this.contents.clear();
    this.drawTitle();
    this.drawHorzLine(0, 51);
    this.drawLocation();
};
