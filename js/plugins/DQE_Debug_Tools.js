//=============================================================================
// Dragon Quest Engine - Debug Tools
// DQE_Debug_Tools.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Various debug tools for DQEngine - V0.1
*
*
* @help
* Place at bottom of plugin list
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Debug_Tools = true;

var DQEng = DQEng || {};
DQEng.Debug_Tools = DQEng.Debug_Tools || {};

//-----------------------------------------------------------------------------
// Plugin_Commands
//-----------------------------------------------------------------------------

DQEng.Debug_Tools.pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    DQEng.Debug_Tools.pluginCommand.call(this, command, args);
    if (command.toLowerCase() === 'debug' && $gameTemp.isPlaytest()) {
        switch (args[0]) {
            case 'ResetQuests':
                this.resetQuests();
                break;
            default:
                console.error('INVALID Debug Command');
        }
    }
};

/**
 * Removes all active & available quests from player.
 * DOES NOT change progress of quests with switches/variables
 */
Game_Interpreter.prototype.resetQuests = function () {
    $gameParty._quests = [];
    $gameParty._availableQuests = [];
};
