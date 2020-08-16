/*
 * ==============================================================================
 * ** Victor Engine MV - Basic Module
 * ------------------------------------------------------------------------------
 *  VE_BasicModule.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Basic Module'] = '1.23';

var VictorEngine = VictorEngine || {};
VictorEngine.BasicModule = VictorEngine.BasicModule || {};

(function() {

    VictorEngine.BasicModule.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        VictorEngine.BasicModule.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Basic Module');
    };

    PluginManager.requiredPlugin = function(name, required, version) {
        VictorEngine.BasicModule.checkPlugins(name, required, version);
    };

})();

/*:
 * ==============================================================================
 * @plugindesc v1.23 - Plugin with base code required for all Victor Engine plugins.
 * @author Victor Sant
 *
 * @param == Trait Names ==
 *
 * @param Hit Rate Name
 * @desc 'Hit Rate' Ex-Parameter name shown on windows.
 * @default Hit
 *
 * @param Evasion Rate Name
 * @desc 'Evasion Rate' Ex-Parameter name shown on windows.
 * @default Evasion 
 *
 * @param Critical Rate Name
 * @desc 'Critical Rate' Ex-Parameter name shown on windows.
 * @default Critical
 *
 * @param Critical Evasion Name
 * @desc 'Critical Evasion' Ex-Parameter name shown on windows.
 * @default C. Evasion
 *
 * @param Magic Evasion Name
 * @desc 'Magic Evasion' Ex-Parameter name shown on windows.
 * @default M. Evasion
 *
 * @param Magic Reflection Name
 * @desc 'Magic Reflection' Ex-Parameter name shown on windows.
 * @default M. Reflection
 *
 * @param Counter Attack Name
 * @desc 'Counter Attack' Ex-Parameter name shown on windows.
 * @default Counter
 *
 * @param HP Regeneration Name
 * @desc 'HP Regeneration' Ex-Parameter name shown on windows.
 * @default HP Regen
 *
 * @param MP Regeneration Name
 * @desc 'MP Regeneration' Ex-Parameter name shown on windows.
 * @default MP Regen
 *
 * @param TP Regeneration Name
 * @desc 'TP Regeneration' Ex-Parameter name shown on windows.
 * @default TP Regen
 *
 * @param Target Rate Name
 * @desc 'Target Rate' Sp-Parameter name shown on windows.
 * @default Target Rate
 *
 * @param Guard Rate Name
 * @desc 'Guard Rate' Sp-Parameter name shown on windows.
 * @default Guard Rate
 *
 * @param Recovery Effect Name
 * @desc 'Recovery Effect' Sp-Parameter name shown on windows.
 * @default Recovery
 *
 * @param Pharmacology Name
 * @desc 'Pharmacology' Sp-Parameter name shown on windows.
 * @default Pharmacology
 *
 * @param MP Cost Rate Name
 * @desc 'MP Cost Rate' Sp-Parameter name shown on windows.
 * @default MP Cost
 *
 * @param TP Charge Rate Name
 * @desc 'TP Charge Rate' Sp-Parameter name shown on windows.
 * @default TP Charge
 *
 * @param Physical Damage Name
 * @desc 'Physical Damage' Sp-Parameter name shown on windows.
 * @default Physical Damage
 *
 * @param Magical Damage Name
 * @desc 'Magical Damage' Sp-Parameter name shown on windows.
 * @default Magical Damage
 *
 * @param Floor Damage Name
 * @desc 'Floor Damage' Sp-Parameter name shown on windows.
 * @default Floor Damage
 *
 * @param Experience Rate Name
 * @desc 'Experience Rate' Sp-Parameter name shown on windows.
 * @default Exp. Rate
 *
 * ==============================================================================
 * @help 
 * ==============================================================================
 * Install this plugin above any other Victor Engine plugin.
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2015.11.26 > First release.
 *  v 1.01 - 2015.11.29 > Added function to get database objects.
 *  v 1.02 - 2015.12.07 > Added function to get multiples elements.
 *                      > Added check for plugin correct order.
 *  v 1.03 - 2015.12.13 > Added function to get page comments.
 *  v 1.04 - 2015.12.21 > Added function to check only relevant objects.
 *  v 1.05 - 2015.12.25 > Added check to wait bitmap loading.
 *  v 1.06 - 2015.12.31 > Added rgb to hex and hex to rgb functions.
 *                      > Added function to get plugins parameters.     
 *  v 1.07 - 2016.01.07 > Fixed issue with plugin order checks.
 *  v 1.08 - 2016.01.17 > Added function to get BattleLog method index.
 *                      > Added function to insert methods on BattleLog.
 *  v 1.09 - 2016.01.24 > Added function to set wait for animations.
 *  v 1.10 - 2016.02.05 > Added function to get values from regex.
 *  v 1.11 - 2016.02.10 > Added function to capitalize texts.
 *                      > Added Plugin Parameter to set trait display names.
 *  v 1.12 - 2016.02.18 > Added function to get parameter names.
 *  v 1.13 - 2016.02.26 > Added functions to setup battler direction.
 *  v 1.14 - 2016.03.15 > Added functions to check opponents.
 *  v 1.15 - 2016.03.18 > Added function for compatibility with YEP.
 *  v 1.16 - 2016.03.23 > Added function to replace mathods.
 *                        Added functions for dynamic motions.
 *  v 1.17 - 2016.04.01 > Fixed issue with battler sprite check.
 *  v 1.18 - 2016.04.21 > Fixed issue with damage popup on action user.
 *  v 1.19 - 2016.04.30 > Added function to get evaluated font color.
 *  v 1.20 - 2016.05.12 > Added function to get width of text with escape codes.
 *  v 1.21 - 2016.05.31 > Improved method stack for dynamic motions.
 *                      > Added functions for compatibility with Battle Motions.
 *  v 1.22 - 2016.06.26 > Added functions for escape command.
 *  v 1.23 - 2017.05.25 > Added functions for damage formula.
 * ===============================================================================
 */

(function() {

    //=============================================================================
    // Parameters
    //=============================================================================

    VictorEngine.getPluginParameters = function() {
        var script = document.currentScript || (function() {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        var start = script.src.lastIndexOf('/') + 1;
        var end = script.src.indexOf('.js');
        return PluginManager.parameters(script.src.substring(start, end));
    }

    var parameters = VictorEngine.getPluginParameters();
    VictorEngine.Parameters = VictorEngine.Parameters || {};
    VictorEngine.Parameters.BasicModule = {};
    VictorEngine.Parameters.BasicModule.hit = String(parameters["Hit Rate Name"]).trim();
    VictorEngine.Parameters.BasicModule.eva = String(parameters["Evasion Rate Name"]).trim();
    VictorEngine.Parameters.BasicModule.cri = String(parameters["Critical Rate Name"]).trim();
    VictorEngine.Parameters.BasicModule.cev = String(parameters["Critical Evasion Name"]).trim();
    VictorEngine.Parameters.BasicModule.hev = String(parameters["Magic Evasion Name"]).trim();
    VictorEngine.Parameters.BasicModule.mrf = String(parameters["Magic Reflection Name"]).trim();
    VictorEngine.Parameters.BasicModule.cnt = String(parameters["Counter Attack Name"]).trim();
    VictorEngine.Parameters.BasicModule.hrg = String(parameters["HP Regeneration Name"]).trim();
    VictorEngine.Parameters.BasicModule.mrg = String(parameters["MP Regeneration Name"]).trim();
    VictorEngine.Parameters.BasicModule.trg = String(parameters["TP Regeneration Name"]).trim();
    VictorEngine.Parameters.BasicModule.tgr = String(parameters["Target Rate Name"]).trim();
    VictorEngine.Parameters.BasicModule.grd = String(parameters["Guard Rate Name"]).trim();
    VictorEngine.Parameters.BasicModule.rec = String(parameters["Recovery Effect Name"]).trim();
    VictorEngine.Parameters.BasicModule.pha = String(parameters["Pharmacology Name"]).trim();
    VictorEngine.Parameters.BasicModule.mcr = String(parameters["MP Cost Rate Name"]).trim();
    VictorEngine.Parameters.BasicModule.tcr = String(parameters["TP Charge Rate Name"]).trim();
    VictorEngine.Parameters.BasicModule.pdr = String(parameters["Physical Damage Name"]).trim();
    VictorEngine.Parameters.BasicModule.mdr = String(parameters["Magical Damage Name"]).trim();
    VictorEngine.Parameters.BasicModule.fdr = String(parameters["Floor Damage"]).trim();
    VictorEngine.Parameters.BasicModule.ext = String(parameters["Experience"]).trim();

    //=============================================================================
    // DataManager
    //=============================================================================

    VictorEngine.BasicModule.isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!VictorEngine.BasicModule.isDatabaseLoaded.call(this)) return false;
        VictorEngine.loadParameters();
        VictorEngine.loadNotetags();
        return ImageManager.isReady();
    };

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.BasicModule.checkPlugins = function(name, req, ver) {
        var msg = '';
        this.loadedPlugins = this.loadedPlugins || {};
        if (ver && req && (!Imported[req] || Number(Imported[req]) < Number(ver))) {
            msg += 'The plugin ' + name + ' requires the plugin ' + req;
            msg += ' v' + ver + ' or higher installed to work properly'
            if (Number(Imported[req]) < Number(ver)) {
                msg += '. Your current version is v' + Imported[req];
            }
            msg += '. Go to http://victorenginescripts.wordpress.com/'
            msg += ' to download the updated plugin.';
            throw msg;
        } else if (!ver && req && this.loadedPlugins[req] === true) {
            msg += 'The plugin ' + name + ' requires the plugin ' + req;
            msg += ' to be placed bellow it. Open the Plugin Manager and place';
            msg += ' the plugins in the correct order.';
            throw msg;
        } else if (req && Imported['VE - Basic Module'] && !this.loadedPlugins['VE - Basic Module']) {
            msg += 'The plugin ' + name + ' must be placed bellow the plugin ' + req;
            msg += '. Open the Plugin Manager and place';
            msg += ' the plugins in the correct order.';
            throw msg;
        } else {
            this.loadedPlugins[name] = true
        }
    };

    VictorEngine.loadNotetags = function() {
        if (VictorEngine.BasicModule.loaded) return;
        VictorEngine.BasicModule.loaded = true;
        var list = [$dataActors, $dataClasses, $dataSkills, $dataItems, $dataWeapons,
            $dataArmors, $dataEnemies, $dataStates
        ];
        list.forEach(function(objects, index) {
            this.processNotetags(objects, index)
        }, this);
    };

    VictorEngine.processNotetags = function(objects, index) {
        objects.forEach(function(data) {
            if (data) {
                this.loadNotetagsValues(data, index);
            }
        }, this);
    };

    VictorEngine.objectSelection = function(index, list) {
        var objects = ['actor', 'class', 'skill', 'item', 'weapon', 'armor', 'enemy', 'state'];
        return list.contains(objects[index]);
    };

    VictorEngine.loadNotetagsValues = function(data, index) {};

    VictorEngine.loadParameters = function() {};

    VictorEngine.getNotesValues = function(value1, value2) {
        value2 = value2 || value1;
        return new RegExp('<' + value1 + '>([\\s\\S]*?)<\\/' + value2 + '>', 'gi');
    };

    VictorEngine.getPageNotes = function(event) {
        var result = (event instanceof Game_CommonEvent) || event.page();
        if (!result || !event.list()) {
            return "";
        }
        return event.list().reduce(function(r, cmd) {
            var valid = (cmd.code === 108 || cmd.code === 408);
            var comment = valid ? cmd.parameters[0] + "\r\n" : "";
            return r + comment;
        }, "");
    };

    VictorEngine.getAllElements = function(subject, action) {
        if (action.item().damage.elementId < 0) {
            return subject.attackElements();
        } else {
            return [action.item().damage.elementId];
        }
    };

    VictorEngine.getAllStates = function(subject, item) {
        var result;
        return item.effects.reduce(function(r, effect) {
            if (effect.code === 21) {
                if (effect.dataId === 0) {
                    result = subject.attackStates();
                } else {
                    result = [effect.dataId];
                };
            } else {
                result = [];
            };
            return r.concat(result);
        }, []);
    };

    VictorEngine.getDamageFormula = function(action) {
		return action.item().damage.formula;
    };

    VictorEngine.getNumberValue = function(match, type, base) {
        var regex = new RegExp(type + '[ ]*:[ ]*([+-.\\d]+)', 'gi');
        var value = regex.exec(match);
        return value ? Number(value[1]) : base;
    };

    VictorEngine.getStringValue = function(match, type, base) {
        var regex = new RegExp(type + "[ ]*:[ ]*([\\w ]+)", 'gi');
        var value = regex.exec(match);
        return value ? value[1].trim() : base;
    };

    VictorEngine.getAnyValue = function(match, type, base) {
        var regex = new RegExp(type + "[ ]*:[ ]*('[^\']+'|\"[^\"]+\")", 'gi');
        var value = regex.exec(match);
        return value ? value[1].slice(1, -1) : base;
    };

    VictorEngine.getNumberValues = function(match, type) {
        var regex = new RegExp(type + '[ ]*:[ ]*((?:[+-.\\d]+[ ]*,?[ ]*)+)', 'gi');
        var value = regex.exec(match);
        var result = value ? value[1].match(/\d+/gi) : [];
        return result.map(function(id) {
            return Number(id)
        });
    };

    VictorEngine.getStringValues = function(match, type) {
        var regex = new RegExp(type + '[ ]*:[ ]*((?:[\\w ]+[ ]*,?[ ]*)+)', 'gi');
        var value = regex.exec(match);
        var result = value ? value[1].match(/\d+/gi) : [];
        return result.map(function(id) {
            return value[1].trim()
        });
    };

    VictorEngine.captalizeText = function(text) {
        return text.replace(/(?:^|\s)\S/g, function(a) {
            return a.toUpperCase();
        });
    };

    VictorEngine.replaceZeros = function(text, value) {
        value = value || '';
        return text.replace(/\b(0(?!\b))+/g, function(a) {
            return a.replace(/0/g, value);
        });
    };

    VictorEngine.rgbToHex = function(r, g, b) {
        r = Math.floor(r).toString(16).padZero(2);
        g = Math.floor(g).toString(16).padZero(2);
        b = Math.floor(b).toString(16).padZero(2);
        return '#' + r + g + b;
    }

    VictorEngine.hexToRgb = function(hex) {
        var r = parseInt(hex[1] + hex[2], 16);
        var g = parseInt(hex[3] + hex[4], 16);
        var b = parseInt(hex[5] + hex[6], 16);
        return [r, g, b];
    }

    VictorEngine.methodIndex = function(methods, name) {
        for (var i = 0; i < methods.length; i++) {
            if (methods[i] && methods[i].name === name) {
                return i;
            }
        }
        return null;
    }

    VictorEngine.removeMethod = function(methods, name) {
        var index = this.methodIndex(methods, name);
        if (index || index === 0) {
            methods.splice(index, 1);
        }
    }

    VictorEngine.insertMethod = function(methods, index, name, params) {
        if (index || index === 0) {
            methods.splice(index, 0, {
                name: name,
                params: params
            });
        }
    }

    VictorEngine.replaceMethod = function(methods, index, name, params) {
        if (index || index === 0) {
            methods.splice(index, 1, {
                name: name,
                params: params
            });
        }
    }

    VictorEngine.waitAnimation = function(animationId) {
        var animation = $dataAnimations[animationId];
        return animation ? animation.frames.length * 4 + 1 : 0;
    };

    VictorEngine.params = function() {
        return ['hp', 'mp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];
    };

    VictorEngine.xparams = function() {
        return ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'];
    };

    VictorEngine.sparams = function() {
        return ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'prd', 'mrd', 'frd', 'exr'];
    };

    VictorEngine.allParams = function() {
        return this.params().concat(this.xparams(), this.sparams())
    };

    VictorEngine.paramName = function(paramId) {
        return this.params()[paramId];
    };

    VictorEngine.xparamName = function(xparamId) {
        return this.xparams()[xparamId];
    };

    VictorEngine.sparamName = function(sparamId) {
        return this.sparams()[sparamId];
    };

    VictorEngine.paramId = function(paramName) {
        return this.params().indexOf(paramName.toLowerCase());
    };

    VictorEngine.paramText = function(name) {
        switch (name.toLowerCase()) {
            case 'hit':
            case 'eva':
            case 'cri':
            case 'cev':
            case 'mev':
            case 'mrf':
            case 'cnt':
            case 'hrg':
            case 'mrg':
            case 'trg':
            case 'tgr':
            case 'grd':
            case 'rec':
            case 'pha':
            case 'mcr':
            case 'tcr':
            case 'pdr':
            case 'mdr':
            case 'fdr':
            case 'ext':
                return this.Parameters.BasicModule[name.toLowerCase()];
            case 'hp':
            case 'atk':
            case 'def':
            case 'agi':
            case 'mp':
            case 'mat':
            case 'mdf':
            case 'luk':
                var paramId = this.params().indexOf(name.toLowerCase());
                return TextManager.param(paramId)
            default:
                return this.captalizeText(name.toLowerCase());
        }
    };

    VictorEngine.battlerIndex = function(battler) {
        if (battler && battler.isActor() && $gameParty.members().contains(battler)) {
            return 1 + $gameParty.members().indexOf(battler);
        } else if (battler && battler.isEnemy() && $gameTroop.members().contains(battler)) {
            return 1 + $gameParty.maxBattleMembers() + $gameTroop.members().indexOf(battler);
        } else {
            return 0;
        }
    };

    VictorEngine.battleSprites = function(spriteId) {
        return this._battleSprites[spriteId];
    };

    VictorEngine.addBattleSprite = function(spriteId, sprite) {
        this._battleSprites = this._battleSprites || {};
        this._battleSprites[spriteId] = sprite;
    };

    //=============================================================================
    // BattleManager
    //=============================================================================

    BattleManager.updateStackAction = function(index, subject, target) {
        this._logWindow.saveMethodsStack(index);
        this.clearTargets(target);
        this.invokeAction(subject, target);
        this._logWindow.restoreMethodsStack(index);
    };

    BattleManager.clearTargets = function(target) {
        for (var i = 0; i < this._targets.length; i++) {
            if (this._targets[i] === target) {
                this._targets.splice(i, 1);
                i--;
            }
        }
    };

    BattleManager.clearActionTargets = function() {
        this._targets = [];
    };

    BattleManager.prepareAction = function(subject, action, targets, skip) {
        this._phase = 'action';
        this._subject = subject;
        this._action = action;
        this._targets = targets;
        if (skip) {
            subject.useItem(action.item());
        }
        this._action.applyGlobal();
        this.refreshStatus();
    };

    BattleManager.startCounterAction = function(subject, target, targets, action) {
        if (targets.length > 0) {
            this._isCounterAttack = true;
            this._counterSubject = subject;
            this._counterTarget = target;
            this.prepareAction(subject, action, targets);
            this._logWindow.startCounterAction(subject, action, targets);
        }
    };

    BattleManager.averageTargetsPositions = function(targets) {
        var x = targets.reduce(function(r, member) {
            return r + member.screenX();
        }, 0) / targets.length;
        var y = targets.reduce(function(r, member) {
            return r + member.screenX();
        }, 0) / targets.length;
        return {
            x: x,
            y: y
        };
    };

    BattleManager.isSurprise = function() {
        return this._surprise;
    };

    BattleManager.isPreemptive = function() {
        return this._preemptive;
    };

    //=============================================================================
    // SceneManager
    //=============================================================================

    SceneManager.sceneSpriteset = function() {
        return this._scene ? this._scene._spriteset : null;
    };

    //=============================================================================
    // Window_Base
    //=============================================================================

    Window_Base.prototype.getFontColor = function(color) {
        if (color.match(/^\#[abcdef\d]{6}/i)) {
            return '"' + color + '"';
        } else {
            return color;
        }
    };

    //=============================================================================
    // Game_Action
    //=============================================================================

    Game_Action.prototype.setEscape = function() {
        var action = {
            name: TextManager.escape,
            speed: 9999,
            escape: true
        };
        this._escapeAction = action;
    };

    Game_Action.prototype.isEscape = function() {
        return !!this._escapeAction;
    };

    //=============================================================================
    // Game_Unit
    //=============================================================================

    Game_Unit.prototype.averageX = function() {
        return this.aliveMembers().reduce(function(r, member) {
            return r + member.screenX();
        }, 0) / this.aliveMembers().length;
    };

    Game_Unit.prototype.averageY = function() {
        return this.aliveMembers().reduce(function(r, member) {
            return r + member.screenY();
        }, 0) / this.aliveMembers().length;
    };

    //=============================================================================
    // Game_Player
    //=============================================================================

    Game_Player.prototype.follower = function(index) {
        return index === 0 ? this : this.followers().follower(index - 1);
    };

    //=============================================================================
    // Game_BattlerBase
    //=============================================================================

    Game_BattlerBase.prototype.screenX = function() {
        return this.spriteScreenX() || this._screenX || 0;
    };

    Game_BattlerBase.prototype.screenY = function() {
        return this.spriteScreenY() || this._screenY || 0;
    };

    Game_BattlerBase.prototype.homeX = function() {
        return this.battleSprite() ? this.battleSprite().homeX() : 0;
    };

    Game_BattlerBase.prototype.homeY = function() {
        return this.battleSprite() ? this.battleSprite().homeY() : 0;
    };

    Game_BattlerBase.prototype.spriteScreenX = function() {
        return this.battleSprite() ? this.battleSprite().screenX() : 0;
    };

    Game_BattlerBase.prototype.spriteScreenY = function() {
        return this.battleSprite() ? this.battleSprite().screenY() : 0;
    };

    Game_BattlerBase.prototype.mainSprite = function() {
        return this.battleSprite() ? this.battleSprite().mainSprite() : null;
    };

    Game_BattlerBase.prototype.friends = function() {
        return this.isActor() ? $gameParty : $gameTroop;
    };

    Game_BattlerBase.prototype.opponents = function() {
        return this.isEnemy() ? $gameParty : $gameTroop;
    };

    Game_BattlerBase.prototype.isOpponent = function(battler) {
        return this.isEnemy() === !battler.isEnemy();
    };

    Game_BattlerBase.prototype.idleMotions = function() {
        return ['wait', 'idle', 'dying', 'abnormal', 'guard', 'chant', 'sleep', 'victory', 'dead'];
    };

    Game_BattlerBase.prototype.isIdleMotion = function(motionType) {
        return this.idleMotions().contains(motionType);
    };

    Game_BattlerBase.prototype.isFacingDown = function() {
        return this.battlerDirection() === 'down';
    };

    Game_BattlerBase.prototype.isFacingLeft = function() {
        return this.battlerDirection() === 'left';
    };

    Game_BattlerBase.prototype.isFacingRight = function() {
        return this.battlerDirection() === 'right';
    };

    Game_BattlerBase.prototype.isFacingUp = function() {
        return this.battlerDirection() === 'up';
    };

    Game_BattlerBase.prototype.isFacingHorizontal = function() {
        return this.isFacingLeft() || this.isFacingRight();
    };

    Game_BattlerBase.prototype.isFacingVertical = function() {
        return this.isFacingDown() || this.isFacingUp();
    };

    Game_BattlerBase.prototype.turnDown = function() {
        this._battlerDirection = 'down';
    };

    Game_BattlerBase.prototype.turnLeft = function() {
        this._battlerDirection = 'left';
    };

    Game_BattlerBase.prototype.turnRight = function() {
        this._battlerDirection = 'right';
    };

    Game_BattlerBase.prototype.turnUp = function() {
        this._battlerDirection = 'up';
    };

    Game_BattlerBase.prototype.turnBack = function() {
        if (this.isFacingLeft()) {
            this.turnRight();
        } else if (this.isFacingRight()) {
            this.turnLeft();
        }
    };

    Game_BattlerBase.prototype.turnTowardCenter = function() {
        this.turnTowardPosition(Graphics.boxWidth / 2, Graphics.boxHeight / 2);
    };

    Game_BattlerBase.prototype.turnAwayFromCenter = function() {
        this.turnAwayFromPosition(Graphics.boxWidth / 2, Graphics.boxHeight / 2);
    };

    Game_BattlerBase.prototype.turnTowardOpponents = function() {
        this.turnTowardPosition(this.opponents().averageX(), this.opponents().averageY());
    };

    Game_BattlerBase.prototype.turnAwayFromOpponents = function() {
        this.turnAwayFromPosition(this.opponents().averageX(), this.opponents().averageY);
    };

    Game_BattlerBase.prototype.turnTowardTargets = function(targets) {
        var position = BattleManager.averageTargetsPositions(targets);
        this.turnTowardPosition(position.x, position.y);
    };

    Game_BattlerBase.prototype.turnAwayFromTargets = function(targets) {
        var position = BattleManager.averageTargetsPositions(targets);
        this.turnAwayFromPosition(position.x, position);
    };

    Game_BattlerBase.prototype.turnTowardPosition = function(positionX, positionY) {
        if (this.screenX() < positionX) {
            this.turnRight();
        } else if (this.screenX() > positionX) {
            this.turnLeft();
        }
    };

    Game_BattlerBase.prototype.turnAwayFromPosition = function(positionX, positionY) {
        if (this.screenX() < positionX) {
            this.turnLeft();
        } else if (this.screenX() > positionX) {
            this.turnRight();
        }
    };

    Game_BattlerBase.prototype.isBehind = function(target) {
        return (target.isFacingRight() && this.screenX() < target.screenX()) ||
            (target.isFacingLeft() && this.screenX() > target.screenX());
    };

    Game_BattlerBase.prototype.isSpriteEffecting = function() {
        return this.battleSprite() && this.battleSprite().isEffecting();
    };

    Game_BattlerBase.prototype.isSpriteMoving = function() {
        return this.battleSprite() && this.battleSprite().isMoving();
    };

    Game_BattlerBase.prototype.isSpriteAnimation = function() {
        return this.battleSprite() && this.battleSprite().isAnimationPlaying();
    };

    Game_BattlerBase.prototype.isAnimatedBattler = function() {
        return this.battleSprite() && this.battleSprite().isAnimatedBattler();
    };

    Game_BattlerBase.prototype.isStaticBattler = function() {
        return this.battleSprite() && this.battleSprite().isStaticBattler();
    };

    Game_BattlerBase.prototype.inHomePosition = function() {
        return this.battleSprite() && this.battleSprite().inHomePosition();
    };

    Game_BattlerBase.prototype.notIinHomePosition = function() {
        return !this.inHomePosition();
    };

    Game_BattlerBase.prototype.isCounterAttack = function() {
        return this._counterAttack;
    };

    Game_BattlerBase.prototype.startCounterAttack = function() {
        this._counterAttack = true;
    };

    Game_BattlerBase.prototype.endCounterAttack = function() {
        this._counterAttack = false;
    };

    Game_BattlerBase.prototype.battleSprite = function() {
        return VictorEngine.battleSprites(this.spriteId());
    };

    Game_BattlerBase.prototype.setBattleSprite = function(sprite) {
        VictorEngine.addBattleSprite(this.spriteId(), sprite);
    };

    Game_BattlerBase.prototype.clearBattleSprite = function() {
        VictorEngine.addBattleSprite(this.spriteId(), null);
    };

    Game_BattlerBase.prototype.addNewAction = function(action) {
        this._actions.unshift(action);
    };

    Game_BattlerBase.prototype.startEscapeCommand = function() {
        this._isEscapeCommand = true;
    };
    Game_BattlerBase.prototype.endEscapeCommand = function() {
        this._isEscapeCommand = false;
    };
    Game_BattlerBase.prototype.isEscapeCommand = function() {
        return this._isEscapeCommand;
    };

    //=============================================================================
    // Game_Battler
    //=============================================================================

    VictorEngine.BasicModule.onBattleEnd = Game_Battler.prototype.onBattleEnd;
    Game_Battler.prototype.onBattleEnd = function() {
        VictorEngine.BasicModule.onBattleEnd.call(this);
        this.clearBattleSprite();
    };

    //=============================================================================
    // Game_Actor
    //=============================================================================

    Game_Actor.prototype.battlerDirection = function() {
        return this._battlerDirection || 'left';
    };

    Game_Actor.prototype.spriteId = function() {
        return 'actor ' + String(this.actorId());
    };

    //=============================================================================
    // Game_Enemy
    //=============================================================================

    Game_Enemy.prototype.battlerDirection = function() {
        return this._battlerDirection || ($gameSystem.isSideView() ? 'right' : 'left');
    };

    Game_Enemy.prototype.attackAnimationId1 = function() {
        return 0;
    };

    Game_Enemy.prototype.attackAnimationId2 = function() {
        return 0;
    };

    Game_Enemy.prototype.spriteId = function() {
        return 'enemy ' + String(this.index());
    };

    //=============================================================================
    // Sprite_Battler
    //=============================================================================

    Object.defineProperties(Sprite_Battler.prototype, {
        z: {
            get: function() {
                return 3;
            },
            configurable: true
        },
        h: {
            get: function() {
                return this.spriteZ();
            },
            configurable: true
        }
    });

    Sprite_Battler.prototype.isEnemy = function() {
        return this._battler && this._battler.isEnemy();
    };

    Sprite_Battler.prototype.isVisible = function() {
        return this.visible && this.opacity > 0;
    };

    Sprite_Battler.prototype.isDamagePopup = function() {
        return this._damages.length > 0;
    };

    Sprite_Battler.prototype.isDisabledMotion = function() {
        var motion = Sprite_Actor.MOTIONS;
        return this._motion === motion['dead'] || this._motion === motion['sleep'];
    };

    Sprite_Battler.prototype.isAnimatedBattler = function() {
        return false;
    };

    Sprite_Battler.prototype.isStaticBattler = function() {
        return false;
    };

    Sprite_Battler.prototype.spriteZ = function() {
        return this.screenY();
    };

    Sprite_Battler.prototype.screenX = function() {
        return this._homeX + this._offsetX;
    };

    Sprite_Battler.prototype.screenY = function() {
        return this._homeY + this._offsetY;
    };

    Sprite_Battler.prototype.homeX = function() {
        return this._homeX;
    };

    Sprite_Battler.prototype.homeY = function() {
        return this._homeY;
    };

    Sprite_Battler.prototype.mainSprite = function() {
        return this._mainSprite;
    };

    Sprite_Battler.prototype.noEntryMove = function() {
        return this._battler && !this._battler.canMove();
    };

    Sprite_Battler.prototype.center = function() {
        var sprite = this._mainSprite ? this._mainSprite : this;
        var x = sprite._frame.width / 2 || 0;
        var y = sprite._frame.height / 2 || 0;
        return {
            x: x,
            y: y
        };
    };

    //=============================================================================
    // Sprite_Actor
    //=============================================================================

    Sprite_Actor.prototype.updateBattlerDirection = function() {
        if (this._battler && !this.isDisabledMotion()) {
            if ((this._battler.isFacingLeft() && this.scale.x < 0) ||
                (this._battler.isFacingRight() && this.scale.x > 0)) {
                this.scale.x *= -1;
            }
        }
    };

    //=============================================================================
    // Sprite_Enemy
    //=============================================================================

    Sprite_Enemy.prototype.updateBattlerDirection = function() {
        if (this._battler && !this.isDisabledMotion()) {
            if ((this._battler.isFacingLeft() && this.scale.x > 0) ||
                (this._battler.isFacingRight() && this.scale.x < 0)) {
                this.scale.x *= -1;
            }
        }
    };

    Sprite_Enemy.prototype.isStaticBattler = function() {
        return true;
    };

    //=============================================================================
    // Sprite_Damage
    //=============================================================================

    Object.defineProperties(Sprite_Damage.prototype, {
        z: {
            get: function() {
                return 10;
            },
            configurable: true
        }
    });

    //=============================================================================
    // Spriteset_Battle
    //=============================================================================

    VictorEngine.BasicModule.setBattler = Sprite_Battler.prototype.setBattler;
    Sprite_Battler.prototype.setBattler = function(battler) {
        VictorEngine.BasicModule.setBattler.call(this, battler);
        if (battler) {
            battler.setBattleSprite(this);
        }
    };

    Spriteset_Battle.prototype.sortBattleSprites = function() {
        if (this._sortChildrenFrame !== Graphics.frameCount) {
            this._battleField.children.sort(this.compareBattleSprites.bind(this));
            this._sortChildrenFrame = Graphics.frameCount;
        }
    };

    Spriteset_Battle.prototype.compareBattleSprites = function(a, b) {
        if ((a.z || 0) !== (b.z || 0)) {
            return (a.z || 0) - (b.z || 0);
        } else if ((a.h || 0) !== (b.h || 0)) {
            return (a.h || 0) - (b.h || 0);
        } else if ((a.y || 0) !== (b.y || 0)) {
            return (a.y || 0) - (b.y || 0);
        } else {
            return a.spriteId - b.spriteId;
        }
    };

    //=============================================================================
    // Window_Base
    //=============================================================================

    Window_Base.prototype.textWidthEx = function(text) {
        if (text) {
            var state = {
                index: 0,
                x: 0
            };
            state.text = this.convertEscapeCharacters(text);
            while (state.index < state.text.length) {
                this.processCharacter(state)
            };
            return state.x;
        } else {
            return 0;
        }
    };

    //=============================================================================
    // Window_BattleLog
    //=============================================================================

    Window_BattleLog.prototype.waitForBattleAnimation = function(animationId, speed) {
        var speed = Math.max(speed, 1) || 1;
        this.waitForTime(VictorEngine.waitAnimation(animationId) / speed);
    };

    Window_BattleLog.prototype.startCounterAction = function(subject, action, targets) {
        this.push('addText', TextManager.counterAttack.format(subject.name()));
        this.startAction(subject, action, targets);
    };

    Window_BattleLog.prototype.waitForTime = function(time) {
        this._waitCount = time;
    };

    Window_BattleLog.prototype.setupStartAction = function(subject, action, targets) {
        if (this._setupStartActionFrame !== Graphics.frameCount) {
            VictorEngine.removeMethod(this._methods, 'showAnimation');
            VictorEngine.removeMethod(this._methods, 'waitForBattleAnimation');
            this.push('prepareAction', subject, action, targets);
            this._setupStartActionFrame = Graphics.frameCount;
        }
    };

    Window_BattleLog.prototype.initializeMethodsStack = function() {
        this._stackWaitCount = [];
        this._stackWaitMode = [];
        this._methodsStack = [];
        this._stackIndex = 0;
    };

    Window_BattleLog.prototype.prepareAction = function(subject, action, targets) {
        this.uniqueTargets(targets).forEach(function(unique) {
            this._stackIndex = VictorEngine.battlerIndex(unique.target);
            this.prepareUniqueAction(subject, action, unique.target, unique.repeat)
        }, this)
        this._stackIndex = 0;
    };

    Window_BattleLog.prototype.prepareUniqueAction = function(subject, action, target, repeat) {
        this.prepareUniqueActionStep1(subject, action, target, repeat);
        this.prepareUniqueActionStep2(subject, action, target, repeat);
        this.prepareUniqueActionStep3(subject, action, target, repeat);
    };

    Window_BattleLog.prototype.prepareUniqueActionStep1 = function(subject, action, target, repeat) {
        var item = action.item();
        this.push('showAnimation', subject, [target], item.animationId);
    };

    Window_BattleLog.prototype.prepareUniqueActionStep2 = function(subject, action, target, repeat) {
        var item = action.item();
        var animId = this.uniqueActionAnimationId(subject, item)
        this.push('waitForBattleAnimation', animId);
    };

    Window_BattleLog.prototype.prepareUniqueActionStep3 = function(subject, action, target, repeat) {
        for (var i = 0; i < repeat; i++) {
            if (i > 0) {
                this.push('waitForTime', 1);
            }
            this.push('updateStackAction', this._stackIndex, subject, target);
        }
    };

    Window_BattleLog.prototype.uniqueActionAnimationId = function(subject, item) {
        if (item.animationId < 0) {
            return subject.attackAnimationId1();
        } else {
            return item.animationId;
        }
    }

    Window_BattleLog.prototype.uniqueTargets = function(targets) {
        var repeats = [];
        targets.forEach(function(target, i) {
            var index = targets.indexOf(target);
            if (index === i) {
                repeats[index] = {
                    target: target,
                    repeat: 1
                };
            } else {
                repeats[index].repeat++;
            }
        })
        return repeats.filter(function(repeat) {
            return !!repeat
        });
    }

    Window_BattleLog.prototype.updateMethodsStack = function() {
        var methods = this._methodsStack;
        for (var i = 0; i < methods.length; i++) {
            if (methods[i] && methods[i].length > 0) {
                while (methods[i].length > 0 && !this.updateStackWait(i)) {
                    this.callNextStackMethod(i);
                }
            }
        }
        if (this.isStackEmpty()) {
            this._methodsStack = [];
        }
    };

    Window_BattleLog.prototype.isStackEmpty = function() {
        return this._methodsStack.every(function(methods) {
            return !methods || methods.length === 0;
        })
    };

    Window_BattleLog.prototype.stackBattler = function(index) {
        if (index > 0) {
            var max = $gameParty.maxBattleMembers();
            if (index > max) {
                return $gameTroop.members()[index - max - 1];
            } else {
                return $gameParty.members()[index - 1];
            }
        } else {
            return null;
        }
    };

    Window_BattleLog.prototype.callNextStackMethod = function(index) {
        var method = this._methodsStack[index].shift();
        if (method.name && this[method.name]) {
            this[method.name].apply(this, method.params);
        } else {
            throw new Error('Method not found: ' + method.name);
        }
    };

    Window_BattleLog.prototype.saveMethodsStack = function(index) {
        this._saveStackIndex = this._stackIndex;
        this._saveMethodsStack = this._methodsStack[index].clone();
        this._stackIndex = index;
        this._methodsStack[index] = [];
    };

    Window_BattleLog.prototype.restoreMethodsStack = function(index) {
        this._methodsStack[index] = this._methodsStack[index].concat(this._saveMethodsStack);
        this._stackIndex = this._saveStackIndex;
    };

    Window_BattleLog.prototype.methodStackActive = function() {
        return this._methodsStack.length > 0;
    };

    Window_BattleLog.prototype.updateStackAction = function(index, subject, target) {
        BattleManager.updateStackAction(index, subject, target);
    };

    Window_BattleLog.prototype.pushMethodsStack = function(methodName) {
        var index = this._stackIndex || 0;
        var methodArgs = Array.prototype.slice.call(arguments, 1);
        if (methodName === 'wait') {
            methodName = 'stackWait';
            methodArgs.unshift(index);
        } else if (methodName === 'waitForTime') {
            methodName = 'stackWaitForTime';
            methodArgs.unshift(index);
        } else if (methodName === 'waitForBattleAnimation') {
            methodName = 'stackWaitFoAnimation';
            methodArgs.unshift(index);
        } else if (methodName === 'updateWaitMode') {
            methodName = 'updateStackWaitMode';
            methodArgs.unshift(index);
        } else if (methodName === 'setWaitMode') {
            methodName = 'setStackWaitMode';
            methodArgs.unshift(index);
        }
        this._methodsStack[index] = this._methodsStack[index] || [];
        this._methodsStack[index].push({
            name: methodName,
            params: methodArgs
        });
    };

    Window_BattleLog.prototype.updateStackWait = function(index) {
        return this.updateStackWaitCount(index) || this.updateStackWaitMode(index);
    };

    Window_BattleLog.prototype.updateStackWaitCount = function(index) {
        if (this._stackWaitCount[index] && this._stackWaitCount[index] > 0) {
            this._stackWaitCount[index]--;
            return true;
        }
        return false;
    };

    Window_BattleLog.prototype.stackWait = function(index) {
        this.stackWaitForTime(index, this.messageSpeed());
    };

    Window_BattleLog.prototype.stackWaitFoAnimation = function(index, animationId, speed) {
        var speed = Math.max(speed, 1) || 1;
        this.stackWaitForTime(index, VictorEngine.waitAnimation(animationId) / speed);
    };

    Window_BattleLog.prototype.stackWaitForTime = function(index, time) {
        this._stackWaitCount[index] = time;
    };

    Window_BattleLog.prototype.updateStackWaitMode = function(index) {
        var battler = this.stackBattler(index);
        var waitMode = this._stackWaitMode[index] || [];
        if (waitMode.contains('effect')) {
            var waiting = battler ? battler.isSpriteEffecting() : this._spriteset.isEffecting();
            if (waiting) {
                return true;
            } else {
                this.removeWaitMode(index, 'effect');
            }
        }
        if (waitMode.contains('movement')) {
            var waiting = battler ? battler.isSpriteMoving() : this._spriteset.isAnyoneMoving();
            if (waiting) {
                return true;
            } else {
                this.removeWaitMode(index, 'movement');
            }
        }
        this._stackWaitMode[index] = [];
        return false;
    };

    Window_BattleLog.prototype.setStackWaitMode = function(index, waitMode) {
        this._stackWaitMode[index] = this._stackWaitMode[index] || [];
        if (!this._stackWaitMode[index].contains(waitMode)) {
            this._stackWaitMode[index].push(waitMode);
        }
    };

    Window_BattleLog.prototype.removeWaitMode = function(index, waitMode) {
        this._stackWaitMode[index] = this._stackWaitMode[index] || [];
        var waitIndex = this._stackWaitMode[index].indexOf(waitMode);
        this._stackWaitMode[index].splice(waitIndex, 1);
    };

    Window_BattleLog.prototype.startEscape = function(subject, action) {
        subject._isEscapeCommand = true;
    };

    Window_BattleLog.prototype.performEscape = function(subject) {
        $gameParty._skipClear = true;
        BattleManager.processEscape();
        $gameParty._skipClear = false;
    };

    Window_BattleLog.prototype.setupCurrentAction = function(subject, action, targets) {};

})();