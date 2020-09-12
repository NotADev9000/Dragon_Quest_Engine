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
* @param Selectable Line Gap
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
DQEng.Parameters.Windows.Selectable_LineGap = Number(parameters["Selectable Line Gap"]) || 8;
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

//-----------------------------------------------------------------------------
// Window_Selectable
//-----------------------------------------------------------------------------

Window_Selectable.prototype.lineHeight = function () {
    return 21;
};

/**
 * The height of the gap between each line of text
 * 
 * @gameMatch custom
 */
Window_Selectable.prototype.lineGap = function () {
    return DQEng.Parameters.Windows.Selectable_LineGap;
};

Window_Selectable.prototype.fittingHeight = function (numLines) {
    return numLines * this.lineHeight() + this.standardPadding() * 2 + (this.lineGap() * Math.max(numLines - 1, 0));
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
