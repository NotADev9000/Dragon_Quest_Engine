//=============================================================================
// Dragon Quest Engine - Window Actor Command
// DQE_Window_ActorCommand.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Static class for managing the battle - V0.1
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
Imported.DQEng_Window_ActorCommand = true;

var DQEng = DQEng || {};
DQEng.Window_ActorCommand = DQEng.Window_ActorCommand || {};

//-----------------------------------------------------------------------------
// Window_ActorCommand
//-----------------------------------------------------------------------------

function Window_ActorCommand() {
    this.initialize.apply(this, arguments);
}

Window_ActorCommand.prototype = Object.create(Window_TitledCommand.prototype);
Window_ActorCommand.prototype.constructor = Window_ActorCommand;

Window_ActorCommand.prototype.initialize = function (x, y, windowWidth) {
    Window_TitledCommand.prototype.initialize.call(this, x, y, windowWidth);
    this.openness = 0;
    this.deactivate();
    this._actor = null;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_ActorCommand.prototype.lineGap = function () {
    return 27;
};

Window_ActorCommand.prototype.maxCols = function () {
    return 2;
};

Window_ActorCommand.prototype.numVisibleRows = function () {
    return 3;
};

Window_ActorCommand.prototype.spacing = function () {
    return 24;
};

Window_ActorCommand.prototype.itemWidth = function () {
    return 144;
};

//////////////////////////////
// Functions - commands
//////////////////////////////

Window_ActorCommand.prototype.makeWindowTitle = function () {
    this._menuTitle = this._actor._name;
}

Window_ActorCommand.prototype.makeCommandList = function () {
    if (this._actor) {
        this.addAttackCommand();
        this.addSkillCommands();
        this.addItemCommand();
        this.addGuardCommand();
        this.addEquipmentCommand();
    }
};

Window_ActorCommand.prototype.addAttackCommand = function () {
    this.addCommand(TextManager.attack, 'Attack', this._actor.canAttack());
};

Window_ActorCommand.prototype.addSkillCommands = function () {
    var skillTypes = this._actor.addedSkillTypes();
    skillTypes.sort(function (a, b) {
        return a - b;
    });
    skillTypes.forEach(function (stypeId) {
        var name = $dataSystem.skillTypes[stypeId];
        this.addCommand(name, 'Skill', true, stypeId);
    }, this);
};

Window_ActorCommand.prototype.addGuardCommand = function () {
    this.addCommand(TextManager.guard, 'Guard', this._actor.canGuard());
};

Window_ActorCommand.prototype.addItemCommand = function () {
    this.addCommand(TextManager.item, 'Item');
};

Window_ActorCommand.prototype.addEquipmentCommand = function () {
    this.addCommand(TextManager.equip, 'Equipment');
};

Window_ActorCommand.prototype.isCurrentItemEnabled = function () {
    return this.isEnabled(this.currentSymbol());
};

Window_ActorCommand.prototype.isEnabled = function (symbol) {
    switch (symbol) {
        case 'Skill':
            return this._actor.skills().find(function (skill) {
                return skill.stypeId === this.currentExt();
            }, this) != undefined;
        case 'Item':
            return this._actor.items().length > 0;
        default:
            return true;
    }
};

//////////////////////////////
// Functions - settings
//////////////////////////////

Window_ActorCommand.prototype.processOk = function () {
    if (this._actor) {
        if (ConfigManager.commandRemember) {
            this._actor.setLastCommandSymbol(this.currentSymbol());
        } else {
            this._actor.setLastCommandSymbol('');
        }
    }
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.updateInputData();
        this.deactivate();
        this.callHandler('Disabled');
    }
};

Window_ActorCommand.prototype.setup = function (actor) {
    this._actor = actor;
    this.makeWindowTitle();
    this.clearCommandList();
    this.makeCommandList();
    this.refresh();
    this.selectLast();
    this.activate();
    this.open();
    this.show();
};

Window_ActorCommand.prototype.selectLast = function () {
    this.select(0);
    if (this._actor && ConfigManager.commandRemember) {
        var symbol = this._actor.lastCommandSymbol();
        this.selectSymbol(symbol);
        if (symbol === 'Skill') {
            var skill = this._actor.lastBattleSkill();
            if (skill) {
                this.selectExt(skill.stypeId);
            }
        }
    }
};
