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
 * @method _updateCursor
 * @private
 */
Window.prototype._updateCursor = function () {
    this._windowCursorSprite.visible = this.isOpen();
};

//-----------------------------------------------------------------------------
// Window_Selectable
//-----------------------------------------------------------------------------

Window_Selectable.prototype.textPadding = function () {
    return 18;
};

Window_Selectable.prototype.updateCursor = function () {
    if (this._cursorAll) {
        var allRowsHeight = this.maxRows() * this.itemHeight();
        this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
        this.setTopRow(0);
    } else if (this.isCursorVisible()) {
        var rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, 18, 21);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
};