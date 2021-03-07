//=============================================================================
// Dragon Quest Engine - Data Manager
// DQE_Data_Manager.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Static class for managing the extra data - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Data_Manager = true;

var DQEng = DQEng || {};
DQEng.Data_Manager = DQEng.Data_Manager || {};

//-----------------------------------------------------------------------------
// Data_Manager
//-----------------------------------------------------------------------------

DataManager._databaseFiles = DataManager._databaseFiles.concat([
    { name: '$DQEdataClasses', src: 'DQE_Classes.json' }
]);

DataManager.maxSavefiles = function () {
    return 3;
};

DataManager.makeSavefileInfo = function () {
    var info = {};
    info.globalId = this._globalId;
    info.title = $dataSystem.gameTitle;
    info.level = $gameParty.highestLevel();
    info.map = $gameMap.displayName();
    info.playtime = $gameSystem.playtimeText();
    info.timestamp = Date.now();
    info.date = new Date(info.timestamp).toLocaleDateString("en-GB");
    info.time = new Date(info.timestamp).toLocaleTimeString("en-GB");
    return info;
};