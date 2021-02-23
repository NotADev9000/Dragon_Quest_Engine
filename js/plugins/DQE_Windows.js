//=============================================================================
// Dragon Quest Engine - Windows
// DQE_Windows.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc General changes to windows - Dragon Quest Engine V0.1
*
*
* @param Base Line Gap
* @desc The height of the gap between each line of text.
* Default: 8.
* @default
*
* @param Choice Line Gap
* @desc Choice Window - The height of the gap between each line of text. Default: 18.
* @default
*
* @param Choice Y Offset
* @desc How far should the Y position of the choice window be positioned from the message box. Default: 48.
* @default
*
* @param Mask Window Size
* @desc How far the windows should overlap in pixels. Default: 3.
* @default
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Windows = true;

var DQEng = DQEng || {};
DQEng.Windows = DQEng.Windows || {};

var parameters = PluginManager.parameters('DQE_Windows');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Windows = {};
DQEng.Parameters.Windows.Base_LineGap = Number(parameters["Base Line Gap"]) || 15;
DQEng.Parameters.Windows.ChoiceList_LineGap = Number(parameters["Choice Line Gap"]) || 18;
DQEng.Parameters.Windows.ChoiceList_ChoiceYOffset = Number(parameters["Choice Y Offset"]) || 48;
DQEng.Parameters.Windows.MaskWindow = Number(parameters["Mask Window Size"]) || 3;

//-----------------------------------------------------------------------------
// WindowLayer
//-----------------------------------------------------------------------------

WindowLayer.prototype._maskWindow = function (window, shift) {
    this._windowMask._currentBounds = null;
    this._windowMask.boundsDirty = true;
    var rect = this._windowRect;
    rect.x = this.x + shift.x + window.x;
    rect.y = this.y + shift.y + window.y + window.height / 2 * (1 - window._openness / 255);
    rect.width = window.width;
    rect.height = window.height * window._openness / 255;

    rect.x += DQEng.Parameters.Windows.MaskWindow;
    rect.y += DQEng.Parameters.Windows.MaskWindow * window._openness / 255;
    rect.width -= DQEng.Parameters.Windows.MaskWindow * 2;
    rect.height -= DQEng.Parameters.Windows.MaskWindow * 2 * window._openness / 255;
};

//-----------------------------------------------------------------------------
// Window_Base
//-----------------------------------------------------------------------------

Window_Base._iconWidth  = 45;
Window_Base._iconHeight = 45;

/**
 * Make windows opaque
 *
 * @gameMatch DQ1+2 SNES
 * @return {Number} opacity of windows
 */
Window_Base.prototype.standardBackOpacity = function () {
    return 255;
};

Window_Base.prototype.currencyColor = function (unit) {
    switch (unit) {
        case TextManager.medalUnit:
            return this.medalColor();
        default:
            return this.goldColor();
    }
}

Window_Base.prototype.medalColor = function () {
    return this.textColor(4);
}

Window_Base.prototype.goldColor = function () {
    return this.textColor(6);
}

Window_Base.prototype.crisisColor = function () {
    return this.textColor(6);
};

Window_Base.prototype.deathColor = function () {
    return this.textColor(2);
};

Window_Base.prototype.disabledColor = function () {
    return this.textColor(16);
};

Window_Base.prototype.itemColor = function () {
    return this.textColor(10);
};

Window_Base.prototype.powerUpColor = function () {
    return this.textColor(8);
};

Window_Base.prototype.powerDownColor = function () {
    return this.textColor(2);
};

Window_Base.prototype.standardPadding = function () {
    return 24;
};

Window_Base.prototype.extraPadding = function () {
    return 0;
};

Window_Base.prototype.lineHeight = function () {
    return 21;
};

/**
 * The height of the gap between each line of text
 * 
 * @gameMatch custom
 */
Window_Base.prototype.lineGap = function () {
    return DQEng.Parameters.Windows.Base_LineGap;
};

Window_Base.prototype.fittingHeight = function (numLines) {
    return numLines * this.lineHeight() 
        + (this.standardPadding() + this.extraPadding()) * 2 
        + (this.lineGap() * Math.max(numLines - 1, 0));
};

/**
 * This method is used for calculating the height of windows
 * with a title block (a horizontal rule with a seperate section.)
 */
Window_Base.prototype.fittingHeightTitleBlock = function (numLines) {
    return numLines * this.lineHeight()
        + (this.standardPadding() + this.extraPadding()) * 2
        + (this.lineGap() * Math.max(numLines - 1, 0))
        + this.titleBlockHeight();
};

/**
 * Open windows immediately
 *
 * @gameMatch DQ1+2 SNES
 */
Window_Base.prototype.updateOpen = function () {
    if (this._opening) {
        this.openness = 255;
        if (this.isOpen()) {
            this._opening = false;
        }
    }
};

/**
 * Close windows immediately
 *
 * @gameMatch DQ1+2 SNES
 */
Window_Base.prototype.updateClose = function () {
    if (this._closing) {
        this.openness = 0;
        if (this.isClosed()) {
            this._closing = false;
        }
    }
};

/**
 * Text height calculated with lineHeight + lineGap
 */
Window_Base.prototype.calcTextHeight = function () {
    return this.lineHeight() + this.lineGap();
};

/**
 * calculates where on the y-axis icon should sit
 */
Window_Base.prototype.calcIconCentre = function () {
    return (Window_Base._iconHeight - this.lineHeight())/2;
};

Window_Base.prototype.processDrawIcon = function (iconIndex, textState) {
    this.drawIcon(iconIndex, textState.x, textState.y - this.calcIconCentre());
    textState.x += Window_Base._iconWidth + 4;
};

/**
 * returns the index of the icon for the given key
 * 
 * @param {number} key the key mapper value
 */
Window_Base.prototype.getKeyIcon = function (key) {
    let type = 5 * 16;
    return type + key;
};

/**
 * returns the index of the icon for the given button
 * 
 * @param {number} button the gamepad mapper button value
 */
Window_Base.prototype.getGamepadIcon = function (button) {
    let type = ConfigManager.iconType * 16;
    return type + button;
};

/**
 * returns the index of the icon for the given handle
 * returns a gamepad icon if a gamepad is connected
 * 
 * @param {String} handle the action handle e.g. 'ok'
 */
Window_Base.prototype.getHandlerIcon = function (handle) {
    let inputHandle = Input.handlers.find(arr => arr[0] === handle);
    return Input.getConnectedGamepad() ? this.getGamepadIcon(inputHandle[2]) : this.getKeyIcon(inputHandle[3]);
};

/**
 * Stats are drawn the same so this method can be called to draw any of them
 */
Window_Base.prototype.drawActorStat = function (statValue, x, y, width, align) {
    this.drawText(statValue, x, y, width, align);
};

/**
 * Draws a horizontal line across the window
 */
Window_Base.prototype.drawHorzLine = function (x, y, width = this.contentsWidth()) {
    this.contents.fillRect(x, y, width, 3, this.normalColor());
};

/**
 * Draws a vertical line across the window
 */
Window_Base.prototype.drawVertLine = function (x, y, height = this.contentsHeight()) {
    this.contents.fillRect(x, y, 3, height, this.normalColor());
};

/**
 * Dimmer covers the whole window and all contents
 */
Window_Base.prototype.showBackgroundDimmer = function () {
    if (!this._dimmerSprite) {
        this._dimmerSprite = new Sprite();
        this._dimmerSprite.bitmap = new Bitmap(0, 0);
        this.addChild(this._dimmerSprite);
    }
    var bitmap = this._dimmerSprite.bitmap;
    if (bitmap.width !== this.width || bitmap.height !== this.height) {
        this.refreshDimmerBitmap();
    }
    this._dimmerSprite.visible = true;
    this.updateBackgroundDimmer();
};

/**
 * Removed gradient from dimmer
 */
Window_Base.prototype.refreshDimmerBitmap = function () {
    if (this._dimmerSprite) {
        var bitmap = this._dimmerSprite.bitmap;
        var w = this.width;
        var h = this.height;
        var c1 = this.dimColor1();
        bitmap.resize(w, h);
        bitmap.fillRect(0, 0, w, h, c1);
        this._dimmerSprite.setFrame(0, 0, w, h);
    }
};

Window_Base.prototype.dimColor1 = function () {
    return 'rgba(0, 0, 0, 0.5)';
};

Window_Base.prototype.obtainEscapeParamString = function (textState) {
    var arr = /^\[\w+\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return arr[0].slice(1, -1);
    } else {
        return '';
    }
};

Window_Base.prototype.obtainEscapeParamFunc = function (textState) {
    var arr = /\[(.*?)\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        var context = window;
        var namespaces = arr[1].split(".");
        // var func = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context.apply(SceneManager._scene);
    } else {
        return '';
    }
};

//-----------------------------------------------------------------------------
// Window_Selectable
//-----------------------------------------------------------------------------

Window_Selectable.prototype.column = function () {
    return this.index() - (this.maxCols() * this.row());
};

Window_Selectable.prototype.maxPageRows = function () {
    let pageHeight = this.height 
            - (this.padding + this.extraPadding()) * 2
            - ((this.maxRows() - 1) * this.lineGap());
    return Math.floor(pageHeight / this.lineHeight());
};

Window_Selectable.prototype.itemRect = function (index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    var isBottomRow = index === this.bottomRow();
    var lineGap = this.lineGap();

    rect.width = this.itemWidth();
    rect.height = isBottomRow ? this.itemHeight() : this.itemHeight() + lineGap;

    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    var rectHeightOffset = isBottomRow ? rect.height + lineGap : rect.height;
    rect.y = Math.floor(index / maxCols) * rectHeightOffset - this._scrollY;
    return rect;
};

/**
 * width only subtracts textPadding once now
 */
Window_Selectable.prototype.itemRectForText = function (index) {
    var rect = this.itemRect(index);
    rect.x += this.textPadding();
    rect.width -= this.textPadding();
    return rect;
};

Window_Selectable.prototype.cursorDown = function () {
    let index = this.index();
    let nextIndex = index + this.maxCols();
    if (nextIndex < this.maxItems()) { // cursor can move down
        this.select(nextIndex);
    } else { // cursor must loop to top of list
        this.select(this.column());
    }
};

Window_Selectable.prototype.cursorUp = function () {
    let index = this.index();
    let nextIndex = index - this.maxCols();
    if (nextIndex > -1) { // cursor can move up
        this.select(nextIndex);
    } else { // cursor must loop to bottom of list
        let cols = this.maxCols();
        let items = this.maxItems();
        let bottomRow = Math.ceil(items / cols) - 1;
        nextIndex = (bottomRow * cols) + this.column(); // get index of item on bottom row (using current column)
        this.select(nextIndex < items ? nextIndex : nextIndex - cols); // if index is too far down list, go back up one
    }
};

Window_Selectable.prototype.cursorRight = function () {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    var oddAmount = maxItems % 2;
    if (maxCols >= 2 && !(oddAmount && index >= maxItems - 1)) {
        if (!(index % 2)) {
            this.select((index + 1) % maxItems);
        } else {
            this.select((index - 1 + maxItems) % maxItems);
        }
    }
};

Window_Selectable.prototype.cursorLeft = function () {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    var oddAmount = maxItems % 2;
    if (maxCols >= 2 && !(oddAmount && index >= maxItems - 1)) {
        if (index % 2) {
            this.select((index - 1 + maxItems) % maxItems);
        } else {
            this.select((index + 1) % maxItems);
        }
    }
};

Window_Selectable.prototype.isOkTriggered = function () {
    return Input.isTriggered('ok');
};

Window_Selectable.prototype.processHandling = function () {
    if (this.isOpenAndActive()) {
        if (this.isOkEnabled() && this.isOkTriggered()) {
            this.processOk();
        } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
            this.processCancel();
        } else {
            let handles = [
                ['help', true], 
                ['sort', false], 
                ['filter', false], 
                ['previous', false], 
                ['next', false], 
                ['pagedown', true], 
                ['pageup', true]
            ];
            handles.some(handle => {
                let type = handle[0];
                if (this.isHandled(type) && Input.isTriggered(type)) {
                    this.processHandler(type, handle[1]);
                }
            });
        }
    }
};

/**
 * @param {string} handler name of the handler to call
 * @param {boolean} deactivate should this handler deactivate the window
 */
Window_Selectable.prototype.processHandler = function (handler, deactivate) {
    this.updateInputData();
    if (deactivate) this.deactivate();
    this.callHandler(handler);
};

//-----------------------------------------------------------------------------
// Window_Command
//-----------------------------------------------------------------------------

Window_Command.prototype.updateWindowDisplay = function () {
    this._height = this.windowHeight();
    this._width = this.windowWidth();
    this._refreshAllParts();
    this.refresh();
};

//-----------------------------------------------------------------------------
// Window_ChoiceList
//-----------------------------------------------------------------------------

/**
 * Position the window on the screen
 * 0: left - in line with message window
 * 1: middle - in middle of message window
 * 2: right - in line with end of message window
 * 
 * windows Y position is just above/below message window
 * with a gap specified by plugin parameter: ChoiceList_ChoiceYOffset
 *
 * @gameMatch Custom
 */
Window_ChoiceList.prototype.updatePlacement = function () {
    var positionType = $gameMessage.choicePositionType();
    var messageY = this._messageWindow.y;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    switch (positionType) {
        case 0:
            this.x = this._messageWindow.x;
            break;
        case 1:
            this.x = (Graphics.boxWidth - this.width) / 2;
            break;
        case 2:
            this.x = (this._messageWindow.x + this._messageWindow.width) - this.width;
            break;
    }
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height - DQEng.Parameters.Windows.ChoiceList_ChoiceYOffset;
    } else {
        this.y = messageY + this._messageWindow.height + DQEng.Parameters.Windows.ChoiceList_ChoiceYOffset;
    }
};

Window_ChoiceList.prototype.lineGap = function () {
    return DQEng.Parameters.Windows.ChoiceList_LineGap;
};

Window_ChoiceList.prototype.contentsHeight = function () {
    return this.height - this.standardPadding() * 2;
};

Window_ChoiceList.prototype.updateOpen = function () {
    if (this._opening) {
        this.openness += 32;
        if (this.isOpen()) {
            this._opening = false;
        }
    }
};
