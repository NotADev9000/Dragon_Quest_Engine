//=============================================================================
// Dragon Quest Engine - Input
// DQE_Input.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The static class that handles input data from the keyboard and gamepads - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Input = true;

var DQEng = DQEng || {};
DQEng.Input = DQEng.Input || {};

//-----------------------------------------------------------------------------
// Input
//-----------------------------------------------------------------------------

/**
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
Input.keyMapper = {
    13: 'ok',       // enter
    17: 'control',  // control
    27: 'escape',   // escape
    32: 'ok',       // space
    37: 'left',     // left arrow
    38: 'up',       // up arrow
    39: 'right',    // right arrow
    40: 'down',     // down arrow
    65: 'sort',     // A
    83: 'filter',   // S
    81: 'pagedown', // Q
    87: 'pageup',   // W
    88: 'escape',   // X
    90: 'ok',       // Z
    120: 'debug'    // F9
};
