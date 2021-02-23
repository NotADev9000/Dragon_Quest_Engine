//=============================================================================
// Dragon Quest Engine - Window Show Buffs
// DQE_Window_ShowBuffs.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Displays information about opening buff window - V0.1
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
Imported.DQEng_Window_ShowBuffs = true;

var DQEng = DQEng || {};
DQEng.Window_ShowBuffs = DQEng.Window_ShowBuffs || {};

//-----------------------------------------------------------------------------
// Window_ShowBuffs
//-----------------------------------------------------------------------------

function Window_ShowBuffs() {
    this.initialize.apply(this, arguments);
}

Window_ShowBuffs.prototype = Object.create(Window_Base.prototype);
Window_ShowBuffs.prototype.constructor = Window_ShowBuffs;

Window_ShowBuffs.prototype.initialize = function (x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.drawInfo();
};

Window_ShowBuffs.prototype.standardPadding = function () {
    return 15;
};

Window_ShowBuffs.prototype.drawInfo = function () {
    let icon = this.getHandlerIcon('help');
    let text = `\\i[${icon}] Show Buffs`;
    this.drawTextEx(text, 0, 12);
};
