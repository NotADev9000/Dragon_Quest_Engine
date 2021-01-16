//=============================================================================
// Dragon Quest Engine - Window Stats Other Abilities
// DQE_Window_StatsOtherAbilities.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window breaking down an actors' other abilities - V0.1
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
Imported.DQEng_Window_StatsOtherAbilities = true;

var DQEng = DQEng || {};
DQEng.Window_StatsOtherAbilities = DQEng.Window_StatsOtherAbilities || {};

//-----------------------------------------------------------------------------
// Window_StatsOtherAbilities
//-----------------------------------------------------------------------------

function Window_StatsOtherAbilities() {
    this.initialize.apply(this, arguments);
}

Window_StatsOtherAbilities.prototype = Object.create(Window_StatsMagic.prototype);
Window_StatsOtherAbilities.prototype.constructor = Window_StatsOtherAbilities;

Window_StatsOtherAbilities.prototype.initialize = function (x, y, width, height) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this._category = -1;
    this._actor = null;
    this._data = [];
    this._title = 'Other Abilities';
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_StatsOtherAbilities.prototype.includes = function (item) {
    return item.stypeId === 1;
};

Window_StatsOtherAbilities.prototype.makeItemList = function () {
    this._data = this._actor.skills().filter(function (item) {
        return this.includes(item);
    }, this);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_StatsOtherAbilities.prototype.drawAllItems = function () {
    if (!this._data.length) { // if actor has no abilities
        this.drawText('No Abilities!', 0, this.extraPadding() + this.titleBlockHeight(), this.contentsWidth(), 'center');
    } else {
        Window_Pagination.prototype.drawAllItems.call(this);
    }
};