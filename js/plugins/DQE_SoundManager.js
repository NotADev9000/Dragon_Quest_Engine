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

SoundManager.playPlayerAttack = function () {
    AudioManager.playStaticSe({
        name:   'Player Act',
        pan:    0,
        pitch:  100,
        volume: 100
    });
};
