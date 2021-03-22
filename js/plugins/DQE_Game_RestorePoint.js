//=============================================================================
// Dragon Quest Engine - Restore Point
// DQE_Game_RestorePoint.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc the game object class for storing restore point data (where player is teleported to upon wipe out) - V0.1
*
* @param Default Restore Point - Map ID
* @desc Map ID of default location where player should be brought to upon party wipe out
* @default 1
*
* @param Default Restore Point - Map Name
* @desc Map Name of default location where player should be brought to upon party wipe out
*
* @param Default Restore Point - X
* @desc X position of default location where player should be brought to upon party wipe out
* @default 0
*
* @param Default Restore Point - Y
* @desc Y position of default location where player should be brought to upon party wipe out
* @default 0
*
* @param Default Restore Point - Direction
* @desc Direction character should be facing upon party wipe out (2=down, 4=left, 6=right, 8=up)
* @default 8
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Game_RestorePoint = true;

var DQEng = DQEng || {};
DQEng.Game_RestorePoint = DQEng.Game_RestorePoint || {};

var parameters = PluginManager.parameters('DQE_Game_RestorePoint');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Game_RestorePoint = {};
DQEng.Parameters.Game_RestorePoint.DefaultMapId = Number(parameters["Default Restore Point - Map ID"]);
DQEng.Parameters.Game_RestorePoint.DefaultMapName = parameters["Default Restore Point - Map Name"];
DQEng.Parameters.Game_RestorePoint.DefaultX = Number(parameters["Default Restore Point - X"]);
DQEng.Parameters.Game_RestorePoint.DefaultY = Number(parameters["Default Restore Point - Y"]);
DQEng.Parameters.Game_RestorePoint.DefaultDirection = Number(parameters["Default Restore Point - Direction"]);


//-----------------------------------------------------------------------------
// Game_RestorePoint
//-----------------------------------------------------------------------------

function Game_RestorePoint() {
    this.initialize.apply(this, arguments);
}

Object.defineProperties(Game_RestorePoint.prototype, {
    mapId: { get: function () { return this._mapId; }, set: function (mapId) { this._mapId = mapId; }, configurable: true },
    mapName: { get: function () { return this._mapName; }, set: function (mapName) { this._mapName = mapName; }, configurable: true },
    x: { get: function () { return this._x; }, set: function (x) { this._x = x; }, configurable: true },
    y: { get: function () { return this._y; }, set: function (y) { this._y = y; }, configurable: true },
    direction: { get: function () { return this._direction; }, set: function (direction) { this._direction = direction; }, configurable: true }
});

Game_RestorePoint.prototype.initialize = function () {
    const params = DQEng.Parameters.Game_RestorePoint;
    this.mapId = params.DefaultMapId;
    this.mapName = params.DefaultMapName;
    this.x = params.DefaultX;
    this.y = params.DefaultY;
    this.direction = params.DefaultDirection;
};
