//=============================================================================
// Dragon Quest Engine - Text Manager
// DQE_TextManager.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Text Manager - V0.1
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
Imported.DQEng_TextManager = true;

var DQEng = DQEng || {};
DQEng.TextManager = DQEng.TextManager || {};

//-----------------------------------------------------------------------------
// TextManager
//-----------------------------------------------------------------------------

TextManager.terms = {};
TextManager.terms.sparams = [
    "Target Rate",
    "Guard Effect",
    "Recovery Effect",
    "Pharmacology",
    "MP Cost Rate",
    "TP Charge Rate",
    "Physical Resistance",
    "Spell Resistance",
    "Floor Damage",
    "Experience Rate",
    "Breath Resistance"
];

TextManager.terms.xparams = [
    "Hit chance",
    "Evasion chance",
    "Critical chance"
];

TextManager.paramFromBuffID = function (buffId) {
    if (buffId <= 8) return TextManager.param(buffId); // regular param so just call param function
    let paramType = buffId <= Game_BattlerBase.BUFFLIST_SPARAM_END ? 1 : 2; // is it sparam or xparam?
    let paramId = Game_BattlerBase.prototype.buffIdToParamId(buffId);

    return paramType === 1 ? TextManager.terms.sparams[paramId] : TextManager.terms.xparams[paramId] ;
};
