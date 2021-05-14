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

//////////////////////////////
// Functions - actor inventory
//////////////////////////////

/**
 * sorts an actor's held items by type.
 * DOES NOT change equipped items
 * 
 * @param {Game_Actor} actor to have held items sorted
 */
Data_Items.sortActorItems = (actor) => {
    // remove equipped items from list as they should not be sorted
    actor.removeEquipsFromItemList();
    // sort remaining
    let items = actor.gameItems();
    items.sort(Data_Items.sortByType_Actor);
    // add back the equipped items
    actor.setItems(actor.initCarriedEquips().concat(items));
};

Data_Items.sortByType_Actor = (item1, item2) => {
    return Data_Items.sortComparison(item1.order(), item2.order());
};

//////////////////////////////
// Functions - bag inventory
//////////////////////////////

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
        case Game_Party.SORT_BY_TYPE:
            data.sort(Data_Items.sortByType_Bag);
            break;
    }
};

/**
 * callback function for comparing two dataItems by type
 * 
 * @param {$dataItem} item1 
 * @param {$dataItem} item2 
 * @returns an integer representing how the two items should be ordered (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description)
 */
Data_Items.sortByType_Bag = (item1, item2) => {
    // get item type
    let type1 = Data_Items.itemTypeToNumOrder(item1);
    let type2 = Data_Items.itemTypeToNumOrder(item2);

    // compare item type
    let returnValue = Data_Items.sortComparison(type1, type2);
    // return comparison if items are not the same item type
    if (returnValue !== 0) return returnValue;

    // get detailed item type
    switch (type1) {
        case 0: // item
            type1 = item1.meta.itype;
            type2 = item2.meta.itype;
            break;
        case 1: // weapon
            type1 = item1.wtypeId;
            type2 = item2.wtypeId;
            break;
        case 2: // armor
            type1 = item1.atypeId;
            type2 = item2.atypeId;
            break;
    }

    // compare detailed item type
    returnValue = Data_Items.sortComparison(type1, type2);
    // return comparison
    return returnValue;
};

/**
 * checks item type and returns a value representing its position
 * lower value = first in list
 * 
 * @param {$dataItem} item
 */
Data_Items.itemTypeToNumOrder = (item) => {
    if (DataManager.isItem(item)) {
        return 0;
    } else if (DataManager.isWeapon(item)) {
        return 1;
    } else { // armor
        return 2;
    }
};

/**
 * generic comparison of two items
 */
Data_Items.sortComparison = (item1, item2) => {
    if (item1 < item2) {
        return -1; // item1 before item2
    } else if (item1 > item2) {
        return 1;  // item2 before item1
    } else {
        return 0;  // same item type
    }
};
