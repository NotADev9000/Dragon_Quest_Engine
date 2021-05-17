//=============================================================================
// Dragon Quest Engine - Game Item
// DQE_Game_Item.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The game object class for handling skills, items, weapons, and armor - V0.1
*
*
* @help
* itype notetag => should be a two digit number e.g. 1 = 01, 5 = 05, 10 = 10 (not used for weapons/armor)
* - represents the items type
* + heals HP		0
* + heals MP		1
* + restores status 2
* + seeds			3
* + other			4
* + important		5
*
* order notetag => a three digit number representing order in menus e.g. 1 = 001, 15 = 015, 200 = 200
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Game_Item = DQEng.Game_Item || {};

//-----------------------------------------------------------------------------
// Game_Item
//-----------------------------------------------------------------------------

/**
 * _order = the order of the item when sorted by type
 *          lower value means it comes first in lists
 * 
 * @param {$dataItem} item to be converted to Game_Item
 */
Game_Item.prototype.initialize = function (item) {
    this._dataClass = '';
    this._itemId = 0;
    this._order = 0;
    if (item) this.setObject(item);
};

Game_Item.prototype.order = function () {
    return this._order;
};

Game_Item.prototype.makeOrder = function (type, item) {
    const meta = item.meta;
    switch (type) {
        case 0:
            return Number(`0.${meta.itype}${meta.order}`);
        case 1:
            return Number(`1.${String(item.wtypeId).padStart(2, '0')}${meta.order}`);
        case 2:
            return Number(`2.${String(item.etypeId).padStart(2, '0')}${meta.order}`);
    }
};

Game_Item.prototype.setObject = function (item) {
    if (DataManager.isSkill(item)) {
        this._dataClass = 'skill';
    } else if (DataManager.isItem(item)) {
        this._dataClass = 'item';
        this._order = this.makeOrder(0, item);
    } else if (DataManager.isWeapon(item)) {
        this._dataClass = 'weapon';
        this._order = this.makeOrder(1, item);
    } else if (DataManager.isArmor(item)) {
        this._dataClass = 'armor';
        this._order = this.makeOrder(2, item);
    } else {
        this._dataClass = '';
    }
    this._itemId = item ? item.id : 0;
};
