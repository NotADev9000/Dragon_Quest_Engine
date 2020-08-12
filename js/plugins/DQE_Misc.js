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

//DQEng.misc.params = PluginManager.parameters('DQE_Misc');

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