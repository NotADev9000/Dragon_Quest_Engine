//=============================================================================
// Dragon Quest Engine - Multi Help Windows
// DQE_Multi_HelpWindows.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Allows for windows to contain multiple help windows - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Multi_HelpWindows = true;

var DQEng = DQEng || {};
DQEng.Multi_HelpWindows = DQEng.Multi_HelpWindows || {};

//-----------------------------------------------------------------------------
// Window_Selectable
//-----------------------------------------------------------------------------

DQEng.Multi_HelpWindows.initialize = Window_Selectable.prototype.initialize;
Window_Selectable.prototype.initialize = function (x, y, width, height) {
    DQEng.Multi_HelpWindows.initialize.call(this, x, y, width, height);
    this._helpWindow = [];
}

//////////////////////////////
// Functions - data
//////////////////////////////

Window_Selectable.prototype.setHelpWindow = function (helpWindow) {
    this._helpWindow.push(helpWindow);
    this.callUpdateSingleHelp(helpWindow);
};

// all help windows

Window_Selectable.prototype.callUpdateHelp = function () {
    if (this.active && this._helpWindow && this._helpWindow.length) {
        this.updateHelp();
    }
};

/**
 * updates all help windows' contents
 * this function should be overridden
 *
 * @param {Window_Base} helpWindow
 */
Window_Selectable.prototype.updateHelp = function () {
    this._helpWindow.forEach(helpWindow => {
        helpWindow.clear();
    });
};

Window_Selectable.prototype.setHelpWindowItem = function (item) {
    this._helpWindow.forEach(helpWindow => {
        helpWindow.setItem(item);
    });
};

// single help windows

Window_Selectable.prototype.callUpdateSingleHelp = function (helpWindow) {
    if (this.active) this.updateSingleHelp(helpWindow);
};

/**
 * updates a single help windows' contents
 * this function should be overridden
 * 
 * @param {Window_Base} helpWindow 
 */
Window_Selectable.prototype.updateSingleHelp = function (helpWindow) {
    helpWindow.clear();
};

Window_Selectable.prototype.setSingleHelpWindowItem = function (item, helpWindow) {
    helpWindow.setItem(item);
};

//////////////////////////////
// Functions - displaying
//////////////////////////////

Window_Selectable.prototype.showHelpWindow = function (index = 0) {
    if (this._helpWindow && this._helpWindow.length) {
        this._helpWindow[index].show();
    }
};

Window_Selectable.prototype.showAllHelpWindows = function () {
    if (this._helpWindow) {
        this._helpWindow.forEach(helpWindow => {
            helpWindow.show();
        });
    }
};

Window_Selectable.prototype.hideHelpWindow = function (index = 0) {
    if (this._helpWindow && this._helpWindow.length) {
        this._helpWindow[index].hide();
    }
};

Window_Selectable.prototype.hideAllHelpWindows = function () {
    if (this._helpWindow) {
        this._helpWindow.forEach(helpWindow => {
            helpWindow.hide();
        });
    }
};

//////////////////////////////
// Functions - dimmers
//////////////////////////////

Window_Selectable.prototype.showHelpWindowBackgroundDimmer = function (index = 0) {
    if (this._helpWindow && this._helpWindow.length) {
        this._helpWindow[index].showBackgroundDimmer();
    }
};

Window_Selectable.prototype.showAllHelpWindowBackgroundDimmers = function () {
    if (this._helpWindow) {
        this._helpWindow.forEach(helpWindow => {
            helpWindow.showBackgroundDimmer();
        });
    }
};

Window_Selectable.prototype.hideHelpWindowBackgroundDimmer = function (index = 0) {
    if (this._helpWindow && this._helpWindow.length) {
        this._helpWindow[index].hideBackgroundDimmer();
    }
};

Window_Selectable.prototype.hideAllHelpWindowBackgroundDimmers = function () {
    if (this._helpWindow) {
        this._helpWindow.forEach(helpWindow => {
            helpWindow.hideBackgroundDimmer();
        });
    }
};
