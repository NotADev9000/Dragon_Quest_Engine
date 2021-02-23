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

//////////////////////////////
// Parameters - mappers
//////////////////////////////

Input.ICON_GENERIC = 1;
Input.ICON_XBOX = 2;
Input.ICON_PLAYSTATION = 3;
Input.ICON_SWITCH = 4;
Input.GAMEPAD_NAME_XBOX = 'Xbox';
Input.GAMEPAD_NAME_PLAYSTATION = 'PlayStation';
Input.GAMEPAD_NAME_SWITCH = 'Switch';
Input.GAMEPAD_NAME_NINTENDO = 'Nintendo';
Input.GAMEPAD_NAME_GENERIC = 'Generic';

// [0] = ID, [1] = display name, [2] = gamepad button, [3] = keyboard button
Input.handlers = [
    ['ok',       'Confirm',              0, 0],
    ['cancel',   'Cancel',               0, 0],
    ['up',       'Move Up',              0, 0],
    ['down',     'Move Down',            0, 0],
    ['left',     'Move Left',            0, 0],
    ['right',    'Move Right',           0, 0],
    ['menu',     'Menu',                 0, 0],
    ['help',     'Help',                 0, 0],
    ['sort',     'Sort Items',           0, 0],
    ['filter',   'Filter Items',         0, 0],
    ['pagedown', 'Previous Category',    0, 0],
    ['pageup',   'Next Category',        0, 0],
    ['previous', 'Previous Member',      0, 0],
    ['next',     'Next Member',          0, 0]
];

Input.keyDown = null;

/**
 * Resets keyboard controls
 *
 * @static
 * @method resetKeyMapper
 */
Input.resetKeyMapper = function () {
    // A hash table to convert from a virtual key code to a mapped key name.
    Input.keyMapper = {
        8:  [],                             // backspace
        9:  [],                             // tab
        13: [],                             // enter
        16: [],                             // Shift
        17: ['control'],                    // control
        18: [],                             // Alt
        27: ['escape'],                     // escape
        32: ['ok'],                         // space
        37: ['left'],                       // left arrow
        38: ['up'],                         // up arrow
        39: ['right'],                      // right arrow
        40: ['down'],                       // down arrow
        48: [],                             // 0
        49: [],                             // 1
        50: [],                             // 2
        51: [],                             // 3
        52: [],                             // 4
        53: [],                             // 5
        54: [],                             // 6
        55: [],                             // 7
        56: [],                             // 8
        57: [],                             // 9
        65: ['sort', 'help', 'previous'],   // A
        66: [],                             // B
        67: [],                             // C
        68: [],                             // D
        69: [],                             // E
        70: [],                             // F
        71: [],                             // G
        72: [],                             // H
        73: [],                             // I
        74: [],                             // J
        75: [],                             // K
        76: [],                             // L
        77: [],                             // M
        78: [],                             // N
        79: [],                             // O
        80: [],                             // P
        81: ['pagedown'],                   // Q
        82: [],                             // R
        83: ['filter', 'next'],             // S
        84: [],                             // T
        85: [],                             // U
        86: [],                             // V
        87: ['pageup'],                     // W
        88: ['menu', 'cancel'],             // X
        89: [],                             // Y
        90: [],                             // Z
        120: ['debug'],                     // F9
        186: [],                            // Semicolon
        187: [],                            // =
        188: [],                            // Comma
        189: [],                            // -
        190: [],                            // Period
        191: [],                            // Slash
        192: [],                            // Backtick (A.K.A Grave, also the same key as the tilde on US keyboards)
        219: [],                            // Open brace
        220: [],                            // Backslash
        221: [],                            // Closing brace
        222: []                             // Quote
    };

    let handles = Input.handlers;
    handles[0][3] = 32;
    handles[1][3] = 88;
    handles[2][3] = 38;
    handles[3][3] = 40;
    handles[4][3] = 37;
    handles[5][3] = 39;
    handles[6][3] = 88;
    handles[7][3] = 65;
    handles[8][3] = 65;
    handles[9][3] = 83;
    handles[10][3] = 81;
    handles[11][3] = 87;
    handles[12][3] = 65;
    handles[13][3] = 83;
};
Input.resetKeyMapper();

/**
 * Resets gamepad controls to standard or nintendo style
 * 
 * @static
 * @method resetGamepadMapper
 * @param {Boolean} nintendoMap should the controller be mapped to the Nintendo buttons
 */
Input.resetGamepadMapper = function (nintendoMap) {
    // A hash table to convert from a gamepad button to a mapped key name.
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

    let handles = Input.handlers;
    handles[0][2] = 0;
    handles[1][2] = 1;
    handles[2][2] = 12;
    handles[3][2] = 13;
    handles[4][2] = 14;
    handles[5][2] = 15;
    handles[6][2] = 3;
    handles[7][2] = 2;
    handles[8][2] = 2;
    handles[9][2] = 3;
    handles[10][2] = 6;
    handles[11][2] = 7;
    handles[12][2] = 4;
    handles[13][2] = 5;

    // nintendo styled controller
    if (nintendoMap) {
        // button 0 = cancel
        Input.gamepadMapper[0].pop();
        Input.gamepadMapper[0].push('cancel');
        // button 1 = ok
        Input.gamepadMapper[1].pop();
        Input.gamepadMapper[1].push('ok');
        // update handler array
        Input.handlers[0][2] = 1;
        Input.handlers[1][2] = 0;
    }
};
Input.resetGamepadMapper(false);

//////////////////////////////
// Functions - config
//////////////////////////////

Input.getConnectedGamepad = function () {
    if (navigator.getGamepads) {
        var gamepads = navigator.getGamepads();
        if (gamepads) {
            for (let i = 0; i < gamepads.length; i++) {
                let gamepad = gamepads[i];
                if (gamepad?.connected) return gamepad;
            }
        }
    }
    return null;
};

Input.autoMapConnectedGamepad = function (event) {
    if (ConfigManager.savedGamepadMap) return; // don't auto-map controller if a configuration has already been saved
    const connectedPad = this.getConnectedGamepad();
    const gamepad = event.gamepad;
    // make sure that the connected gamepad matches the one in the first slot
    if (connectedPad.index === gamepad.index) {
        const id = gamepad.id.toLowerCase();
        const nintendoIds = ['0547e', 'nintendo', 'switch', 'pro'];
        const playstationIds = ['054c', 'playstation', 'sony', 'ps3', 'ps4', 'ps5', 'dualshock'];
        const xboxIds = ['045e', 'xbox', 'x-box', '360', 'microsoft'];
        if (nintendoIds.some(ninId => id.includes(ninId))) {
            ConfigManager.iconType = Input.ICON_SWITCH;
            this.resetGamepadMapper(true);
        } else if (playstationIds.some(psId => id.includes(psId))) {
            ConfigManager.iconType = Input.ICON_PLAYSTATION;
        } else if (xboxIds.some(xboxIds => id.includes(xboxIds))) {
            ConfigManager.iconType = Input.ICON_XBOX;
        }
    }
};

/**
 * Gets the currently pressed button on the gamepad
 * 
 * @static
 * @method getPressedGamepadButton
 */
Input.getPressedGamepadButton = function () {
    let gamepads = navigator.getGamepads();
    if (gamepads) {
        for (let i = 0; i < gamepads.length; i++) {
            let gamepad = gamepads[i];
            if (gamepad?.connected) {
                let buttons = gamepad.buttons;
                for (let j = 0; j < buttons.length; j++) {
                    if (buttons[j].pressed) return j;
                }
            }
        }
    }
    return -1;
};

Input.checkKey = function () {
    return this._checkKey;
};

Input.setCheckKey = function (check) {
    return this._checkKey = check;
};

Input.resetChecks = function () {
    this.setCheckKey(false);
    this.keyDown = null;
};

//////////////////////////////
// Functions - inputs
//////////////////////////////

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
    this._checkKey = false; // is config mode on and key is being checked?
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
 * @method _setupEventHandlers
 * @private
 */
DQEng.Input._setupEventHandlers = Input._setupEventHandlers;
Input._setupEventHandlers = function () {
    DQEng.Input._setupEventHandlers.call(this);
    window.addEventListener('gamepadconnected', this.autoMapConnectedGamepad.bind(this));
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
    if (this._checkKey) Input.keyDown = event.keyCode;
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
