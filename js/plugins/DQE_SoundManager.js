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

SoundManager.playOk = function () {
    if (ConfigManager.cursorBeep) this.playSystemSound(1);
};

SoundManager.playPlayerAttack = function () {
    this.playSoundByName('Player Act');
};

SoundManager.playRevival = function () {
    this.playSoundByName('Revive');
};

SoundManager.playChoice = function () {
    this.playSoundByName('Choice');
};
