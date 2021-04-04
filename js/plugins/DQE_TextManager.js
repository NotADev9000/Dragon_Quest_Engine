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
    `*: Welcome to the Bank of Snowmourne.`,                                                                    // welcomeMessage //
    `*: Your current bank balance is %1.\nHow can we be helpin' you today?`,                                    // introMessage
    `*: You currently have %1 safely tucked away in our vault. Thank you for using our services.`,              // leaveMessage
    `*: We are carryin' the maximum amount of gold possible for you. You'll have to make a withdrawal first.`,  // maxGoldInBankMessage
    `*: We'd be happy to accept your gold, how much will you be leavin' with us today?`,                        // depositMessage //
    `*: You don't have that much gold on you!`,                                                                 // notEnoughGoldMessage
    `*: You'd like to leave %1 with us?`,                                                                       // depositChoiceMessage
    `*: Right, we'll lock it up in the vault straight away. You've no need to worry.`,                          // depositStartMessage
    `*: We aren't currently carryin' any gold for you. You'll have to make a deposit first.`,                   // noGoldInBankMessage
    `*: We're holdin' %1 for you, how much gold would you like to withdraw?`,                                   // withdrawMessage //
    `*: That's more gold than we are carryin' for you!`,                                                        // notEnoughGoldInBankMessage
    `*: You'd like to withdraw %1 from the vault?`,                                                             // withdrawChoiceMessage
    `*: Right, here you go!`,                                                                                   // withdrawStartMessage
    `*: Your current bank balance is %1.\nHow else can we be of assistance?`                                    // restartSceneMessage //
];

// Shop

TextManager.terms.shopText = {};

TextManager.terms.shopText.generic = [
    `*: Welcome to our Item Shop. How can I serve you?`,                                                        // welcomeMessage //
    `*: Come again any time!`,                                                                                  // leaveMessage
    `*: Is there anything else I can help you with?`,                                                           // restartSceneMessage
    `*: Sorry, you don't seem to have enough gold for that.`,                                                   // notEnoughGoldMessage //
    `*: A %1? That'll be %2 gold coins, please.`,                                                               // singleBuyItemMessage
    `*: %1 %2s? That'll be %3 gold coins, please.`,                                                             // multipleBuyItemMessage
    `*: And who's going to carry your purchase?`,                                                               // carryPurchaseMessage
    `*: Changed your mind have you?\nNo worries, is there anything else I can help you with?`,                  // cancelBuyMessage
    `*: Thank you!\nIs there anything else I can help you with?`,                                                // postPurchaseMessage
];

// Obtaining Items
// %X is ordered as so: 1 - itemName, 2 - actorName, 3 - amount

TextManager.terms.obtainItemText = {};

// bag

TextManager.terms.obtainItemText.bag = [
    `%2 places the %1 in the bag.`,                                                                             // single item into bag
    `%2 places the %3 %1s in the bag.`,                                                                         // multiple items into bag
];

TextManager.terms.obtainItemText.bag_Anonymous = [
    `The %1 is placed in the bag.`,                                                                             // single item into bag
    `The %3 %1s are placed in the bag.`,                                                                        // multiple items into bag
];

TextManager.terms.obtainItemText.bag_NoItemName = [
    `%2 places it in the bag.`,                                                                                 // single item into bag
    `%2 places them in the bag.`,                                                                               // multiple items into bag
];

TextManager.terms.obtainItemText.bag_Remaining = [
    `%2 places the remaining %1 in the bag.`,                                                                   // single item into bag
    `%2 places the remaining %3 %1s in the bag.`,                                                               // multiple items into bag
];

TextManager.terms.obtainItemText.bag_Anonymous_NoItemName = [
    `It is placed in the bag.`,                                                                                 // single item into bag
    `They are placed in the bag.`,                                                                              // multiple items into bag
];

TextManager.terms.obtainItemText.bag_NoItemName_Remaining = [
    `%2 places the remaining 1 in the bag.`,                                                                    // single item into bag
    `%2 places the remaining %3 in the bag.`,                                                                   // multiple items into bag
];

// actor

TextManager.terms.obtainItemText.actor = [
    `%2 receives a %1.`,                                                                                        // single item into bag
    `%2 receives %3 %1s.`,                                                                                      // multiple items into bag
];

TextManager.terms.obtainItemText.actor_NoItemName = [
    `%2 receives 1.`,                                                                                           // single item into bag
    `%2 receives %3.`,                                                                                          // multiple items into bag
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
