//=============================================================================
// Dragon Quest Engine - Window Message
// DQE_Window_Message.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Message window for Dragon Quest Engine - V0.1
*
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Window_Message = true;

var DQEng = DQEng || {};
DQEng.Window_Message = DQEng.Window_Message || {};

//-----------------------------------------------------------------------------
// Window
//-----------------------------------------------------------------------------

/**
 * adjust Y position of pause arrow in windows
 * subtracted 9 from Y position
 * 
 * @gameMatch Custom
 */
Window.prototype._refreshPauseSign = function () {
    var sx = 144;
    var sy = 96;
    var p = 24;
    this._windowPauseSignSprite.bitmap = this._windowskin;
    this._windowPauseSignSprite.anchor.x = 0.5;
    this._windowPauseSignSprite.anchor.y = 1;
    this._windowPauseSignSprite.move(this._width / 2, this._height - 9);
    this._windowPauseSignSprite.setFrame(sx, sy, p, p);
    this._windowPauseSignSprite.alpha = 0;
};

//-----------------------------------------------------------------------------
// Window_Message
//-----------------------------------------------------------------------------

Window_Message.prototype.initialize = function () {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = $gameSystem.makeDivisibleBy((Graphics.boxWidth - width) / 2);
    Window_Base.prototype.initialize.call(this, x, 0, width, height);
    this.openness = 0;
    this.initMembers();
    this.createSubWindows();
    this.updatePlacement();
};

/**
 * Creates all the subwindows so they're ready to open
 * goldWindow has been moved to be in-line with the message box
 * 
 * @gameMatch Custom
 */
Window_Message.prototype.createSubWindows = function () {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.x = (this.x + this.width) - this._goldWindow.width;
    this._goldWindow.openness = 0;
    this._choiceWindow = new Window_ChoiceList(this);
    this._numberWindow = new Window_NumberInput(this);
    this._itemWindow = new Window_EventItem(this);
};

/**
 * Positions message window: adjusting the Y position to match DQ
 * top & bottom placed windows will be offset by +/-48
 *
 * @gameMatch DQ1+2 SNES
 */
Window_Message.prototype.updatePlacement = function () {
    this._positionType = $gameMessage.positionType();
    var yOffset = this._positionType === 0 ? 48 : this._positionType === 2 ? -48 : 0;
    this.y = (this._positionType * (Graphics.boxHeight - this.height) / 2) + yOffset; 
    this._goldWindow.y = this.y > 48 ? 48 : Graphics.boxHeight - this._goldWindow.height - 48;
};

/**
 * Gets the width of the message window
 *
 * @gameMatch DQ11 Sw (2D)
 * @return {Number} width of message window
 */
Window_Message.prototype.windowWidth = function () {
    return 984;
};

/**
 * Gets the line height of the message window
 *
 * @gameMatch Custom
 * @return {Number} line height
 */
Window_Message.prototype.lineHeight = function () {
    return 41;
};

/**
 * Calculates and returns the height of the message window
 * 19 pixels were added to fit the cursor at the bottom of window
 * this somewhat matches DQ1+2 SNES
 *
 * @gameMatch DQ1+2 SNES
 * @return {Number} height of message window
 */
Window_Message.prototype.fittingHeight = function (numLines) {
    return (numLines * this.lineHeight() + this.standardPadding() * 2) + 19;
};

/**
 * Gets the height of each character (in this case is = lineheight)
 *
 * @gameMatch Custom
 * @return {Number} character height
 */
Window_Message.prototype.calcTextHeight = function (textState, all) {
    return this.lineHeight();
};

/**
 * Change the default SFont for the message window.
 * All other windows generally use the HUD font so set message window to Message font.
 *
 * @gameMatch DQ1+2 SNES
 * @return the index of the SFont (as a plugin parameter in VE_SFont)
 */
Window_Message.prototype.normalColor = function () {
    return this.textColor(1);
};

/**
 * FUNC: When calling a function seperate the object chain with a ','
 * 
 *       When calling a function within a message add a ',' to the end
 *       when the function has no parameters
 *       e.g. \\FUNC[SceneManager,_scene,refreshItemStatWindows,]
 * 
 *       If the function has a parameter add a ',' to the end followed
 *       by the parameter
 *       e.g. \\FUNC[Scene_Battle,prototype,refreshAndShowStatsWindow,$gameParty.members()[0]]
 */
DQEng.Window_Message = Window_Message.prototype.processEscapeCharacter;
Window_Message.prototype.processEscapeCharacter = function (code, textState) {
    switch (code) {
        case 'SYSX':
            SoundManager.playSystemSound(this.obtainEscapeParam(textState));
            break;
        case 'SFX':
            SoundManager.playSoundByName(this.obtainEscapeParamString(textState));
            break;
        case 'ME':
            SoundManager.playMeByName(this.obtainEscapeParamString(textState));
            break;
        case 'FUNC':
            this.obtainEscapeParamFunc(textState);
            break;
    }
    DQEng.Window_Message.call(this, code, textState);
};

Window_Message.prototype.isTriggered = function () {
    return (Input.isTriggered('ok') || Input.isTriggered('cancel') ||
        TouchInput.isTriggered());
};
