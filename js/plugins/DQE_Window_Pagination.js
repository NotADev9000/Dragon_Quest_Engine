//=============================================================================
// Dragon Quest Engine - Window Pagination List
// DQE_Window_Pagination.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc A window that displays items with pages - V0.1
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
Imported.DQEng_Window_Pagination = true;

var DQEng = DQEng || {};
DQEng.Window_Pagination = DQEng.Window_Pagination || {};

//-----------------------------------------------------------------------------
// Window_Pagination
//-----------------------------------------------------------------------------

function Window_Pagination() {
    this.initialize.apply(this, arguments);
}

Window_Pagination.prototype = Object.create(Window_Selectable.prototype);
Window_Pagination.prototype.constructor = Window_Pagination;

Window_Pagination.prototype.initialize = function (x, y, width, height) {
    this._topIndex = -1;
    this._numPages = 0;
    this._page = -1;
    this._itemsOnPage = 0;
    this._numRows = 0;
    this._maxRows = -1;
    this._maxItemsOnPage = -1;
    this._lastSelected = 0;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

/**
 * Padding is 9 so horizontal rule covers the whole window
 */
Window_Pagination.prototype.standardPadding = function () {
    return 9;
};

/**
 * Extra padding added to correctly position text.
 * The horizontal line ignores this padding
 */
Window_Pagination.prototype.extraPadding = function () {
    return 15;
};

Window_Pagination.prototype.pageBlockHeight = function () {
    return 54;
};

//////////////////////////////
// Functions - index
//////////////////////////////

Window_Pagination.prototype.topIndex = function () {
    return this.maxItemsOnPage() * (this._page - 1);
};

/**
 * the true index is the value of the passed in index
 * if it were on the first page
 * e.g. 10 items per page
 *      index = 15 -> true index = 5
 */
Window_Pagination.prototype.trueIndex = function (index) {
    return index - (this.maxItemsOnPage() * (this._page - 1));
};

/**
 * opposite of above
 */
Window_Pagination.prototype.falseIndex = function (index) {
    return index + (this.maxItemsOnPage() * (this._page - 1));
};

/**
 * sets last selected to current index
 * used to remember the last item the user had selected
 */
Window_Pagination.prototype.setLastSelected = function (index) {
    this._lastSelected = index;
};

//////////////////////////////
// Functions - page
//////////////////////////////

/**
 * Returns the current page being displayed
 */
Window_Pagination.prototype.page = function () {
    var index = this.index();
    if (index < 0) return 1;
    return Math.floor((index / this.maxItemsOnPage()) + 1);
};

/**
 * The number of pages in the window
 */
Window_Pagination.prototype.numPages = function () {
    return Math.max(1, Math.ceil((this.maxItems() / this.maxRows()) / this.maxCols()));
};

/**
 * Returns the amount of items displayed on current page
 * If not on last page the items = rows * columns
 * 
 * Last page needs to check if items fill entire page
 * If they don't items = leftover
 * If they do items = rows * columns
 */
Window_Pagination.prototype.itemsOnPage = function () {
    var maxItemsOnPage = this.maxItemsOnPage();
    var lastPage = this._page === this._numPages;
    var leftoverItems = this.maxItems() % maxItemsOnPage;
    if (lastPage && leftoverItems) {
        return leftoverItems;
    } else {
        return maxItemsOnPage;
    }
};

/**
 * The maximum amount of items that can appear on a single page
 */
Window_Pagination.prototype.maxItemsOnPage = function () {
    if (this._maxItemsOnPage != -1) return this._maxItemsOnPage;
    return this.maxRows() * this.maxCols();
};

/**
 * returns the next page in the list
 * loops to top/bottom when the end is reached
 * 
 * @param {number} next gets the next page if 1, previous if -1
 */
Window_Pagination.prototype.getNextPage = function (next = 1) {
    let nextPage = this._page + next;
    return nextPage <= 0 ? this._numPages : nextPage > this._numPages ? 1 : nextPage;
};

//////////////////////////////
// Functions - row/column
//////////////////////////////

Window_Pagination.prototype.row = function () {
    let index = this.index();
    if (index < 0) return -1;
    return Math.floor(this.trueIndex(index)/this.maxCols());
};

Window_Pagination.prototype.column = function () {
    return this.trueIndex(this.index()) - (this.maxCols() * this.row());
};

/**
 * Returns the amount of rows being displayed on the current page
 */
Window_Pagination.prototype.numRows = function () {
    return numRows = Math.ceil(this._itemsOnPage / this.maxCols());
};

Window_Pagination.prototype.topRow = function () {
    return 0;
};
Window_Pagination.prototype.maxTopRow = function () {
    return 0;
};

Window_Pagination.prototype.bottomRow = function () {
    return Math.max(0, this.maxRows() - 1);
};

/**
 * The maximum number of rows per page
 */
Window_Pagination.prototype.maxRows = function () {
    if (this._maxRows != -1) return this._maxRows;

    var pageHeight = this.height - ((this.padding + this.extraPadding()) * 2) - this.pageBlockHeight();
    var itemHeight = this.lineHeight() + this.lineGap();
    return Math.floor((pageHeight / itemHeight) + 1);
};
Window_Pagination.prototype.maxPageRows = function () {
    return this.maxRows();
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Pagination.prototype.drawPageBlock = function () {
    var blockY = this.height - this.pageBlockHeight() - (this.padding + this.extraPadding()) + 6;
    var page = String(this._page).padStart(2, '0');
    var totalPages = String(this._numPages).padStart(2, '0');
    var display = `<  ${page}/${totalPages}  >`
    var displayWidth = this.width - (this.standardPadding() + this.extraPadding()) * 2;

    this.drawHorzLine(0, blockY);
    blockY += 18;
    this.drawText(display, this.extraPadding(), blockY, displayWidth, 'center');
};

/**
 * Draws the items for the current page
 */
Window_Pagination.prototype.drawAllItems = function () {
    var index = this._topIndex;
    var pageBottom = index + this._itemsOnPage;
    for (index; index < pageBottom; index++) {
        this.drawItem(index);
    }
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_Pagination.prototype.cursorDown = function () {
    let index = this.index();
    let nextIndex = index + this.maxCols();
    if (this.trueIndex(nextIndex) < this._itemsOnPage) { // cursor can move down
        this.select(nextIndex);
    } else { // cursor must loop to top of list
        nextIndex = this.falseIndex(this.column());
        this.select(nextIndex);
    }
};

Window_Pagination.prototype.cursorUp = function () {
    let index = this.index();
    let nextIndex = index - this.maxCols();
    if (this.trueIndex(nextIndex) > -1) { // cursor can move up
        this.select(nextIndex);
    } else { // cursor must loop to bottom of list
        let cols = this.maxCols();
        let items = this._itemsOnPage;
        let bottomRow = Math.ceil(items / cols) - 1;
        nextIndex = this.falseIndex((bottomRow * cols) + this.column()); // get index of item on bottom row (using current column)
        this.select(nextIndex < this.maxItems() ? nextIndex : nextIndex - cols); // if index is too far down list, go back up one
    }
};

Window_Pagination.prototype.cursorRight = function () {
    let maxCols = this.maxCols();
    if (this._numPages > 1 || maxCols > 1) {
        let nextCol = this.column() + 1;
        let nextIndex = this.index() + 1;
        let nextPage = this._page;
        if (nextCol >= maxCols || nextIndex >= this.maxItems()) { // cursor must loop to leftmost column
            nextCol = 0;
            nextPage = this.getNextPage();
            nextIndex = ((this.row() * maxCols) + nextCol) + ((nextPage - 1) * this.maxItemsOnPage());
        }
        this.select(nextIndex);
    }
};

Window_Pagination.prototype.cursorLeft = function () {
    let maxCols = this.maxCols();
    if (this._numPages > 1 || maxCols > 1) {
        let nextCol = this.column() - 1;
        let nextIndex = this.index() - 1;
        let nextPage = this._page;
        if (nextCol < 0) { // cursor must loop to rightmost column
            nextCol = maxCols - 1;
            nextPage = this.getNextPage(-1); // get previous page
            nextIndex = ((this.row() * maxCols) + nextCol) + ((nextPage - 1) * this.maxItemsOnPage());
        }
        this.select(nextIndex);
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

/**
 * Refreshes if the page is changed
 */
Window_Pagination.prototype.select = function (index) {
    this._index = Math.min(this.maxItems()-1, index);
    this._stayCount = 0;
    if (this._page != this.page() && this._index > -1) { this.refresh() };
    this.updateCursor();
    this.callUpdateHelp();
};

/**
 * List of items should be made before this method is called
 * Draw all should be called after this method is called
 */
Window_Pagination.prototype.refresh = function () {
    this.setLastSelected(0);
    this._numPages = this.numPages();
    this._page = this.page();
    this._topIndex = this.topIndex();
    this._itemsOnPage = this.itemsOnPage();
    this._numRows = this.numRows();
    this.drawPageBlock();
};

Window_Pagination.prototype.itemRect = function (index) {
    let rect = new Rectangle();
    let maxCols = this.maxCols();
    let row = this.row();
    let isBottomRow = row === this.bottomRow();
    let lineGap = this.lineGap();
    let ep = this.extraPadding();

    rect.width = this.itemWidth();
    rect.height = isBottomRow ? this.itemHeight() : this.itemHeight() + lineGap;

    rect.x = (index % maxCols * (rect.width + this.spacing()) - this._scrollX) + ep;
    let rectHeightOffset = isBottomRow ? rect.height + lineGap : rect.height;
    rect.y = (Math.floor(this.trueIndex(index) / maxCols) * rectHeightOffset - this._scrollY) + ep;
    rect.width -= (ep*2);
    return rect;
};
