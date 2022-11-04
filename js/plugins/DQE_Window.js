//=============================================================================
// Dragon Quest Engine - Window
// DQE_Window.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window in the game (this is what the official rmmv file says...) - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window = true;

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
