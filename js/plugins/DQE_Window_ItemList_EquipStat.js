//=============================================================================
// Dragon Quest Engine - Window Item List Equip Stat
// DQE_Window_ItemList_EquipStat.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying items and shows/hides the equip stat help window - V0.1
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
Imported.DQEng_Window_ItemList_EquipStat = true;

var DQEng = DQEng || {};
DQEng.Window_ItemList_EquipStat = DQEng.Window_ItemList_EquipStat || {};

//-----------------------------------------------------------------------------
// Window_ItemList_EquipStat
//-----------------------------------------------------------------------------

function Window_ItemList_EquipStat() {
    this.initialize.apply(this, arguments);
}

Window_ItemList_EquipStat.prototype = Object.create(Window_ItemList.prototype);
Window_ItemList_EquipStat.prototype.constructor = Window_ItemList_EquipStat;

//////////////////////////////
// Functions - data
//////////////////////////////

Window_ItemList_EquipStat.prototype.setHelpWindowItem = function (item) {
    this._helpWindow.forEach(helpWindow => {
        if (helpWindow instanceof Window_EquipmentStats) {
            if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
                let equipped = this.isCategoryActor() ? this.isEquippedItem(this.index()) : false;
                helpWindow.show();
                helpWindow.setItem(item, equipped, item.etypeId - 1);
            } else {
                helpWindow.hide();
                helpWindow.setItem(null);
            }
        } else {
            helpWindow.setItem(item);
        }
    });
};