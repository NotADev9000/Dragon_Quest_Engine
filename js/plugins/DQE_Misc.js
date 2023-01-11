//=============================================================================
// Dragon Quest Engine - Misc changes
// DQE_Misc.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Misc changes for Dragon Quest Engine - V0.1
* TECH DEBT: Move changes here into a more suitable file
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
// Game_System
//-----------------------------------------------------------------------------

Game_System.prototype.makeDivisibleBy = function (number, div = 3) {
    return number - (number%div);
};

/**
 * generates a random number (real) between
 * min & max parameters. dec limits the decimal
 * places shown
 * 
 * @param {number} min of random number
 * @param {number} max of random number
 * @param {number} dec decimal places to return
 */
Game_System.prototype.randomNumMinMax =  function (min, max, dec = 1) {
    return Number((Math.random() * (max - min) + min).toFixed(dec));
};

//-----------------------------------------------------------------------------
// SceneManager
//-----------------------------------------------------------------------------

SceneManager.snapForBackground = function () {
    this._backgroundBitmap = this.snap();
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
