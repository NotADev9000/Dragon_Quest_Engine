//=============================================================================
// Dragon Quest Engine - Game Battler
// DQE_Game_Battler.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The superclass of Game_Actor and Game_Enemy - V0.1
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
Imported.DQEng_Game_Battler = true;

var DQEng = DQEng || {};
DQEng.Game_Battler = DQEng.Game_Battler || {};

//-----------------------------------------------------------------------------
// Game_Battler
//-----------------------------------------------------------------------------

Game_Battler.prototype.performRevival = function () {
    SoundManager.playRevival();
};

Game_Battler.prototype.useItem = function (item, modifiedSkill, itemIndex = -1) {
    if (DataManager.isSkill(item)) {
        var skill = modifiedSkill ? modifiedSkill : item;
        this.paySkillCost(skill);
    } else if (DataManager.isItem(item)) {
        if (itemIndex >= 0) {
            this.consumeActorItem(itemIndex);
        } else {
            this.consumeItem(item); // consume item from bag
        }
    }
};

Game_Battler.prototype.addState = function (stateId) {
    if (this.isStateAddable(stateId)) {
        if (!this.isStateAffected(stateId)) { // battler is not already affected by state
            this.addNewState(stateId);
            this.refresh();
            stateId === this.deathStateId() && this.isActor() && $gamePlayer.refresh();
            this._result.pushAddedState(stateId);
        } else { // state should be stacked on already existing state
            this._result.pushStackedState(stateId);
        }
        this.resetStateCounts(stateId);
    }
};

Game_Battler.prototype.isStateAddable = function (stateId) {
    let state = $dataStates[stateId];
    return (this.isAlive() && state &&
        !this.isStateResist(stateId) &&
        !this._result.isStateRemoved(stateId) &&
        !this.isStateRestrict(stateId)) &&
        !(this.isStateAffected(stateId) && state.meta.noStack); // state not addable if already affected and state can't be stacked
};

Game_Battler.prototype.removeState = function (stateId) {
    if (this.isStateAffected(stateId)) {
        let removeDeath = stateId === this.deathStateId();
        removeDeath && this.revive();
        this.eraseState(stateId);
        this.isActor() && $gamePlayer.refresh();
        removeDeath && this.refresh();
        this._result.pushRemovedState(stateId);
    }
};

Game_Battler.prototype.removeStateAuto = function (timing, state) {
    if (this.isStateExpired(state.id) && ((timing === 0 && state.autoRemovalTiming > 0) || state.autoRemovalTiming === timing)) {
        this.removeState(state.id);
    }
};

Game_Battler.prototype.addBuff = function (paramId, turns) {
    if (this.isAlive()) {
        this.increaseBuff(paramId);
        if (this.isBuffAffected(paramId)) {
            this.overwriteBuffTurns(paramId, turns);
        }
        this._result.pushChangedBuff(paramId);
        this.refresh();
    }
};

Game_Battler.prototype.addDebuff = function (paramId, turns) {
    if (this.isAlive()) {
        this.decreaseBuff(paramId);
        if (this.isDebuffAffected(paramId)) {
            this.overwriteBuffTurns(paramId, turns);
        }
        this._result.pushChangedBuff(paramId);
        this.refresh();
    }
};

Game_Battler.prototype.currentExpiringState = function () {
    let expiredState = null;
    this.states().some((state) => {
        if (this.isStateExpired(state.id)) {
            expiredState = state;
            return true;   
        }
        return false;
    });
    return expiredState;
};

Game_Battler.prototype.onAllActionsEnd = function () {
    this.clearResult();
    this.updateStateTurns(1);
    this.removeBuffsAuto();
};

/**
 * Clears result & updates the state & buff turn counts
 */
Game_Battler.prototype.onPostTurn1 = function () {
    this.clearResult();
    this.updateStateTurns(2);
    this.updateBuffTurns();
};

Game_Battler.prototype.onPostTurn2 = function () {
    // get list of all states that invoke an effect on turn end
    this.states().filter(state => {
        return state.meta.onTurnEnd;
    }).forEach(state => {
        this._actions.push(state.id);
    });
    // get stat regenerations
    if (this.hrg !== 0) this._actions.push('hrg');
    if (this.mrg !== 0) this._actions.push('mrg');
};

Game_Battler.prototype.invokeStateEffects = function (stateId) {
    let state = $dataStates[stateId];
    if (state.meta.formula) {
        let a = this;
        let damage = Math.max(eval(state.meta.formula), 0);
        if (state.meta.dmgCap) damage = Math.min(damage, state.meta.dmgCap);
        this.gainHp(-damage);
    }
};

Game_Battler.prototype.invokeRegen = function (type) {
    switch (type) {
        case 'hrg':
            this.regenerateHp();
            break;
        case 'mrg':
            this.regenerateMp();
            break;
    }
};
