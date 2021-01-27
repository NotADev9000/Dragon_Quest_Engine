//=============================================================================
// Dragon Quest Engine - Window Equip Slot Weapons
// DQE_Window_EquipSlot_Weapons.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for selecting actor's equipment (displays weapons only) - V0.1
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
Imported.DQEng_Window_EquipSlot_Weapons = true;

var DQEng = DQEng || {};
DQEng.Window_EquipSlot_Weapons = DQEng.Window_EquipSlot_Weapons || {};

//-----------------------------------------------------------------------------
// Window_EquipSlot_Weapons
//-----------------------------------------------------------------------------

function Window_EquipSlot_Weapons() {
    this.initialize.apply(this, arguments);
}

Window_EquipSlot_Weapons.prototype = Object.create(Window_EquipSlot.prototype);
Window_EquipSlot_Weapons.prototype.constructor = Window_EquipSlot_Weapons;

//////////////////////////////
// Functions - data
//////////////////////////////

Window_EquipSlot_Weapons.prototype.maxItems = function () {
    return 2;
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_EquipSlot_Weapons.prototype.drawTitle = function () {
    this.drawText('Equip Where?', this.extraPadding(), this.extraPadding(), this.itemWidth(), 'center');
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

Window_EquipSlot_Weapons.prototype.updateHelp = function () {
    this.setHelpWindowItem();
};

Window_EquipSlot_Weapons.prototype.setHelpWindowItem = function () {
    this._helpWindow.forEach(helpWindow => {
        let i = this.index();
        helpWindow.setEquippedPlusSlot(false, i);
    });
};