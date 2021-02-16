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

Input.ICON_GENERIC = 1;
Input.ICON_XBOX = 2;
Input.ICON_PLAYSTATION = 3;
Input.ICON_SWITCH = 4;

// contains action handlers
// handler[0] = ID, handler[1] = display name, handler[2] = gamepad button
Input.handlers = [
    ['ok',       'Confirm',            0],
    ['cancel',   'Cancel',             1],
    ['up',       'Move Up',            12],
    ['down',     'Move Down',          13],
    ['left',     'Move Left',          14],
    ['right',    'Move Right',         15],
    ['menu',     'Menu',               3],
    ['help',     'Help',               2],
    ['sort',     'Sort Items',         2],
    ['filter',   'Filter Items',       3],
    ['pagedown', 'Previous Category',  6],
    ['pageup',   'Next Category',      7],
    ['previous', 'Previous Member',    4],
    ['next',     'Next Member',        5]
];

/**
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
Input.keyMapper = {
    13: ['ok'],       // enter
    17: ['control'],  // control
    27: ['escape'],   // escape
    32: ['ok'],       // space
    37: ['left'],     // left arrow
    38: ['up'],       // up arrow
    39: ['right'],    // right arrow
    40: ['down'],     // down arrow
    65: ['sort', 'help', 'previous'],     // A
    83: ['filter', 'next'],   // S
    81: ['pagedown'], // Q
    87: ['pageup'],   // W
    88: ['menu', 'cancel'],   // X
    90: ['ok'],       // Z
    120: ['debug']    // F9
};

/**
 * A hash table to convert from a gamepad button to a mapped key name.
 *
 * @static
 * @property gamepadMapper
 * @type Object
 */
Input.gamepadMapper = {
                                        // XBOX CONTROLLER EXAMPLE
    0: ['ok'],                          // A
    1: ['cancel'],                      // B
    2: ['help', 'sort'],                // X
    3: ['menu', 'filter'],              // Y
    4: ['previous'],                    // LB
    5: ['next'],                        // RB
    6: ['pagedown'],                    // LT
    7: ['pageup'],                      // RT
    8: [],                              // Back
    9: [],                              // Start
    10: [],                             // Left Stick IN
    11: [],                             // Right Stick IN
    12: ['up'],                         // D-pad up
    13: ['down'],                       // D-pad down
    14: ['left'],                       // D-pad left
    15: ['right']                       // D-pad right
};

/**
 * Gets the gamepad button associated with the given handle
 * 
 * @static
 * @method getGamepadButton
 * @param {String} handle 
 */
Input.getGamepadButton = function (handle) {
    for (let i = 0; i < 16; i++) {
        for (const currentHandle of Input.gamepadMapper[i]) {
            if (handle === currentHandle) return i;
        }
    }
    return -1;
};

/**
 * Clears all the input data.
 *
 * @static
 * @method clear
 */
Input.clear = function () {
    this._currentState = {};
    this._previousState = {};
    this._gamepadStates = [];
    this._latestButton = [];
    this._pressedTime = 0;
    this._dir4 = 0;
    this._dir8 = 0;
    this._preferredAxis = '';
    this._date = 0;
};

/**
 * Updates the input data.
 *
 * @static
 * @method update
 */
Input.update = function () {
    this._pollGamepads();
    if (this._latestButton.some(lb => this._currentState[lb], this)) {
        this._pressedTime++;
    } else {
        this._latestButton = [];
    }
    let newLatestButtons = [];
    for (var name in this._currentState) {
        if (this._currentState[name] && !this._previousState[name]) {
            newLatestButtons.push(name);
            this._pressedTime = 0;
            this._date = Date.now();
        }
        this._previousState[name] = this._currentState[name];
    }
    if (newLatestButtons.length) this._latestButton = newLatestButtons;
    this._updateDirection();
};

/**
 * Checks whether a key is just pressed.
 *
 * @static
 * @method isTriggered
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is triggered
 */
Input.isTriggered = function (keyName) {
    if (this._isEscapeCompatible(keyName) && this.isTriggered('escape')) {
        return true;
    } else {
        return this._latestButton.contains(keyName) && this._pressedTime === 0;
    }
};

/**
 * Checks whether a key is just pressed or a key repeat occurred.
 *
 * @static
 * @method isRepeated
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is repeated
 */
Input.isRepeated = function (keyName) {
    if (this._isEscapeCompatible(keyName) && this.isRepeated('escape')) {
        return true;
    } else {
        return (this._latestButton.contains(keyName) &&
            (this._pressedTime === 0 ||
                (this._pressedTime >= this.keyRepeatWait &&
                    this._pressedTime % this.keyRepeatInterval === 0)));
    }
};

/**
 * Checks whether a key is kept depressed.
 *
 * @static
 * @method isLongPressed
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is long-pressed
 */
Input.isLongPressed = function (keyName) {
    if (this._isEscapeCompatible(keyName) && this.isLongPressed('escape')) {
        return true;
    } else {
        return (this._latestButton.contains(keyName) &&
            this._pressedTime >= this.keyRepeatWait);
    }
};

/**
 * @static
 * @method _onKeyDown
 * @param {KeyboardEvent} event
 * @private
 */
Input._onKeyDown = function (event) {
    if (this._shouldPreventDefault(event.keyCode)) {
        event.preventDefault();
    }
    if (event.keyCode === 144) {    // Numlock
        this.clear();
    }
    let buttonNames = this.keyMapper[event.keyCode];
    if (ResourceHandler.exists() && buttonNames.contains('ok')) {
        ResourceHandler.retry();
    } else if (buttonNames) {
        buttonNames.forEach(buttonName => {
            this._currentState[buttonName] = true;
        });
    }
};

/**
 * @static
 * @method _onKeyUp
 * @param {KeyboardEvent} event
 * @private
 */
Input._onKeyUp = function (event) {
    let buttonNames = this.keyMapper[event.keyCode];
    if (buttonNames) {
        buttonNames.forEach(buttonName => {
            this._currentState[buttonName] = false;
        });
    }
    if (event.keyCode === 0) {  // For QtWebEngine on OS X
        this.clear();
    }
};

/**
 * @static
 * @method _updateGamepadState
 * @param {Gamepad} gamepad
 * @param {Number} index
 * @private
 */
Input._updateGamepadState = function (gamepad) {
    let lastState = this._gamepadStates[gamepad.index] || [];
    let newState = [];
    let buttons = gamepad.buttons;
    let axes = gamepad.axes;
    let threshold = 0.5;
    newState[12] = false;
    newState[13] = false;
    newState[14] = false;
    newState[15] = false;
    for (let i = 0; i < buttons.length; i++) {
        newState[i] = buttons[i].pressed;
    }
    if (axes[1] < -threshold) {
        newState[12] = true;    // up
    } else if (axes[1] > threshold) {
        newState[13] = true;    // down
    }
    if (axes[0] < -threshold) {
        newState[14] = true;    // left
    } else if (axes[0] > threshold) {
        newState[15] = true;    // right
    }
    for (let j = 0; j < newState.length; j++) {
        if (newState[j] !== lastState[j]) {
            let buttonNames = this.gamepadMapper[j];
            if (buttonNames) {
                buttonNames.forEach(buttonName => {
                    this._currentState[buttonName] = newState[j];
                });
            }
        }
    }
    this._gamepadStates[gamepad.index] = newState;
};
