//=============================================================================
// Dragon Quest Engine - Text Auto Word Wrap
// DQE_Text_Autowrapping.js
//=============================================================================

/*:
*
* @author Yanfly Engine Plugins (edited by NotADev)
* @plugindesc The logic for autowrapping text in windows - V0.1
*
*
* @help
* TODO: Look into why textWidthExCheck prevents sfonts from coloring correctly
* 
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Text_Autowrapping = true;

var DQEng = DQEng || {};
DQEng.Text_Autowrapping = DQEng.Text_Autowrapping || {};

//-----------------------------------------------------------------------------
// Text_Autowrapping
//-----------------------------------------------------------------------------

Window_Base.prototype.drawTextEx = function (text, x, y, extraConvert = true, autoWrap = true) {
    if (text) {
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(text, extraConvert);
        textState.height = this.calcTextHeight(textState, false);
        this.resetFontSettings();
        while (textState.index < textState.text.length) {
            this.processCharacter(textState, autoWrap);
        }
        return textState.x - x;
    } else {
        return 0;
    }
};

DQEng.Text_Autowrapping.convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function (text, extraConvert = false) {
    if (extraConvert) {
        text = text.replace(/[\n\r]+/g, ' ');
        text = text.replace(/<(?:BR|line break)>/gi, '\n');
    }
    text = DQEng.Text_Autowrapping.convertEscapeCharacters.call(this, text);
    return text;
};

Window_Base.prototype.processCharacter = function (textState, autoWrap = false) {
    switch (textState.text[textState.index]) {
        case '\n':
            this.processNewLine(textState);
            break;
        case '\f':
            this.processNewPage(textState);
            break;
        case '\x1b':
            this.processEscapeCharacter(this.obtainEscapeCode(textState), textState);
            break;
        default:
            this.processNormalCharacter(textState, autoWrap);
            break;
    }
};

DQEng.Text_Autowrapping.processNormalCharacter = Window_Base.prototype.processNormalCharacter;
Window_Base.prototype.processNormalCharacter = function (textState, autoWrap = false) {
    if (autoWrap && this.checkWordWrap(textState)) return this.processNewLine(textState);
    DQEng.Text_Autowrapping.processNormalCharacter.call(this, textState);
};

Window_Base.prototype.checkWordWrap = function (textState) {
    if (!textState) return false;
    if (textState.text[textState.index] === ' ') {
        var nextSpace = textState.text.indexOf(' ', textState.index + 1);
        var nextBreak = textState.text.indexOf('\n', textState.index + 1);
        if (nextSpace < 0) nextSpace = textState.text.length + 1;
        if (nextBreak > 0) nextSpace = Math.min(nextSpace, nextBreak);
        var word = textState.text.substring(textState.index, nextSpace);
        var size = this.textWidthEx(word);
    }
    return (size + textState.x > this.wordwrapWidth());
};

Window_Base.prototype.wordwrapWidth = function () {
    var extraPad = (this.extraPadding() || 0) * 2;
    return this.contents.width - extraPad;
};

// Window_Base.prototype.textWidthExCheck = function (text) {
//     var value = this.drawTextEx(text, 0, this.contents.height, true, false);
//     return value;
// };
