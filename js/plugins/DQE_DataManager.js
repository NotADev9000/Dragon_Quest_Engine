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
    { name: '$DQE_dataClasses', src: 'DQE_Classes.json' },
    { name: '$DQE_dataSkillSets', src: 'DQE_SkillSets.json' }
]);

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
 * the <skillsets></skillsets> tags and adds those skillsets to the
 * actors' skillsets array. 
 */
DataManager.readDataSkillSets = function () {
    const openTag = /<(?:skillsets)>/i;
    const closeTag = /<(?:\/skillsets)>/i;
    let inTag = false;
    $dataActors.forEach(actor => {
        if (actor) {
            // init skillsets array
            actor.skillSets = [];
            // split the notes
            const notes = actor.note.split(/[\r\n]+/);
            notes.forEach(note => {
                if (note.match(openTag)) {
                    inTag = true;
                } else if (note.match(closeTag)) {
                    inTag = false;
                } else if (inTag) {
                    // if inside the skillsets notetags, add the skill ID to actor skillsets array
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