//=============================================================================
// Dragon Quest Engine - Game Actor
// DQE_Game_Actor.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The The game object class for the party - V0.1
*
*
* @help
* This is where the party members' held items logic is stored
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Game_Actor = true;

var DQEng = DQEng || {};
DQEng.Game_Actor = DQEng.Game_Actor || {};

//-----------------------------------------------------------------------------
// Game_Actor
//-----------------------------------------------------------------------------

/**
 * Initialize items array
 */
DQEng.Game_Actor.initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function () {
    DQEng.Game_Actor.initMembers.call(this);
    this._items = [];
}

/**
 * Returns held items as an array of data items
 */
Game_Actor.prototype.items = function () {
    return this._items.map(function (item) {
        return item.object();
    });
};

Game_Actor.prototype.maxItems = function () {
    return 12;
};

Game_Actor.prototype.numItems = function () {
    return this._items.length;
};

Game_Actor.prototype.hasMaxItems = function () {
    return this.numItems() >= this.maxItems();
};

Game_Actor.prototype.hasItem = function (item) {
    return this.items().contains(item);
};

Game_Actor.prototype.gainItem = function (item) {
    this._items.push(new Game_Item(item));
};

/**
 * Adds items to actor inventory if there is room
 * Returns the amount of items that were successfuly
 * added to the actor inventory
 * 
 * @param {dataItem} item the item to add to the inventory
 * @param {number} amount the amount of items to add
 */
Game_Actor.prototype.giveItems = function (item, amount) {
    for (let i = 0; i < amount; i++) {
        if (this.hasMaxItems()) return i;
        this.gainItem(item);
        this.refresh();
    }
    return amount;
}
