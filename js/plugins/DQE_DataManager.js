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
    { name: '$DQE_dataActors', src: 'DQE_Actors.json' },
    { name: '$DQE_dataClasses', src: 'DQE_Classes.json' },
    { name: '$DQE_dataSkillSets', src: 'DQE_SkillSets.json' },
    { name: '$DQE_dataQuests', src: 'DQE_Quests.json' }
]);

/**
 * Adds extra actor data (skillPoints etc.) from $DQE_dataActors to $dataActors
 */
DataManager.combineDataActors = function () {
    for (let i = 1; i < $dataActors.length; i++) {
        $dataActors[i].skillPoints = [];
        $dataActors[i].learnings_skillSets = [];
        $dataActors[i] = { ...$dataActors[i], ...$DQE_dataActors[i]};
    }

    delete $DQE_dataActors;
};

//////////////////////////////
// Functions - skill sets
//////////////////////////////

DQEng.Data_Manager.createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function () {
    // read actor metadata to see what skill sets they start with
    this.readDataSkillSets();
    DQEng.Data_Manager.createGameObjects.call(this);
};

/**
 * Loops through each actor in $dataActors, reads the metadata between
 * the <skillsets></skillsets> tags and adds those skillSets to the
 * actors' skillsets array. 
 */
DataManager.readDataSkillSets = function () {
    const openTag = /<(?:skillsets)>/i;
    const closeTag = /<(?:\/skillsets)>/i;
    let inTag = false;
    $dataActors.forEach(actor => {
        if (actor) {
            // init skillSets array
            actor.skillSets = [];
            // split the notes
            const notes = actor.note.split(/[\r\n]+/);
            notes.forEach(note => {
                if (note.match(openTag)) {
                    inTag = true;
                } else if (note.match(closeTag)) {
                    inTag = false;
                } else if (inTag) {
                    // if inside the skillSets notetags, add the skill ID to actor skillSets array
                    actor.skillSets.push(note);
                }
            });
        }
    });
};

//////////////////////////////
// Functions - saves
//////////////////////////////

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

//////////////////////////////
// Functions - load
//////////////////////////////

DataManager.loadGameWithoutRescue = function (savefileId) {
    if (this.isThisGameFile(savefileId)) {
        var json = StorageManager.load(savefileId);
        this.createGameObjects();
        this.extractSaveContents(JsonEx.parse(json));
        this.updateGameData();
        this._lastAccessedId = savefileId;
        return true;
    } else {
        return false;
    }
};

/**
 * updates any loaded game data that doesn't match the data files.
 * 
 * this may occur when the game is updated and the player loads their save
 * on a new update for the first time.
 * 
 * TODO: only call this when savefile is loaded for first time since game is updated
 */
DataManager.updateGameData = function () {
    $gameParty.updateQuests();
};