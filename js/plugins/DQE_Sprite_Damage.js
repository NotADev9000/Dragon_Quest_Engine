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
    this._duration = 101;
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
    sprite.ry = 0;
    sprite.moveState = 0;
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
        sprite.ry = sprite.y + (i*6);
        sprite.moveState = 0;
    }
    this._width = string.length * w;
};

Sprite_Damage.prototype.createChildSprite = function() {
    var sprite = new Sprite();
    sprite.bitmap = this._damageBitmap;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.y = 6;
    this.addChild(sprite);
    return sprite;
};

Sprite_Damage.prototype.updateChild = function (sprite) {
    switch (sprite.moveState) {
        case 0:
            sprite.ry -= 3;
            if (sprite.ry <= -27) sprite.moveState = 1;
            break;
        case 1:
            sprite.ry += 2;
            if (sprite.ry >= 0) sprite.moveState = 2;
            break;
        case 2:
            sprite.ry -= 2;
            if (sprite.ry <= -12) sprite.moveState = 3;
            break;
        case 3:
            sprite.ry += 1;
            if (sprite.ry >= 0) sprite.moveState = 4;
            break;
    }
    sprite.y = Math.round(sprite.ry);
    sprite.setBlendColor(this._flashColor);
};

Sprite_Damage.prototype.updateOpacity = function () {
    var deleteAt = 20; // at what duration should the numbers start dissapearing
    for (var i = 0; i < this.children.length; i++) {
        if (deleteAt - (i*5) >= this._duration) {
            this.children[i].opacity = 0;
        }
    }
};
