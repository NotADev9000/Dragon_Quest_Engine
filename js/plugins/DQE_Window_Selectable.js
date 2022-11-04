//=============================================================================
// Dragon Quest Engine - Window Selectable
// DQE_Window_Selectable.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window class with cursor movement - V0.1
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
Imported.DQEng_Window_Selectable = true;

//-----------------------------------------------------------------------------
// Window_Selectable
//-----------------------------------------------------------------------------

Window_Selectable.prototype.column = function () {
    return this.index() - (this.maxCols() * this.row());
};

Window_Selectable.prototype.maxPageRows = function () {
    let pageHeight = this.height
        - (this.padding + this.extraPadding()) * 2
        - ((this.maxRows() - 1) * this.lineGap());
    return Math.floor(pageHeight / this.lineHeight());
};

Window_Selectable.prototype.itemRect = function (index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    var isBottomRow = index === this.bottomRow();
    var lineGap = this.lineGap();

    rect.width = this.itemWidth();
    rect.height = isBottomRow ? this.itemHeight() : this.itemHeight() + lineGap;

    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    var rectHeightOffset = isBottomRow ? rect.height + lineGap : rect.height;
    rect.y = Math.floor(index / maxCols) * rectHeightOffset - this._scrollY;
    return rect;
};

/**
 * width only subtracts textPadding once now
 */
Window_Selectable.prototype.itemRectForText = function (index) {
    var rect = this.itemRect(index);
    rect.x += this.textPadding();
    rect.width -= this.textPadding();
    return rect;
};

Window_Selectable.prototype.cursorDown = function () {
    let index = this.index();
    let nextIndex = index + this.maxCols();
    if (nextIndex < this.maxItems()) { // cursor can move down
        this.select(nextIndex);
    } else { // cursor must loop to top of list
        this.select(this.column());
    }
};

Window_Selectable.prototype.cursorUp = function () {
    let index = this.index();
    let nextIndex = index - this.maxCols();
    if (nextIndex > -1) { // cursor can move up
        this.select(nextIndex);
    } else { // cursor must loop to bottom of list
        let cols = this.maxCols();
        let items = this.maxItems();
        let bottomRow = Math.ceil(items / cols) - 1;
        nextIndex = (bottomRow * cols) + this.column(); // get index of item on bottom row (using current column)
        this.select(nextIndex < items ? nextIndex : nextIndex - cols); // if index is too far down list, go back up one
    }
};

Window_Selectable.prototype.cursorRight = function () {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    var oddAmount = maxItems % 2;
    if (maxCols >= 2 && !(oddAmount && index >= maxItems - 1)) {
        if (!(index % 2)) {
            this.select((index + 1) % maxItems);
        } else {
            this.select((index - 1 + maxItems) % maxItems);
        }
    }
};

Window_Selectable.prototype.cursorLeft = function () {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    var oddAmount = maxItems % 2;
    if (maxCols >= 2 && !(oddAmount && index >= maxItems - 1)) {
        if (index % 2) {
            this.select((index - 1 + maxItems) % maxItems);
        } else {
            this.select((index + 1) % maxItems);
        }
    }
};

Window_Selectable.prototype.isOkTriggered = function () {
    return Input.isTriggered('ok');
};

Window_Selectable.prototype.processHandling = function () {
    if (this.isOpenAndActive()) {
        if (this.isOkEnabled() && this.isOkTriggered()) {
            this.processOk();
        } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
            this.processCancel();
        } else {
            let handles = [
                ['help', true],
                ['sort', false],
                ['filter', false],
                ['previous', false],
                ['next', false],
                ['pagedown', true],
                ['pageup', true],
                ['right', false],
                ['left', false]
            ];
            handles.some(handle => {
                let type = handle[0];
                if (this.isHandled(type) && Input.isTriggered(type)) {
                    this.processHandler(type, handle[1]);
                }
            });
        }
    }
};

/**
 * @param {string} handler name of the handler to call
 * @param {boolean} deactivate should this handler deactivate the window
 */
Window_Selectable.prototype.processHandler = function (handler, deactivate) {
    this.updateInputData();
    if (deactivate) this.deactivate();
    this.callHandler(handler);
};

/**
 * Updates where the cursor should be positioned
 * Cursor is now always the same height/width
 */
Window_Selectable.prototype.updateCursor = function () {
    if (this._cursorAll) {
        this.setCursorRect(0, 0, 18, 21);
        this.setTopRow(0);
    } else if (this.isCursorVisible()) {
        var rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, 18, 21);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
};
