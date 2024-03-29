//=============================================================================
// Dragon Quest Engine - Window Number Input
// DQE_Window_NumberInput.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying general gameplay info - V0.1
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
DQEng.Window_NumberInput = DQEng.Window_NumberInput || {};

//-----------------------------------------------------------------------------
// Window_NumberInput
//-----------------------------------------------------------------------------

Window_NumberInput.prototype.initialize = function (x, y, digits) {
    this._windowCursor2Sprite = null;
    this._digits = digits;
    Window_Selectable.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this.initNumber();
};

/**
 * @method _createAllParts
 * @private
 */
Window_NumberInput.prototype._createAllParts = function () {
    Window.prototype._createAllParts.call(this);
    this._windowCursor2Sprite = new Sprite();
    this.addChild(this._windowCursor2Sprite);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_NumberInput.prototype.windowWidth = function () {
    return (this.standardPadding() * 2) + (this._digits * this.itemWidth());
};

Window_NumberInput.prototype.windowHeight = function () {
    return (this.standardPadding() * 2) + (this.lineHeight() * 3) + (this.lineGap() * 2);
};

Window_NumberInput.prototype.itemWidth = function () {
    return 24;
};

Window_NumberInput.prototype.maxCols = function () {
    return this.maxItems();
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_NumberInput.prototype.number = function () {
    let number = '';
    this._number.forEach(unit => number += unit);
    return Number(number);
};

Window_NumberInput.prototype.maxItems = function () {
    return this._digits;
};

Window_NumberInput.prototype.isCancelEnabled = function () {
    return true;
};

Window_NumberInput.prototype.initNumber = function () {
    this._number = [];
    for (let i = 0; i < this._digits; i++) {
        this._number.push(0);
    }
    this.refresh();
};

Window_NumberInput.prototype.changeDigit = function (up) {
    let digit = this._number[this.index()];
    if (up) {
        this._number[this.index()] = digit >= 9 ? 0 : digit + 1;
    } else {
        this._number[this.index()] = digit <= 0 ? 9 : digit - 1;
    }
    this.refresh();
};

//////////////////////////////
// Functions - controls
//////////////////////////////

Window_NumberInput.prototype.processOk = function () {
    Window_Selectable.prototype.processOk.call(this);
};

Window_NumberInput.prototype.processNumberChange = function () {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated('up')) {
            this.changeDigit(true);
        } else if (Input.isRepeated('down')) {
            this.changeDigit(false);
        }
    }
};

Window_NumberInput.prototype.cursorRight = function () {
    const index = this.index();
    this.select(index < this.maxItems() - 1 ? index + 1 : 0);
};

Window_NumberInput.prototype.cursorLeft = function () {
    const index = this.index();
    this.select(index <= 0 ? this.maxItems() - 1 : index - 1);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_NumberInput.prototype.drawItem = function (index) {
    const rect = this.itemRect(index);
    const item = this._number[index];
    const ih = this.itemHeight();
    this.drawText(item, rect.x, ih);
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_NumberInput.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    this.processNumberChange();
};

Window_NumberInput.prototype.updateOpen = function () {
    if (this._opening) {
        this.openness += 32;
        if (this.isOpen()) {
            this._opening = false;
        }
    }
};

//////////////////////////////
// Functions - cursor
//////////////////////////////

/**
 * Cursor is now up/down arrow frame selected from windowskin
 * 
 * @method _refreshCursor
 * @private
 */
Window_NumberInput.prototype._refreshCursor = function () {
    const pad = this._padding;
    // up arrow
    this._windowCursorSprite.bitmap = this._windowskin;
    this._windowCursorSprite.setFrame(132, 15, this._cursorRect.width, this._cursorRect.height);
    this._windowCursorSprite.move(this._cursorRect.x + pad, this._cursorRect.y + pad);
    // down arrow
    this._windowCursor2Sprite.bitmap = this._windowskin;
    this._windowCursor2Sprite.setFrame(132, 60, this._cursorRect.width, this._cursorRect.height);
    let downArrowY = this._cursorRect.y + (this.itemHeight() * 2);
    this._windowCursor2Sprite.move(this._cursorRect.x + pad, downArrowY + pad);
};

/**
 * cursor width/height is changed to match up/down arrow
 */
Window_NumberInput.prototype.updateCursor = function () {
    if (this.isCursorVisible()) {
        const rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, 21, 21);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
};

Window_NumberInput.prototype._updateCursor = function () {
    const open = this.isOpen();
    this._windowCursorSprite.visible = open;
    this._windowCursor2Sprite.visible = open;
};
