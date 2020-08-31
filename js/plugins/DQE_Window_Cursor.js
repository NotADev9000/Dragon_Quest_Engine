//=============================================================================
// Dragon Quest Engine - Window Cursor
// DQE_Window_Cursor.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc uses an arrow cursor before text instead of highlighting for Dragon Quest Engine - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_Cursor = true;

var DQEng = DQEng || {};
DQEng.Window_Cursor = DQEng.Window_Cursor || {};

//-----------------------------------------------------------------------------
// Window
//-----------------------------------------------------------------------------

/**
 * Cursor is now one frame selected from windowskin
 * 
 * @method _refreshCursor
 * @private
 */
Window.prototype._refreshCursor = function () {
    var pad = this._padding;

    this._windowCursorSprite.bitmap = this._windowskin;
    this._windowCursorSprite.setFrame(96, 96, this._cursorRect.width, this._cursorRect.height);
    this._windowCursorSprite.move(this._cursorRect.x + pad, this._cursorRect.y + pad);
};

/**
 * Cursor now doesn't fade/blink
 * 
 * @method _updateCursor
 * @private
 */
Window.prototype._updateCursor = function () {
    this._windowCursorSprite.visible = this.isOpen();
};

//-----------------------------------------------------------------------------
// Window_Selectable
//-----------------------------------------------------------------------------

/**
 * How much the text is padded before drawing it
 * The space is where the cursor sits
 */
Window_Selectable.prototype.textPadding = function () {
    return 18;
};

/**
 * Updates where the cursor should be positioned
 * Cursor is now always the same height/width
 */
Window_Selectable.prototype.updateCursor = function () {
    if (this._cursorAll) {
        // var allRowsHeight = this.maxRows() * this.itemHeight();
        this.setCursorRect(0, 0, 18, 21);
        this.setTopRow(0);
    } else if (this.isCursorVisible()) {
        var rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, 18, 21);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
};