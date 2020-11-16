//=============================================================================
// Dragon Quest Engine - Sound Manager
// DQE_SoundManager.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The Sound Manager - V0.1
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
Imported.DQEng_SoundManager = true;

var DQEng = DQEng || {};
DQEng.SoundManager = DQEng.SoundManager || {};

//-----------------------------------------------------------------------------
// SoundManager
//-----------------------------------------------------------------------------

SoundManager.playMeByName = function (name, pan = 0, pitch = 100, volume = 100) {
    AudioManager.playMe({
        name: name,
        pan: pan,
        pitch: pitch,
        volume: volume
    });
};

SoundManager.playSoundByName = function (name, pan = 0, pitch = 100, volume = 100) {
    AudioManager.playStaticSe({
        name: name,
        pan: pan,
        pitch: pitch,
        volume: volume
    });
};

SoundManager.playPlayerAttack = function () {
    AudioManager.playStaticSe({
        name:   'Player Act',
        pan:    0,
        pitch:  100,
        volume: 100
    });
};

SoundManager.playRevival = function () {
    AudioManager.playStaticSe({
        name: 'Revive',
        pan: 0,
        pitch: 100,
        volume: 100
    });
};
