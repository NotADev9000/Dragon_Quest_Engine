//=============================================================================
// Dragon Quest Engine - Game Interpreter
// DQE_Game_Interpreter.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The game object class for the Interpreter - V0.1
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
Imported.DQEng_Game_Interpreter = true;

var DQEng = DQEng || {};
DQEng.Game_Interpreter = DQEng.Game_Interpreter || {};

//-----------------------------------------------------------------------------
// Game_Interpreter
//-----------------------------------------------------------------------------

Game_Interpreter.FORCEDCHARACTER = null;

// Set Movement Route
Game_Interpreter.prototype.command205 = function () {
    $gameMap.refreshIfNeeded();
    this._character = Game_Interpreter.FORCEDCHARACTER || this.character(this._params[0]);
    if (this._character) {
        this._character.forceMoveRoute(this._params[1]);
        var eventInfo = JsonEx.makeDeepCopy(this._eventInfo);
        eventInfo.line = this._index + 1;
        this._character.setCallerEventInfo(eventInfo);
        if (this._params[1].wait) {
            this.setWaitMode('route');
        }
    }
    Game_Interpreter.FORCEDCHARACTER = null;
    return true;
};

// items

Game_Interpreter.prototype.getItem = function (type, Id) {
    switch (type.toLowerCase()) {
        case 'item':
            return $dataItems[Id];
        case 'weapon':
            return $dataWeapons[Id];
        case 'armor':
            return $dataArmors[Id];
        default:
            console.error('INVALID itemType: the first argument after the command must be item, weapon or armor');
    }
};

Game_Interpreter.prototype.giveItems_Bag = function (item, amount, actor, showItemName = true, showActorName = true, remaining = false) {
    const itemName = showItemName ? item.name : undefined;
    let actorName = showActorName ? actor?.name() : undefined;

    $gameParty.gainItem(item, amount);
    // messages
    if (!actor || actor.isDead()) actorName = $gameParty.movableMembers()[0].name();
    return this.itemsGiven_Messages_Bag(itemName, amount, actorName, remaining);
};

Game_Interpreter.prototype.giveItems_Actor = function (item, amount, actor) {
    const messages = [];

    // give items to actor
    const given = actor.giveItems(item, amount);
    if (given) messages.push(this.itemsGiven_Messages_Actor(item.name, given, actor.name()));
    // give remaining items to bag
    amount -= given;
    if (amount > 0) messages.push(this.giveItems_Bag(item, amount, actor, false, true, true));

    return messages;
};

Game_Interpreter.prototype.giveGold = function (amount, receive) {
    $gameParty.gainGold(amount);
    // messages
    return this.goldGiven_Messages(amount, receive);
};

// messages

Game_Interpreter.prototype.itemsGiven_Messages_Bag = function (itemName, amount, actorName, remaining = false) {
    const arr_type = 'bag';
    const arr_amount = amount <= 1 ? 0 : 1;
    const arr_actorName = actorName ? '' : '_Anonymous';
    const arr_itemName = itemName ? '' : '_NoItemName';
    const arr_remaining = remaining ? '_Remaining' : '';

    const message = TextManager.terms.obtainItemText[`${arr_type}${arr_actorName}${arr_itemName}${arr_remaining}`][arr_amount];
    return message.format(itemName, actorName, amount);
};

Game_Interpreter.prototype.itemsGiven_Messages_Actor = function (itemName, amount, actorName) {
    const arr_type = 'actor';
    const arr_amount = amount <= 1 ? 0 : 1;
    const arr_itemName = itemName ? '' : '_NoItemName';

    const message = TextManager.terms.obtainItemText[`${arr_type}${arr_itemName}`][arr_amount];
    return message.format(itemName, actorName, amount);
};

Game_Interpreter.prototype.itemsGiven_Messages_Obtain = function (item, amount) {
    const meta = item.meta;
    let itemName = item.name;
    let connector, message;

    if (amount > 1) {
        if (!meta.text_obtain_noSPlural) itemName += 's';
        connector = meta.text_obtain_multiple || '';
        message = TextManager.terms.obtainItemText.obtained[1];
    } else {
        connector = meta.text_obtain_single || itemName.aOrAn() + ' ';
        message = TextManager.terms.obtainItemText.obtained[0];
    }
    return message.format(connector, itemName, amount);
};

Game_Interpreter.prototype.goldGiven_Messages = function (amount, receive = true) {
    let actorName;
    let arr_partyAmount = 1;
    if ($gameParty.members().length <= 1) {
        actorName = $gameParty.movableMembers()[0].name();
        arr_partyAmount = 0;
    }
    const arr_receive = receive ? 'receive' : 'acquire';

    const message = TextManager.terms.obtainGold[`${arr_receive}`][arr_partyAmount];
    return message.format(actorName, amount);
};

Game_Interpreter.prototype.concat_Messages = function (messages) {
    return messages.join('\n');
};