//=============================================================================
// Dragon Quest Engine - Graphics
// DQE_Graphics.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc SThe static class that carries out graphics processing - V0.1
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var Imported = Imported || {};
Imported.DQEng_Graphics = true;

var DQEng = DQEng || {};
DQEng.Graphics = DQEng.Graphics || {};

//-----------------------------------------------------------------------------
// Graphics
//-----------------------------------------------------------------------------

DQEng.Graphics.initialize = Graphics.initialize;
Graphics.initialize = function (width, height, type) {
    this._availWidth = window.screen.availWidth;
    this._availHeight = window.screen.availHeight;
    DQEng.Graphics.initialize.call(this, width, height, type);
};

/**
 * @static
 * @method _switchFullScreen
 * @private
 */
Graphics._switchFullScreen = function () {
    ConfigManager.fullscreen = this._isFullScreen() ? 0 : 1;
    if (SceneManager._scene instanceof Scene_Settings) {
        SceneManager._scene.onFullscreenChange();
    }
};

Graphics._scaleWindow = function (value) {
    if (!this._isFullScreen()) {
        let newWidth = 480 * value;
        let newHeight = 270 * value;
        window.resizeBy(newWidth - window.innerWidth, newHeight - window.innerHeight);
        let x = (this._availWidth - window.outerWidth)/2;
        let y = (this._availHeight - window.outerHeight) / 2;
        window.moveTo(x, y);
    }
};
