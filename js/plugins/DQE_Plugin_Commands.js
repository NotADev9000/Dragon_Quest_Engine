//=============================================================================
// Dragon Quest Engine - Plugin Commands
// DQE_Plugin_Commands.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Plugin Commands for DQEngine - V0.1
*
*
* @help
* All the plugin commands in one place for Dragon Quest MV Engine
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Plugin_Commands = true;

var DQEng = DQEng || {};
DQEng.Plugin_Commands = DQEng.Plugin_Commands || {};

//-----------------------------------------------------------------------------
// Game_Interpreter
//-----------------------------------------------------------------------------

DQEng.Plugin_Commands.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    DQEng.Plugin_Commands.pluginCommand.call(this, command, args);
    if (command.toLowerCase() === 'dqe') {
        switch (args[0]) {
            case 'GiveActorItems':// itemType, itemId, amount, memberId
                this.plugin_GiveActorItems(args[1], args[2], args[3], args[4]);
                break;
            case 'GiveActorItemsSilent':
                this.plugin_GiveActorItems(args[1], args[2], args[3], args[4], false);
                break;
            case 'GiveActorItemsExtra':
                this.plugin_GiveActorItems(args[1], args[2], args[3], args[4], true, true);
                break;
            case 'ForceMoveRouteFollower': // follower position
                const follower = $gamePlayer.followers()?.follower(args[1]);
                Game_Interpreter.FORCEDCHARACTER = follower;
                break;
            case 'SetRestorePoint': // mapId, x, y, direction (2=down, 4=left, 6=right, 8=up), map name (optional)
                const mapName = args[5];
                args = args.map(arg => Number(arg));
                $gameParty.setRestorePoint(args[1], args[2], args[3], args[4], mapName);
                break;
            case 'SetZoomPoint': // id, name, mapId, x, y
                const name = args[2];
                args = args.map(arg => Number(arg));
                $gameParty.addZoomPoint(args[1], name, args[3], args[4], args[5]);
                break;
            case 'GainMiniMedal': // amount
                $gameParty.gainMedal(Number(args[1]));
                break;
            case 'LoseMiniMedal': // amount
                $gameParty.loseMedal(Number(args[1]));
                break;
            case 'SetChurchStyle': // style
                Scene_Church.TEXTSTYLE = args[1].toLowerCase();
                break;
            case 'SetBankStyle': // style
                Scene_Bank.TEXTSTYLE = args[1].toLowerCase();
                break;
            case 'SetShopStyle': // style
                Scene_Shop.TEXTSTYLE = args[1].toLowerCase();
                break;
            default:
                console.error('INVALID Dragon Quest Engine Command');
        }
    }
};

Game_Interpreter.prototype.plugin_GiveActorItems = function (itemType, itemId, amount, memberId, showMessages = true, showExtra = false) {
    let item;
    const messages = [];
    switch (itemType.toLowerCase()) {
        case 'item':
            item = $dataItems[itemId];
            break;
        case 'weapon':
            item = $dataWeapons[itemId];
            break;
        case 'armor':
            item = $dataArmors[itemId];
            break;
        default:
            console.error('INVALID itemType: the first argument after the command must be item, weapon or armor');
    }
    const actor = $gameParty.members()[memberId];

    if (showMessages) $gameMessage.add(this.itemsGiven_Messages_Obtain(item, amount)); // "obtained" messages
    messages.push(this.giveItems_Actor(item, amount, actor));                          // give actor items & return "actor received" messages
    if (showExtra) $gameMessage.add(this.concat_Messages(messages));                   // display "actor received" messages
};
