//=============================================================================
// Dragon Quest Engine - Window Base
// DQE_Window_Base.js
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The superclass of all windows within the game - V0.1
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
Imported.DQEng_Window_Base = true;

//-----------------------------------------------------------------------------
// Window_Base
//-----------------------------------------------------------------------------

Window_Base._iconWidth = 45;
Window_Base._iconHeight = 45;

Window_Base.prototype.textPadding = function () {
    return 18;
};

/**
 * Make windows opaque
 *
 * @gameMatch DQ1+2 SNES
 * @return {Number} opacity of windows
 */
Window_Base.prototype.standardBackOpacity = function () {
    return 255;
};

/**
 * Format Gold amount when displayed in a window
 * e.g. 10000 becomes 10,000
 */
Window_Base.prototype.drawCurrencyValue = function (value, unit, x, y, width) {
    const unitWidth = 24;
    const currencyUnitX = width - unitWidth;

    if (value > 9999) value = value.toLocaleString();
    this.drawText(value, x, y, currencyUnitX - 24, 'right');
    this.changeTextColor(this.currencyColor(unit));
    this.drawText(unit, currencyUnitX, y, unitWidth, 'right');
    this.resetTextColor();
};

Window_Base.prototype.currencyColor = function (unit) {
    switch (unit) {
        case TextManager.medalUnit:
            return this.medalColor();
        default:
            return this.goldColor();
    }
};

Window_Base.prototype.completeSkillSetColor = function () {
    return this.goldColor();
};

Window_Base.prototype.unlockedSkillLayerColor = function () {
    return this.textColor(8);
};

Window_Base.prototype.lockedSkillLayerColor = function () {
    return this.textColor(2);
};

Window_Base.prototype.medalColor = function () {
    return this.textColor(4);
};

Window_Base.prototype.goldColor = function () {
    return this.textColor(6);
};

Window_Base.prototype.crisisColor = function () {
    return this.textColor(6);
};

Window_Base.prototype.deathColor = function () {
    return this.textColor(2);
};

Window_Base.prototype.disabledColor = function () {
    return this.textColor(16);
};

Window_Base.prototype.statColor = function () {
    return this.textColor(10);
};

Window_Base.prototype.statEquipColor = function () {
    return this.textColor(2);
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
 */
Window_Base.prototype.lineGap = function () {
    return 15;
};

Window_Base.prototype.itemHeight = function () {
    return this.lineHeight() + this.lineGap();
};

Window_Base.prototype.fittingHeight = function (numLines) {
    return numLines * this.lineHeight()
        + (this.standardPadding() + this.extraPadding()) * 2
        + (this.lineGap() * Math.max(numLines - 1, 0));
};

/**
 * This method is used for calculating the height of windows
 * with an extra block (a horizontal rule with a seperate section e.g. descriptions)
 * 
 * ~ Doesn't call 'fittingHeight' with 'this.fittingHeight' as that function is overwritten
 *   in inherited windows
 */
Window_Base.prototype.fittingHeightExtraBlock = function (numLines) {
    return Window_Base.prototype.fittingHeight.call(this, numLines) + this.extraBlockHeight();
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
    return this.itemHeight();
};

/**
 * calculates where on the y-axis icon should sit
 */
Window_Base.prototype.calcIconCentre = function () {
    return (Window_Base._iconHeight - this.lineHeight()) / 2;
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
 * draws icon of provided handle
 * can also draw text before & after icon
 */
Window_Base.prototype.drawHandlerAsIcon = function (handle, x, y, preText = '', postText = '', extraConvert = true, autoWrap = true) {
    const icon = this.getHandlerIcon(handle);
    const text = `${preText}\\i[${icon}]${postText}`;
    this.drawTextEx(text, x, y, extraConvert, autoWrap);
};

/**
 * draws two icons at the left & right edge of the window
 * 
 * @param {Array} handles the array of String handles to draw as icons
 * @param {number} y the y position of the icons when drawn
 */
Window_Base.prototype.drawIconsAtEdges = function (handles, y) {
    // LEFT ICON
    let x = this.extraPadding();
    this.drawHandlerAsIcon(handles[0], x, y);
    // RIGHT ICON
    x = this.contentsWidth() - Window_Base._iconWidth - x;
    this.drawHandlerAsIcon(handles[1], x, y);
};

Window_Base.prototype.drawPreviousNextAtEdges = function (y) {
    const handles = ["previous", "next"];
    this.drawIconsAtEdges(handles, y);
};

Window_Base.prototype.drawPageUpDownAtEdges = function (y) {
    const handles = ["pagedown", "pageup"];
    this.drawIconsAtEdges(handles, y);
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

/**
 * returns an array of parameters that the passed in item changes when equipped
 * 
 * @param {$dataWeapons | $dataArmors} item check the stats that this item changes
 * @param {Boolean} equipped is this item equipped by actor
 */
Window_Base.prototype.makeItemStats = function (item, equipped = false) {
    stats = [];
    if (item) {
        // default params
        item.params.forEach((param, index) => {
            if (param !== 0) stats.push({
                code: Game_BattlerBase.TRAIT_PARAM,
                dataId: index,
                value: param
            });
        });
        // meta params
        if (item.meta.charm) stats.push({
            code: Game_BattlerBase.TRAIT_PARAM,
            dataId: Game_BattlerBase.POS_PARAM_CHARM,
            value: Number(item.meta.charm)
        });
        // xparams/sparams/states
        stats = stats.concat(item.traits.filter(trait => {
            return trait.code === Game_BattlerBase.TRAIT_STATE_RATE ||
                trait.code === Game_BattlerBase.TRAIT_PARAM ||
                trait.code === Game_BattlerBase.TRAIT_XPARAM ||
                trait.code === Game_BattlerBase.TRAIT_SPARAM
        })).concat(Game_Actor.prototype.metaTraits.call(this, item.meta));
    }
    // equipped check
    stats.forEach(stat => stat.equipped = equipped);
    return stats;
};

/**
 * returns an array of copies of the equipment that would be replaced when giving an actor new equipment
 */
Window_Base.prototype.getReplaceEquipment = function (twoHand, actor, slot) {
    let replaceEquipment = []; // holds the equipment that would be swapped out
    if (twoHand) { // if new item is two-handed then get items in both slots it occupies
        replaceEquipment.push(JsonEx.makeDeepCopy(actor.equips()[0]));
        replaceEquipment.push(JsonEx.makeDeepCopy(actor.equips()[1]));
    } else { // if new item isn't two-handed then just get the item that would be replaced
        replaceEquipment.push(JsonEx.makeDeepCopy(actor.getItemInSlot(slot)));
    }
    return replaceEquipment;
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
    let arr = /\[(.*?)\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        let context = window;
        const namespaces = arr[1].split(",");
        const params = namespaces.pop();
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context.apply(SceneManager._scene, [params]);
    } else {
        return '';
    }
};
