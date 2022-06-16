//=============================================================================
// Dragon Quest Engine - Window Stats Equips
// DQE_Window_StatsEquips.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window displaying the equipment an actors can use - V0.1
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
Imported.DQEng_Window_StatsEquips = true;

var DQEng = DQEng || {};
DQEng.Window_StatsEquips = DQEng.Window_StatsEquips || {};

//-----------------------------------------------------------------------------
// Window_StatsEquips
//-----------------------------------------------------------------------------

function Window_StatsEquips() {
    this.initialize.apply(this, arguments);
}

Window_StatsEquips.prototype = Object.create(Window_StatsMagic.prototype);
Window_StatsEquips.prototype.constructor = Window_StatsEquips;

Window_StatsEquips.prototype.initialize = function (x, y, width, height) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this._category = -1;
    this._actor = null;
    this._data = [];
    this._title = 'Equippables';
    this._noData = '';
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_StatsEquips.prototype.itemBlockHeight = function () {
    return 534;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_StatsEquips.prototype.makeItemList = function () {
    const wtypes = this._actor.equippableWeapons();
    const atypes = this._actor.equippableArmors();
    this._data = [];
    
    wtypes.forEach(type => {
        this._data.push($dataSystem.weaponTypes[type])
    });
    atypes.forEach(type => {
        this._data.push($dataSystem.armorTypes[type])
    });
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_StatsEquips.prototype.drawItem = function (index) {
    const item = this._data[index];
    if (item) {
        const rect = this.itemRectForText(index);
        const width = this.contentsWidth() - (this.extraPadding() * 2);
        this.drawText(item, rect.x, rect.y, width);
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_StatsEquips.prototype.refresh = function () {
    if (this._actor) {
        this.makeItemList();
        this.contents.clear();
        Window_Pagination.prototype.refresh.call(this);
        Window_StatsCommon.prototype.drawNameTitle.call(this, this._title);
        this.drawAllItems();
    }
};