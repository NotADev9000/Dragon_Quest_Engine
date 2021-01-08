//=============================================================================
// Dragon Quest Engine - Window Everyone Stats
// DQE_Window_EveryoneStats.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for displaying everyone's stats - V0.1
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
Imported.DQEng_Window_EveryoneStats = true;

var DQEng = DQEng || {};
DQEng.Window_EveryoneStats = DQEng.Window_EveryoneStats || {};

//-----------------------------------------------------------------------------
// Window_EveryoneStats
//-----------------------------------------------------------------------------

function Window_EveryoneStats() {
    this.initialize.apply(this, arguments);
}

Window_EveryoneStats.prototype = Object.create(Window_Pagination.prototype);
Window_EveryoneStats.prototype.constructor = Window_EveryoneStats;

Window_EveryoneStats.prototype.initialize = function (x, y, width, height) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    this._playerBlocks = 1; // number of player blocks shown on current page
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_EveryoneStats.prototype.lineGap = function () {
    return 15;
};

/**
 * height of the vertical row at the top of the window
 * includes the actor name, actor level, vertical line and
 * the space between the line and first item
 */
Window_EveryoneStats.prototype.blockTitleHeight = function () {
    return 105;
};

Window_EveryoneStats.prototype.attributeBlockWidth = function () {
    return 399;
};

Window_EveryoneStats.prototype.playerBlockWidth = function () {
    return 321;
};

Window_EveryoneStats.prototype.maxPlayerBlocks = function () {
    return 3;
};

Window_EveryoneStats.prototype.itemHeight = function () {
    return this.lineHeight() + this.lineGap();
};

//////////////////////////////
// Functions - row
//////////////////////////////

Window_EveryoneStats.prototype.maxRows = function () {
    return 1;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_EveryoneStats.prototype.maxItems = function () {
    return Math.ceil($gameParty.members().length/this.maxPlayerBlocks());
};

/**
 * returns index of actor shown first on the current page
 */
Window_EveryoneStats.prototype.startFrom = function () {
    return this.maxPlayerBlocks() * (this._page - 1);
};

Window_EveryoneStats.prototype.updateCursor = function () {
    // don't show cursor
};

//////////////////////////////
// Functions - draw
//////////////////////////////

Window_EveryoneStats.prototype.sizeWindow = function () {
    this._playerBlocks = Math.min($gameParty.members().length - (this.startFrom()), this.maxPlayerBlocks());
    this.width = this.attributeBlockWidth() + (this._playerBlocks * this.playerBlockWidth()) + (this.standardPadding() * 2);
    this._refreshAllParts();
};

Window_EveryoneStats.prototype.drawAttributeBlock = function () {
    this.drawText('Attributes', 0, this.extraPadding(), this.attributeBlockWidth(), 'center');
    this.drawHorzLine(0, 87);
    let text;
    for (var i = 0; i < 11; i++) {
        let y = (i * this.itemHeight()) + this.blockTitleHeight();
        if (i < 9) {
            text = `${TextManager.param(i)}:`;
        } else {
            let id = i - 7;
            text = `${TextManager.terms.baseParams[id]}:`;
        }
        this.drawText(text, this.extraPadding(), y);
    }
};

/**
 * The seemingly random +/-3s are accounting for the vertical lines
 * e.g. the name is pushed 3 to the right so it centres within the vertical lines
 */
Window_EveryoneStats.prototype.drawPlayerBlocks = function () {
    let actorIndex = this.startFrom();
    for (let i = 0; i < this._playerBlocks; i++) {
        let x = this.attributeBlockWidth() + (i * this.playerBlockWidth());
        let blockWidth = this.playerBlockWidth() - 3;
        let actor = $gameParty.members()[actorIndex];
        this.drawVertLine(x, 0, this.contentsHeight() - this.pageBlockHeight());
        // name
        this.drawText(actor.name(), x + 3, this.extraPadding(), blockWidth, 'center');
        // level
        this.drawText(`Lv.${actor.level}`, x + 3, this.extraPadding() + this.itemHeight(), blockWidth, 'center');
        // stats
        for (let j = 0; j < 11; j++) {
            let y = (j * this.itemHeight()) + this.blockTitleHeight();
            if (j < 2) {
                let current = j === 0 ? actor.hp : actor.mp;
                text = `${current}/${actor.param(j)}`;
            } else if (j < 9) {
                text = actor.param(j);
            } else {
                let id = j - 7;
                text = actor.paramBasePermPlus(id);
            }
            this.drawText(text, x + 3, y, blockWidth, 'center');
        }
        actorIndex++;
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_EveryoneStats.prototype.refresh = function () {
    // pagination variables
    this._numPages = this.numPages();
    this._page = this.page();
    this._topIndex = this.topIndex();
    this._itemsOnPage = this.itemsOnPage();
    this._numRows = this.numRows();
    // resize window for each page
    this.sizeWindow();
    this.createContents();
    // draw items
    this.drawPageBlock();
    this.drawAttributeBlock();
    this.drawPlayerBlocks();
};
