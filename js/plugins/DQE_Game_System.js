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
 * Returns the nodes' unlock amount
 * 
 * @param {Object} node object from the skillSet data object
 * @returns amount the node costs to unlock
 */
Game_System.prototype.getNodeCostAmount = function (node) {
    const cost = node.cost;

    if (cost.miniMedals) {
        return cost.miniMedals;
    } else if (cost.gold) {
        return cost.gold;
    } else if (cost.skillPoints) {
        return cost.skillPoints;
    }

    return 0;
};

/**
 * Returns the nodes' unlock currency as a string
 * 
 * @param {Object} node object from the skillSet data object
 * @returns string of cost type
 */
Game_System.prototype.getNodeCostType = function (node) {
    const cost = node.cost;

    if (cost.miniMedals) {
        return TextManager.medalUnit;
    } else if (cost.gold) {
        return TextManager.currencyUnit;
    } else if (cost.skillPoints) {
        return TextManager.skillPointUnit;
    }

    return '';
};

/**
 * Returns the nodes' unlock amount and currency as a string
 * 
 * @param {Object} node object from the skillSet data object
 * @returns amount the node costs to unlock + currency
 */
Game_System.prototype.getNodeCostAmountAndType = function (node) {
    const cost = node.cost;

    if (cost.miniMedals) {
        return `${cost.miniMedals} ${TextManager.medalUnit}`;
    } else if (cost.gold) {
        return `${cost.gold} ${TextManager.currencyUnit}`;
    } else if (cost.skillPoints) {
        return `${cost.skillPoints} ${TextManager.skillPointUnit}`;
    }

    return '0';
};
