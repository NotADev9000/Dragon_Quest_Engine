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

Window_Selectable.prototype.select = function (index) {
    this._index = index;
    this._stayCount = 0;
    this.updateCursor();
    this.callUpdateHelp();
};

Window_Selectable.prototype.column = function () {
    return this.index() - (this.maxCols() * this.row());
};

/**
 * default RM Window_Selectable overrides Base so this function is needed
 */
Window_Selectable.prototype.itemHeight = function () {
    return Window_Base.prototype.itemHeight.call(this);
};

Window_Selectable.prototype.itemRect = function (index) {
    const rect = new Rectangle();
    const maxCols = this.maxCols();

    rect.width = this.itemWidth();
    rect.height = this.itemHeight();

    rect.x = index % maxCols * (rect.width + this.spacing());
    rect.y = Math.floor(index / maxCols) * rect.height;

    return rect;
};

Window_Selectable.prototype.itemRectForText = function (index) {
    const rect = this.itemRect(index);
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
    const index = this.index();
    let nextIndex = index - this.maxCols();
    if (nextIndex > -1) { // cursor can move up
        this.select(nextIndex);
    } else { // cursor must loop to bottom of list
        const cols = this.maxCols();
        nextIndex = (this.maxRows() * cols) + this.column(); // get index of item on bottom row (using current column)
        this.select(nextIndex < this.maxItems() ? nextIndex : nextIndex - cols); // if index is in empty slot, go back up one
        // e.g.
        // 1 2
        // 3 x
        // where nextIndex = 4 so number of columns is subtracted to move up one space (in this example to 2)
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

Window_Selectable.prototype.processCursorMove = function () {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        if (Input.isRepeated('right')) {
            this.cursorRight(Input.isTriggered('right'));
        }
        if (Input.isRepeated('left')) {
            this.cursorLeft(Input.isTriggered('left'));
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
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
 */
Window_Selectable.prototype.updateCursor = function () {
    if (this.isCursorVisible()) {
        const rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, 18, 21);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
};

Window_Selectable.prototype.isCursorVisible = function () {
    const row = this.row();
    return row >= 0 && row <= this.maxRows();
};

Window_Selectable.prototype.drawAllItems = function () {
    for (let i = 0; i < this.maxItems(); i++) {
        this.drawItem(i);
    }
};

Window_Selectable.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.processCursorMove();
    this.processHandling();
    this.processTouch();
    this._stayCount++;
};

Window_Selectable.prototype.hitTest = function (x, y) {
    if (this.isContentsArea(x, y)) {
        const cx = x - this.padding;
        const cy = y - this.padding;
        for (let i = 0; i < this.maxItems(); i++) {
            const rect = this.itemRect(i);
            const right = rect.x + rect.width;
            const bottom = rect.y + rect.height;
            if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
                return i;
            }
        }
    }
    return -1;
};
