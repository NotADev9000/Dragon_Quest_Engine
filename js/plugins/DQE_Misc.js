//=============================================================================
// Dragon Quest Engine - Misc changes
// DQE_Misc.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Misc changes for Dragon Quest Engine - V0.1
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
Imported.DQEng_Misc = true;

var DQEng = DQEng || {};
DQEng.Misc = DQEng.Misc || {};

//-----------------------------------------------------------------------------
// Bitmap
//-----------------------------------------------------------------------------

/**
 * Overwrite Victor Engine draw sprite font to properly adjust the Y position of text
 * ty now just equals the y position of text
 */
Bitmap.prototype.drawSFontText = function (text, x, y, maxWidth, lineHeight, align) {
    if (text !== undefined) {
        var tx = x;
        var ty = y;
        var sx = this.sfontWidth(text.toString())
        maxWidth = maxWidth || 0xffffffff;
        if (align === 'center') tx += (maxWidth - sx) / 2;
        if (align === 'right') tx += (maxWidth - sx);
        this.drawSFontTextBody(text.toString(), Math.floor(tx), Math.floor(ty));
    }
};

//-----------------------------------------------------------------------------
// Game_CharacterBase
//-----------------------------------------------------------------------------

/**
 * Adjusts non-object character sprites to be 3 pixels above the bottom of a tile
 *
 * @gameMatch DQ1+2 SNES
 * @return {Number} number of pixels character sprite is shifted
 */
Game_CharacterBase.prototype.shiftY = function () {
    return this.isObjectCharacter() ? 0 : 3;
};

//-----------------------------------------------------------------------------
// Window_Base
//-----------------------------------------------------------------------------

/**
 * No transparency for windows
 *
 * @gameMatch DQ1+2 SNES
 * @return {Number} opacity of windows
 */
Window_Base.prototype.standardBackOpacity = function () {
    return 255;
};