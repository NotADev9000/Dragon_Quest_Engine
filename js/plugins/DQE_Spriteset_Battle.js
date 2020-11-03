//=============================================================================
// Dragon Quest Engine - Spriteset Battle
// DQE_Spriteset_Battle.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The sprites used in a battle - V0.1
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
Imported.DQEng_Spriteset_Battle = true;

var DQEng = DQEng || {};
DQEng.Spriteset_Battle = DQEng.Spriteset_Battle || {};

//-----------------------------------------------------------------------------
// Spriteset_Battle
//-----------------------------------------------------------------------------

Spriteset_Battle.prototype.createBattleback = function () {
    this._back1Sprite = new Sprite();
    this._back1Sprite.bitmap = this.battleback1Bitmap();
    this._battleField.addChild(this._back1Sprite);
};

Spriteset_Battle.prototype.locateBattleback = function () {
    var width = this._back1Sprite.bitmap.width;
    var height = this._back1Sprite.bitmap.height;
    var x = $gameSystem.makeDivisibleBy((Graphics.boxWidth - width) / 2);
    var y = (Graphics.boxHeight - height) / 2;
    this._back1Sprite.move(x, y);
};

Spriteset_Battle.prototype.defaultBattleback1Name = function () {
    return 'Grassland_DQ3';
};
