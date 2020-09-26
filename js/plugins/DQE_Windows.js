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
DQEng.Parameters.Windows.Base_LineGap = Number(parameters["Base Line Gap"]) || 8;
DQEng.Parameters.Windows.ChoiceList_LineGap = Number(parameters["Choice Line Gap"]) || 18;
DQEng.Parameters.Windows.ChoiceList_ChoiceYOffset = Number(parameters["Choice Y Offset"]) || 48;

//-----------------------------------------------------------------------------
// Window_Base
//-----------------------------------------------------------------------------

/**
 * Make windows opaque
 *
 * @gameMatch DQ1+2 SNES
 * @return {Number} opacity of windows
 */
Window_Base.prototype.standardBackOpacity = function () {
    return 255;
};

Window_Base.prototype.goldColor = function () {
    return this.textColor(6);
}

Window_Base.prototype.crisisColor = function () {
    return this.textColor(6);
};

Window_Base.prototype.deathColor = function () {
    return this.textColor(2);
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
    return numLines * this.lineHeight() + this.standardPadding() * 2 + (this.lineGap() * Math.max(numLines - 1, 0));
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
 * Stats are drawn the same so this method can be called to draw any of them
 */
Window_Base.prototype.drawActorStat = function (statValue, x, y, width, align) {
    this.drawText(statValue, x, y, width, align);
};

/**
 * Draws a horizontal line across the window
 */
Window_Base.prototype.drawHorzLine = function (x, y) {
    this.contents.fillRect(x, y, this.contentsWidth(), 3, this.normalColor());
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

//-----------------------------------------------------------------------------
// Window_Selectable
//-----------------------------------------------------------------------------

Window_Selectable.prototype.lineHeight = function () {
    return 21;
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
