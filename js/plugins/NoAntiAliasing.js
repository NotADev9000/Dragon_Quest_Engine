var noAlias_graphics_center_element = Graphics._centerElement;
Graphics._centerElement = function(element) {
    noAlias_graphics_center_element.apply(this, arguments);
    element.style["image-rendering"] = "pixelated";
    element.style["font-smooth"] = "none";
};

Sprite_Balloon.prototype.updateFrame = function() {
    var w = 32;
    var h = 24;
    var sx = this.frameIndex() * w;
    var sy = (this._balloonId - 1) * h;
    this.setFrame(sx, sy, w, h);
};