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

TextManager.terms.baseparam = [
    "Health",       // HP
    "Magic",        // MP
    "Strength",     // Attack
    "Resilience"    // Defense
];

TextManager.terms.xparam = [
    "Hit Chance",
    "Evasion Chance",
    "Critical Rate",
    "",
    "",
    "",
    "",
    "HP Regeneration Rate",
    "MP Regeneration Rate",
    "",
    "Block Chance",
    "Critical Block Chance"
];

TextManager.terms.xparamDescription = [
    "",
    "The chance of evading an incoming attack.",
    "The chance of an attack landing a critical hit.",
    "",
    "",
    "",
    "",
    "The amount of HP regenerated at the end of each turn.<BR>e.g. 10% -> 10% of maximum HP will be recovered.",
    "The amount of MP regenerated at the end of each turn.<BR>e.g. 10% -> 10% of maximum MP will be recovered.",
    "",
    "The chance of blocking an incoming physical attack. Not including critical hits.",
    "The chance of blocking an incoming critical hit."
];

// full sparam names (used in battle)
TextManager.terms.sparam = [
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

// abbreviated sparam names (used in some UI)
TextManager.terms.sparamAbbr = [
    "Target Rate",
    "Guard Effect",
    "Recovery Effect",
    "Pharmacology",
    "MP Cost",
    "TP Charge Rate",
    "Physical Resist",
    "Spell Resist",
    "Floor Damage",
    "Exp Rate",
    "Breath Resist"
];

TextManager.terms.sparamDescription = [
    "",
    "",
    "",
    "",
    "",
    "",
    "Resistance against physical attacks.",
    "Resistance against magical attacks.",
    "",
    "",
    "",
    "Resistance against breath attacks."
];

TextManager.terms.stateResistDescription = [
    "", // <-- ALWAYS EMPTY
    "The chance of resisting instant death attacks.<BR>e.g. Whack",
    "",
    "",
    "Resistance against being put to sleep.",
    "Resistance against being paralysed.",
    "Resistance against being confused.",
    "Resistance against being Beguiled.",
    "Resistance against being Dazzled.",
    "Resistance against spells being sealed.",
    "Resistance against abilities being sealed.",
    "Resistance against being poisoned.",
    "Resistance against being envenomated.",
    "Resistance against being cursed",
    "", // <-- CURSE EFFECT
    "Resistance against laughing uncontrollably.",
    "Resistance against boogieing."
];

/**
 * base versions of parameters
 * 
 * @param {number} paramId 
 */
TextManager.baseparam = function (paramId) {
    return TextManager.terms.baseparam[paramId];
};

TextManager.xparam = function (paramId) {
    return TextManager.terms.xparam[paramId];
};

TextManager.xparamDescription = function (paramId) {
    return TextManager.terms.xparamDescription[paramId];
};

TextManager.sparam = function (paramId) {
    return TextManager.terms.sparam[paramId];
};

TextManager.sparamAbbr = function (paramId) {
    return TextManager.terms.sparamAbbr[paramId];
};

TextManager.sparamDescription = function (paramId) {
    return TextManager.terms.sparamDescription[paramId];
};

TextManager.stateResistDescription = function (stateId) {
    return TextManager.terms.stateResistDescription[stateId];
};

TextManager.paramFromBuffID = function (buffId) {
    if (buffId <= 8) return TextManager.param(buffId); // regular param so just call param function
    let paramType = buffId <= Game_BattlerBase.BUFFLIST_SPARAM_END ? 2 : 1; // is it sparam or xparam?
    let paramId = Game_BattlerBase.prototype.buffIdToParamId(buffId);

    return paramType === 2 ? TextManager.sparam(paramId) : TextManager.xparam(paramId);
};
