//=============================================================================
// Dragon Quest Engine - Window Number
// DQE_Window_Number.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for selecting a numeric value - V0.1
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
Imported.DQEng_Window_Number = true;

var DQEng = DQEng || {};
DQEng.Window_Number = DQEng.Window_Number || {};

//-----------------------------------------------------------------------------
// Window_Number
//-----------------------------------------------------------------------------

function Window_Number() {
    this.initialize.apply(this, arguments);
}

Window_Number.prototype = Object.create(Window_Selectable.prototype);
Window_Number.prototype.constructor = Window_Number;

Window_Number.prototype.initialize = function (x, y, title, numMin, numMax) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._number = 1;
    this._title = title;
    this.setMin(numMin);
    this.setMax(numMax);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_Number.prototype.windowHeight = function () {
    return 69;
};

Window_Number.prototype.windowWidth = function () {
    return 363;
};

Window_Number.prototype.standardPadding = function () {
    return 9;
};

Window_Number.prototype.extraPadding = function () {
    return 15;
};

//////////////////////////////
// Functions - numbers
//////////////////////////////

Window_Number.prototype.number = function () {
    return this._number;
}

Window_Number.prototype.setup = function (min, max) {
    this.setMin(min);
    this.setMax(max);
    this._number = this._numMin;
    this.refresh();
};

Window_Number.prototype.setMin = function (num) {
    this._numMin = num;
}

Window_Number.prototype.setMax = function (num) {
    this._numMax = num;
}

Window_Number.prototype.changeNumber = function (amount) {
    var lastNumber = this._number;
    this._number = (this._number + amount).clamp(this._numMin, this._numMax);
    if (this._number !== lastNumber) {
        this.refresh();
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_Number.prototype.drawTitle = function () {
    var pos = this.extraPadding();
    this.resetTextColor();
    this.drawText(this._title, pos, pos, this.textWidth(this._title));
}

Window_Number.prototype.drawMultiplicationSign = function () {
    var sign = 'x';
    var x = 258;
    var y = this.extraPadding();
    this.resetTextColor();
    this.drawText(sign, x, y, this.textWidth(sign));
};

Window_Number.prototype.drawNumber = function () {
    var num = String(this._number).padStart(2, '0');
    var x = 282;
    var y = this.extraPadding();
    this.resetTextColor();
    this.drawText(num, x, y, this.textWidth(num));
};

//////////////////////////////
// Functions - controls
//////////////////////////////

Window_Number.prototype.processNumberChange = function () {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated('right')) {
            this.changeNumber(10);
        }
        if (Input.isRepeated('left')) {
            this.changeNumber(-10);
        }
        if (Input.isRepeated('up')) {
            this.changeNumber(1);
        }
        if (Input.isRepeated('down')) {
            this.changeNumber(-1);
        }
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_Number.prototype.refresh = function () {
    if (this.contents) {
        this.contents.clear();
        this.drawTitle();
        this.drawVertLine(243, 0);
        this.drawMultiplicationSign();
        this.drawNumber();
    }
};

Window_Number.prototype.update = function () {
    Window_Selectable.prototype.update.call(this);
    this.processNumberChange();
};
