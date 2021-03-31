//=============================================================================
// Dragon Quest Engine - Window Shop Misc
// DQE_Window_ShopMisc.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for the shop's misc list - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Window_ShopMisc = DQEng.Window_ShopMisc || {};

//-----------------------------------------------------------------------------
// Window_ShopMisc
//-----------------------------------------------------------------------------

function Window_ShopMisc() {
    this.initialize.apply(this, arguments);
}

Window_ShopMisc.prototype = Object.create(Window_Base.prototype);
Window_ShopMisc.prototype.constructor = Window_ShopMisc;

Window_ShopMisc.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._type = '';
    this._carried = 0;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_ShopMisc.prototype.itemHeight = function () {
    return this.lineHeight() + this.lineGap();
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_ShopMisc.prototype.setItem = function (item) {
    this._carried = 0;
    let type = 0;
    // type
    if (DataManager.isItem(item)) {
        if (item.itypeId === 1) {
            this._type = 'item';
        } else {
            this._type = 'important';
        }
    } else if (DataManager.isWeapon(item)) {
        this._type = $dataSystem.weaponTypes[item.wtypeId];
        type = 1;
    } else if (DataManager.isArmor(item)) {
        this._type = $dataSystem.armorTypes[item.atypeId];
        type = 2;
    }
    // carried
    // in bag
    this._carried = $gameParty.numItems(item);
    // on party members
    $gameParty.members().forEach(actor => {
        this._carried += actor.amountOfItem(item, type);
    });
    // refresh
    this.refresh();
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_ShopMisc.prototype.drawAll = function () {
    const ih = this.itemHeight();
    const cw = this.contentsWidth();
    let y = 0;
    // type
    this.drawText('Type:', 0, y);
    this.drawText(this._type, 0, y, cw, 'right');
    y += ih;
    // carried
    this.drawText('No. Carried:', 0, y);
    this.drawText(this._carried, 0, y, cw, 'right');
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_ShopMisc.prototype.refresh = function () {
    if (this._type) {
        this.contents.clear();
        this.drawAll();
    }
};
