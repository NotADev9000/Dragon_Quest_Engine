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
* N/A
*
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
    if (item) {
        this.setObject(item);
    }
};

Game_Item.prototype.order = function () {
    return this._order;
};

Game_Item.prototype.setObject = function (item) {
    if (DataManager.isSkill(item)) {
        this._dataClass = 'skill';
    } else if (DataManager.isItem(item)) {
        this._dataClass = 'item';
        this._order = Number(`0.${item.meta.itype.padStart(2, '0')}`);
    } else if (DataManager.isWeapon(item)) {
        this._dataClass = 'weapon';
        this._order = Number(`1.${String(item.wtypeId).padStart(2, '0')}`);
    } else if (DataManager.isArmor(item)) {
        this._dataClass = 'armor';
        this._order = Number(`2.${String(item.atypeId).padStart(2, '0')}`)
    } else {
        this._dataClass = '';
    }
    this._itemId = item ? item.id : 0;
};
