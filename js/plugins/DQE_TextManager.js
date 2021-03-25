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

Object.defineProperties(TextManager, {
    medalUnit: { get: function () { return 'M'; }, configurable: true },
    backup: { get: function () { return 'The frontline has fallen but backup has arrived!' }, configurable: true },
    settings_cursorBeep: { get: function () { return `Cursor @Beep" Sound` }, configurable: true }
});

TextManager.terms = {};

// Church

TextManager.terms.churchText = {};

TextManager.terms.churchText.generic = [
    `*: Welcome to our church, my child.\nHow may I help you?`,
    `*: O great Goddess, may you watch over and protect this child!`,
    `*: Confess all that you have done before the almighty Goddess, child.`,
    `*: Do you wish me to make a record in this adventure log?`,
    `Saving adventure log...`,
    `*: I have successfully recorded your adventure log.`,
    `SAVE FAILED! Please try again...\nIf the problem persists, please contact the developer.`,
    `*: Whom do you wish brought back to the world of the living?`,
    `*: O great and benevolent Goddess!\nI beseech you to breathe life once more into your faithful servant, %1!`,
    `*: Whom shall I treat for poison?`,
    `*: O great and benevolent Goddess!\nPlease rid your faithful servant %1 of this unholy poison!`,
    `*: Who needs a curse lifted?`,
    `*: O great and benevolent Goddess!\nPlease rid your faithful servant %1 of this wretched curse!`,
    `*: In order to carry out this task, I shall require a contribution of \\c[7]%1\\c[1] gold coins. Will you oblige, my child?`,
    `*: It seems that you cannot afford to make this humble donation.`,
    `*: Surely you jest?\n%1 looks very much alive to me!`,
    `*: %1 doesn't seem to have a trace of poison in their system!`,
    `*: %1 may look tired but that doesn't mean they are cursed!`,
    `*: Is there any other way we can be of assistance?`
];

// Bank

TextManager.terms.bankText = {};

TextManager.terms.bankText.generic = [
    `*: Welcome to the Bank of Snowmourne.`,
    `*: Your current bank balance is %1.\nHow can we be helpin' you today?`,
    `*: You currently have %1 safely tucked away in our vault. Thank you for using our services.`,
    `*: We are carrying the maximum amount of gold possible for you. You'll have to make a withdrawal first.`,
    `*: We'd be happy to accept your gold, how much will you be leaving with us today?`,
    `*: We aren't currently carrying any gold for you. You'll have to make a deposit first.`,
    `*: And how much gold would you like to withdraw?`,
    `*: Your current bank balance is %1.\nHow else can we be of assistance?`
];

// Parameters

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
    let paramType = Game_BattlerBase.prototype.buffIdToParamType(buffId);
    let paramId = Game_BattlerBase.prototype.buffIdToParamId(buffId);
    switch (paramType) {
        case Game_BattlerBase.TRAIT_PARAM:
            return TextManager.param(paramId);
        case Game_BattlerBase.TRAIT_UPARAM:
            return TextManager.baseparam(paramId - 7);
        case Game_BattlerBase.TRAIT_SPARAM:
            return TextManager.sparam(paramId);
        case Game_BattlerBase.TRAIT_XPARAM:
            return TextManager.xparam(paramId);
    }
};
