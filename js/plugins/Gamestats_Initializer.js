// Make renderer accessible so gstats can hook into it
Object.defineProperty(Graphics, 'renderer', {
    get: function() {
        return this._renderer;
    },
});

Graphics._createStats = function() {
    const pixiHooks = new GStats.PIXIHooks(this);
    this._stats = new GStats.StatsJSAdapter(pixiHooks);
    document.body.appendChild(this._stats.stats.dom || this._stats.stats.domElement);
    PIXI.ticker.shared.add(this._stats.update, this._stats, PIXI.UPDATE_PRIORITY.HIGH); // <-- ticker doesn't seem to work?
    this._stats.stats.showPanel(3); // 0: FPS, 1: MS, 2: MB, 3: Draw Calls, 4: Texture Count
}

SceneManager.requestUpdate = function () {
    if (!this._stopped) {
        Graphics._stats && Graphics._stats.update(); // calls gstats updater
        requestAnimationFrame(this.update.bind(this));
    }
};

Debug_Graphics_createAllElements = Graphics._createAllElements;
Graphics._createAllElements = function() {
    Debug_Graphics_createAllElements.call(this);
    this._createStats();
};