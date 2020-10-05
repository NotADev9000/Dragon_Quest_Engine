//-----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.

function Window_BattleActor() {
    this.initialize.apply(this, arguments);
}

Window_BattleActor.prototype = Object.create(Window_Selectable.prototype);
Window_BattleActor.prototype.constructor = Window_BattleActor;

Window_BattleActor.prototype.initialize = function(x, y) {
    Window_Selectable.prototype.initialize.call(this);
    this.x = x;
    this.y = y;
    this.openness = 255;
    this.hide();
};

Window_BattleActor.prototype.show = function() {
    this.select(0);
    Window_Selectable.prototype.show.call(this);
};

Window_BattleActor.prototype.hide = function() {
    Window_Selectable.prototype.hide.call(this);
    $gameParty.select(null);
};

Window_BattleActor.prototype.select = function(index) {
    Window_Selectable.prototype.select.call(this, index);
    $gameParty.select(this.actor());
};

Window_BattleActor.prototype.actor = function() {
    return $gameParty.members()[this.index()];
};
