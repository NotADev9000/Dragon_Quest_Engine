//=============================================================================
// Dragon Quest Engine - Data Items
// DQE_Data_Items.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Functions for manipulating arrays of data & game_item items/weapons/armors - V0.1
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
DQEng.Data_Items = DQEng.Data_Items || {};

//-----------------------------------------------------------------------------
// Data_Items
//-----------------------------------------------------------------------------

/**
 * @class Data_Items
 */
function Data_Items() {
    throw new Error('Data_Items is a static class');
}

/**
 * Sorts an array of data items by current sorting method.
 * This function should be used for sorting items in the bag
 * 
 * @param {array} data 
 * @returns array of sorted data items
 */
Data_Items.sortBagItems = (data) => {
    switch ($gameParty.sortMethod()) {
        case Game_Party.SORT_BY_OBTAINED:
            return;
        case Game_Party.SORT_BY_ALPHABETICAL:
            data.sort((a, b) => a.name.localeCompare(b.name))
            break;
    }
};
