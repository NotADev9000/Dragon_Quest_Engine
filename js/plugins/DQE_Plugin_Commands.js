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
            case 'GiveActorsItems':// itemType, itemId, amount
                this.giveActorsItems(args[1], args[2], args[3]);
                break;
            case 'GiveActorsItemsSilent':
                this.giveActorsItems(args[1], args[2], args[3], false);
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
            default:
                console.error('INVALID Dragon Quest Engine Command');
        }
    }
};

Game_Interpreter.prototype.giveActorsItems = function (itemType, itemId, amount, messages = true) {
    switch (itemType.toLowerCase()) {
        case 'item':
            var item = $dataItems[itemId];
            break;
        case 'weapon':
            var item = $dataWeapons[itemId];
            break;
        case 'armor':
            var item = $dataArmors[itemId];
            break;
        default:
            console.error('INVALID itemType: the first argument after the command must be 0, 1 or 2');
    }
    var actors = $gameParty.members();
    var leftover = amount;
    var amountGiven = 0;

    // place items into actor inventory starting with front actor
    for (const actor of actors) {
        amountGiven = actor.giveItems(item, leftover);
        leftover = leftover - amountGiven;
        if (messages && amountGiven) {
            this.giveActorsItemsMessage(amount, amountGiven, actor);
        }
        if (!leftover) {break;}
    };
    // if actors can't carry it all place the remaining items in bag
    if (leftover) {
        $gameParty.gainItem(item, leftover);
        if (messages) {
            this.giveActorsItemsMessage(amount, leftover, null, true);
        }
    }
};

Game_Interpreter.prototype.giveActorsItemsMessage = function (amount, amountGiven, actor = null, bag = false) {
    var message = '';
    var gaveAllAtOnce = amount == amountGiven; // did the items all get given to one actor/the bag

    if (gaveAllAtOnce) {
        if (amount == 1) {
            message += bag ? 'It was placed in the bag.' : `${actor.name()} held onto it.`;
        } else if (bag) {
            message += 'They were all placed in the bag.';
        } else {
            message += `${actor.name()} held onto them.`;
        }
    } else if (bag) {
        message += 'The rest were placed in the bag.';
    } else {
        message += `${actor.name()} held onto ${amountGiven}.`;
    }

    $gameMessage.add(message);
};
