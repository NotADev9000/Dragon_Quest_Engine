//=============================================================================
// Dragon Quest Engine - Window Stats Abilities
// DQE_Window_StatsAbilities.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window breaking down an actors' abilities - V0.1
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
Imported.DQEng_Window_StatsAbilities = true;

var DQEng = DQEng || {};
DQEng.Window_StatsAbilities = DQEng.Window_StatsAbilities || {};

//-----------------------------------------------------------------------------
// Window_StatsAbilities
//-----------------------------------------------------------------------------

function Window_StatsAbilities() {
    this.initialize.apply(this, arguments);
}

Window_StatsAbilities.prototype = Object.create(Window_StatsMagic.prototype);
Window_StatsAbilities.prototype.constructor = Window_StatsAbilities;

Window_StatsAbilities.prototype.initialize = function (x, y, width, height) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this._category = -1;
    this._actor = null;
    this._data = [];
    this._title = 'Abilities';
    this._noData = 'No Abilities!';
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_StatsAbilities.prototype.includes = function (item) {
    return item.stypeId === 1;
};

Window_StatsAbilities.prototype.makeItemList = function () {
    this._data = this._actor.skills().filter(function (item) {
        return this.includes(item);
    }, this);
};
