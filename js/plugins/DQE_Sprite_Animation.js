//=============================================================================
// Dragon Quest Engine - Sprite Animation
// DQE_Sprite_Animation.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Sprite Animations - V0.1
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
Imported.DQEng_Sprite_Animation = true;

var DQEng = DQEng || {};
DQEng.Sprite_Animation = DQEng.Sprite_Animation || {};

//-----------------------------------------------------------------------------
// Sprite_Animation
//-----------------------------------------------------------------------------

Sprite_Animation.prototype.processTimingData = function (timing) {
    var duration = timing.flashDuration * this._rate;
    switch (timing.flashScope) {
        case 1:
            this.startFlash(timing.flashColor, duration);
            break;
        case 2:
            this.startScreenFlash(timing.flashColor, duration);
            break;
        case 3:
            this.startHiding(duration);
            break;
    }
    if (!this._duplicated && timing.se) {
        if (timing.se.name === 'SFX_Shake') {
            this.processScreenShake(timing.se);
        } else {
            AudioManager.playSe(timing.se);
        }
    }
};

Sprite_Animation.prototype.processScreenShake = function (se) {
    let power = se.volume;
    let speed = se.pitch - 50;
    let duration = se.pan + 100;
    $gameScreen.startShake(power, speed, duration);
};
