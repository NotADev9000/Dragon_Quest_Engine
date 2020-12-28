//=============================================================================
// Dragon Quest Engine - Sprite Battler
// DQE_Sprite_Battler.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The sprite object class for the battler - V0.1
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
Imported.DQEng_Sprite_Battler = true;

var DQEng = DQEng || {};
DQEng.Sprite_Battler = DQEng.Sprite_Battler || {};

//-----------------------------------------------------------------------------
// Sprite_Battler
//-----------------------------------------------------------------------------

Sprite_Battler.prototype.setupDamagePopup = function () {
    if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            var sprite = new Sprite_Damage();
            sprite.setup(this._battler);
            var calcX = this.x + this.damageOffsetX();
            var misplacedX = (calcX - Math.floor(sprite._width / 2)) % 3; // the amount of pixels the damage is out of sync
            sprite.x = (calcX + misplacedX) + this.damageOffsetX();
            sprite.y = $gameSystem.makeDivisibleBy(this.y + this.damageOffsetY());
            this._damages.push(sprite);
            this.parent.addChild(sprite);
        }
        this._battler.clearDamagePopup();
        this._battler.clearResult();
    }
};
