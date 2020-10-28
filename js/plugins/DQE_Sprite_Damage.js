//=============================================================================
// Dragon Quest Engine - Sprite Damage
// DQE_Sprite_Damage.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The sprite object class for the Damage - V0.1
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
Imported.DQEng_Sprite_Damage = true;

var DQEng = DQEng || {};
DQEng.Sprite_Damage = DQEng.Sprite_Damage || {};

//-----------------------------------------------------------------------------
// Sprite_Damage
//-----------------------------------------------------------------------------

DQEng.Sprite_Damage.initialize = Sprite_Damage.prototype.initialize;
Sprite_Damage.prototype.initialize = function () {
    DQEng.Sprite_Damage.initialize.call(this);
    this._width = 0;
};

Sprite_Damage.prototype.setup = function (target) {
    var result = target.result();
    if (result.missed || result.evaded) {
        this.createMiss();
    } else if (result.hpAffected) {
        this.createDigits(0, result.hpDamage, result.critical);
    } else if (target.isAlive() && result.mpDamage !== 0) {
        this.createDigits(2, result.mpDamage, result.critical);
    }
};

Sprite_Damage.prototype.digitHeight = function () {
    return this._damageBitmap ? this._damageBitmap.height / 6 : 0;
};

Sprite_Damage.prototype.createMiss = function () {
    var w = this.digitWidth();
    var h = this.digitHeight();
    var sprite = this.createChildSprite();
    sprite.setFrame(0, 5 * h, 4 * w, h);
    sprite.dy = 0;
    this._width = w * 4;
};

Sprite_Damage.prototype.createDigits = function (baseRow, value, critical) {
    var string = Math.abs(value).toString();
    var row = critical ? 4 : baseRow + (value < 0 ? 1 : 0);
    var w = this.digitWidth();
    var h = this.digitHeight();
    for (var i = 0; i < string.length; i++) {
        var sprite = this.createChildSprite();
        var n = Number(string[i]);
        sprite.setFrame(n * w, row * h, w, h);
        sprite.x = (i - (string.length - 1) / 2) * w;
        sprite.dy = -i;
    }
    this._width = string.length * w;
};
