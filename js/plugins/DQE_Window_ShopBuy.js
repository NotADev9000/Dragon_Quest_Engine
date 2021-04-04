//=============================================================================
// Dragon Quest Engine - Window Shop Buy
// DQE_Window_ShopBuy.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for the buy list - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Window_ShopBuy = DQEng.Window_ShopBuy || {};

//-----------------------------------------------------------------------------
// Window_ShopBuy
//-----------------------------------------------------------------------------

Window_ShopBuy.prototype = Object.create(Window_ItemListBase.prototype);

Window_ShopBuy.prototype.initialize = function (x, y, width, height, shopGoods) {
    Window_ItemListBase.prototype.initialize.call(this, x, y, width, height);
    this._shopGoods = shopGoods;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_ShopBuy.prototype.item = function () {
    return this._data[this.index()];
};

Window_ShopBuy.prototype.makeItemList = function () {
    this._data = [];
    this._price = [];
    this._shopGoods.forEach(goods => {
        var item = null;
        switch (goods[0]) {
            case 0:
                item = $dataItems[goods[1]];
                break;
            case 1:
                item = $dataWeapons[goods[1]];
                break;
            case 2:
                item = $dataArmors[goods[1]];
                break;
        }
        if (item) {
            this._data.push(item);
            this._price.push(goods[2] === 0 ? item.price : goods[3]);
        }
    }, this);
};

Window_ShopBuy.prototype.isCurrentItemEnabled = function () {
    return true;
};

Window_ShopBuy.prototype.isEnabled = function () {
    return true;
};

Window_ShopBuy.prototype.priceAtIndex = function (index) {
    return this._price[index] || 0;
};

Window_ShopBuy.prototype.priceAtCurrentIndex = function () {
    return this._price[this.index()] || 0;
};

/**
 * the maximum amount of the selected item player can afford
 */
Window_ShopBuy.prototype.maxAfford = function () {
    const price = this.priceAtCurrentIndex();
    const gold = $gameParty.gold();
    if (price <= 0 || gold <= 0) return 99;
    return Math.min(99, Math.floor(gold / price));
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

Window_ShopBuy.prototype.updateHelp = function () {
    this.setHelpWindowItem(this.item());
};

Window_ShopBuy.prototype.setHelpWindowItem = function (item) {
    // misc window
    this._helpWindow[0].setItem(item);
    if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
        // item stats (1) & actor stats (2) window
        const stats = this.makeItemStats(item);
        this._helpWindow[1].setStats(stats);
        this._helpWindow[2].setValues(stats, item);
        this._helpWindow[3].hide();
        this._helpWindow[1].show();
        this._helpWindow[2].show();
    } else {
        // carrying (3) window
        this._helpWindow[3].setItem(item);
        this._helpWindow[1].hide();
        this._helpWindow[2].hide();
        this._helpWindow[3].show();
    }
    this._helpWindow[4].setItem(item);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_ShopBuy.prototype.drawItem = function (index) {
    const item = this._data[index];
    const rect = this.itemRectForText(index);
    // item name
    this.drawText(item.name, rect.x, rect.y);
    // item price
    const price = this.priceAtIndex(index);
    this.drawText(price, rect.x - 24, rect.y, rect.width, 'right');
    // currency unit
    this.changeTextColor(this.goldColor());
    this.drawText(TextManager.currencyUnit, rect.x, rect.y, rect.width, 'right');
    this.resetTextColor();
};
