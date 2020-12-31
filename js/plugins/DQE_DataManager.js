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
