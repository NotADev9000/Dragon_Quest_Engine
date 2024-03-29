//=============================================================================
// Dragon Quest Engine - Game System
// DQE_Game_System.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The game object class for the system data - V0.1
*
* @param Override Battle BGM Switch
* @desc ID of switch that overrides player selected Battle BGM when ON
* @default 2
*
* @param Allow Zoom Switch
* @desc ID of switch that allows player to zoom
* @default 3
*
* @param Start Zoom Switch
* @desc ID of switch that starts the zoom common event
* @default 4
*
* @param Lock Camera Switch
* @desc ID of switch that locks camera in position (it won't follow player)
* @default 5
*
* @param Seperate Followers Switch
* @desc ID of switch that stops followers from following player
* @default 6
*
* @help
* N/A
*
*/

//------
// Imported and namespace
//------

var DQEng = DQEng || {};
DQEng.Game_System = DQEng.Game_System || {};

var parameters = PluginManager.parameters('DQE_Game_System');
DQEng.Parameters = DQEng.Parameters || {};
DQEng.Parameters.Game_System = {};
DQEng.Parameters.Game_System.OverrideBattleBgmSwitch = Number(parameters["Override Battle BGM Switch"]) || 2;
DQEng.Parameters.Game_System.AllowZoomSwitch = Number(parameters["Allow Zoom Switch"]) || 3;
DQEng.Parameters.Game_System.StartZoomSwitch = Number(parameters["Start Zoom Switch"]) || 4;
DQEng.Parameters.Game_System.LockCameraSwitch = Number(parameters["Lock Camera Switch"]) || 5;
DQEng.Parameters.Game_System.SeperateFollowersSwitch = Number(parameters["Seperate Followers Switch"]) || 6;

//-----------------------------------------------------------------------------
// Game_System
//-----------------------------------------------------------------------------

DQEng.Game_System.initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    DQEng.Game_System.initialize.call(this);
    this._battleBgmId = 6; // ID of DQ battle music e.g. 1 = DQ1, 2 = DQ2 etc.
};

//////////////////////////////
// Functions - music
//////////////////////////////

Game_System.prototype.battleBgmId = function () {
    return this._battleBgmId;
};

Game_System.prototype.setBattleBgmId = function (value) {
    this._battleBgmId = value;
};

Game_System.prototype.changeBattleBgmFromId = function () {
    let bgm = {};
    bgm.pan = 0;
    bgm.pitch = 100;
    bgm.volume = 100;
    switch (this._battleBgmId) {
        case 2:
            bgm.name = 'DQ2';
            break;
        case 3:
            bgm.name = 'DQ3';
            break;
        case 4:
            bgm.name = 'DQ4';
            break;
        case 5:
            bgm.name = 'DQ5';
            break;            
        case 6:
            bgm.name = 'DQ6 - Courageous Fight';
            break;
        case 7:
            bgm.name = 'DQ7';
            break;
        case 8:
            bgm.name = 'DQ8';
            break;
        case 9:
            bgm.name = 'DQ9';
            break;
        case 10:
            bgm.name = 'DQ10';
            break;
        case 11:
            bgm.name = 'DQ11';
            break;
        default:
            bgm.name = 'DQ1';
            break;
    }
    this.setBattleBgm(bgm);
};

/**
 * Changes the default battle music
 * Only the ID is changed if Switch X is ON
 * This prevents players from changing the battle bgm during certain events
 * NOTE: After event that forces a BGM has expired "$gameSystem.changeBattleBgmFromId()" must be called!
 */
Game_System.prototype.changeDefaultBattleBgm = function (value) {
    this.setBattleBgmId(value);
    if (!$gameSwitches.value(DQEng.Parameters.Game_System.OverrideBattleBgmSwitch)) this.changeBattleBgmFromId();
};

//////////////////////////////
// Functions - skill sets
//////////////////////////////

Game_System.prototype.findSkillSet = function (skillSetId) {
    return $DQE_dataSkillSets.find(skillSetData => skillSetData.id === skillSetId);
};

Game_System.prototype.findSkillSetName = function (id) {
    return this.findSkillSet(id).name;
};

// unlocking skills

Game_System.prototype.triggerNodeUnlocks = function (node, actor) {
    this.triggerSkillUnlocks(node, actor);
    this.triggerParameterUnlocks(node, actor);
    this.triggerTraitUnlocks(node, actor);
    this.triggerSwitchUnlocks(node);
};

Game_System.prototype.triggerSkillUnlocks = function (node, actor) {
    const skills = node.onUnlock.skills;

    if (skills.length) {
        skills.forEach(skillId => {
            actor.learnSkill(skillId);
        });
    }
};

Game_System.prototype.triggerParameterUnlocks = function (node, actor) {
    const params = node.onUnlock.parameters;

    params.forEach((change, index) => {
        if (change !== 0) actor.addParam(index, change);
    });
};

Game_System.prototype.triggerTraitUnlocks = function (node, actor) {
    const traits = node.onUnlock.traits;

    traits.forEach(trait => {
        actor.addTrait(trait);
    });
};

Game_System.prototype.triggerSwitchUnlocks = function (node) {
    const switches = node.onUnlock.switches;

    switches.forEach(switchId => {
        $gameSwitches.setValue(switchId, true);
    });
};

Game_System.prototype.chargeActor = function (node, actor) {
    const cost = node.cost;

    if (cost.miniMedals) {
        $gameParty.loseMedal(cost.miniMedals);
    } else if (cost.gold) {
        $gameParty.loseGold(cost.gold);
    } else if (cost.skillPoints) {
        actor.loseSkillPoints(cost.skillPoints);
    }
};

/**
 * values should be passed by reference so the unlock changes the actors' skillset
 * 
 * @param {dataSkillSet} skillset 
 * @param {number} layerIndex 
 * @param {dataSkillSet.layers[x].nodes[x]} node 
 */
Game_System.prototype.updateSkillSetUnlocks = function (skillset, layerIndex, node) {
    const layer = skillset.layers[layerIndex];

    // increase total unlocked nodes
    skillset.nodesUnlocked++;
    // unlock node
    node.unlocked = true;
    // increase layer counter
    layer.nodesUnlocked++;
    // complete layer
    if (this.canCompleteLayer(layer)) layer.complete = true;
    // unlock next layer
    if (this.canUnlockNextLayer(layerIndex, skillset.layers)) skillset.layers[layerIndex+1].unlocked = true;
    // complete skillset
    if (this.canCompleteSkillSet(skillset)) skillset.complete = true;
};

Game_System.prototype.canCompleteLayer = function (layer) {
    return layer.nodesUnlocked >= layer.nodes.length;
};

Game_System.prototype.canUnlockNextLayer = function (layerIndex, layers) {
    if (layerIndex + 1 >= layers.length) return false;
    const currentLayerUnlocked = layers[layerIndex].nodesUnlocked;
    const nextLayerCost = layers[layerIndex+1].unlockCost;
    return currentLayerUnlocked >= nextLayerCost;
};

Game_System.prototype.canCompleteSkillSet = function (skillset) {
    return skillset.nodesUnlocked >= this.getSkillSetNodeAmount(skillset);
};

// node details

/**
 * Returns the total amount of nodes in a skill set
 * 
 * @param {Object} skillSet the skillSet data object
 */
Game_System.prototype.getSkillSetNodeAmount = function (skillSet) {
    let nodeCount = 0;
    skillSet.layers.forEach(layer => {
        nodeCount += layer.nodes.length;
    });
    return nodeCount;
};

/**
 * Returns the nodes' unlock description. Checks if a skill is unlocked and
 * gets said skills description, mpCost & requirements. Gets the nodes description
 * field if the unlockable isn't a skill.
 * 
 * The array is returned in that order as it matches the parameters for the
 * Window_SkillSetDescription draw function.
 * 
 * @param {Object} node object from the skillSet data object
 * @returns array of unlock details retrieved from the node
 */
Game_System.prototype.getNodeUnlockDescription = function (node) {
    let mpCost = '';
    let description = node.description;
    let requirement = 'No requirements';
    const isSkill = node.onUnlock.skills.length;

    if (isSkill) {
        const skill = $dataSkills[node.onUnlock.skills[0]]; // description always shows first skill details
        description = skill.description;
        mpCost = skill.mpCost.toString();
        if (skill.requiredWtypeId1) requirement = $dataSystem.weaponTypes[skill.requiredWtypeId1] + ' required';
    }

    return [isSkill, mpCost, description, requirement];
};

/**
 * Returns details about a nodes' cost
 * Can return the amount, type of currency as a string or both as a string
 * 
 * @param {Object} node object from the skillSet data object
 * @param {Boolean} getAmount should the amount be returned
 * @param {Boolean} getType should the currency type be returned
 * @param {Boolean} getShorthand should the type return the abbreviated version
 * @returns 
 */
Game_System.prototype.getNodeCostDetails = function (node, getAmount, getType, getShorthand = true) {
    const cost = node.cost;
    let details = '';

    if (cost.miniMedals) {
        if (getAmount) details = cost.miniMedals;
        if (getType) details += getShorthand ? ' ' + TextManager.medalUnit : ' ' + TextManager.medalText(cost.miniMedals);
    } else if (cost.gold) {
        if (getAmount) details = cost.gold;
        if (getType) details += ' ' + TextManager.currencyUnit;
    } else if (cost.skillPoints) {
        if (getAmount) details = cost.skillPoints;
        if (getType) details += getShorthand ? ' ' + TextManager.skillPointUnit : ' ' + TextManager.skillPointText(cost.skillPoints);
    }

    return details;
};
