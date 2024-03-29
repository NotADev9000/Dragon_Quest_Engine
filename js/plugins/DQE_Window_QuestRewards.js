//=============================================================================
// Dragon Quest Engine - Window Quest Rewards
// DQE_Window_QuestRewards.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc Lists the rewards for the selected quest - V0.1
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
Imported.DQEng_Window_QuestRewards = true;

var DQEng = DQEng || {};
DQEng.Window_QuestRewards = DQEng.Window_QuestRewards || {};

//-----------------------------------------------------------------------------
// Window_QuestRewards
//-----------------------------------------------------------------------------

function Window_QuestRewards() {
    this.initialize.apply(this, arguments);
}

Window_QuestRewards.prototype = Object.create(Window_Base.prototype);
Window_QuestRewards.prototype.constructor = Window_QuestRewards;

Window_QuestRewards.prototype.initialize = function (x, y, width, height) {
    this._rewards = [];
    Window_Base.prototype.initialize.call(this, x, y, width, height);
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_QuestRewards.prototype.standardPadding = function () {
    return 9;
};

Window_QuestRewards.prototype.extraPadding = function () {
    return 15;
};

Window_QuestRewards.prototype.titleBlockHeight = function () {
    return 54;
};

//////////////////////////////
// Functions - data
//////////////////////////////

Window_QuestRewards.prototype.setItem = function (quest) {
    const rewards = quest.rewards();
    if (this._rewards !== rewards) {
        this._rewards = rewards;
        this.refresh();
    }
};

Window_QuestRewards.prototype.getRewardName = function (reward) {
    switch (reward.type) {
        case Game_Quest.REWARDS_GOLD:
            return `${reward.value}\\c[6]${TextManager.currencyUnit}\\c[1]`;
        case Game_Quest.REWARDS_ITEM:
            return $dataItems[reward.value].name;
        case Game_Quest.REWARDS_WEAPON:
            return $dataWeapons[reward.value].name;
        case Game_Quest.REWARDS_ARMOR:
            return $dataArmors[reward.value].name;
        default:
            return reward.value;
    }
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_QuestRewards.prototype.drawTitle = function () {
    const title = 'Rewards';
    this.drawText(title, 0, this.extraPadding(), this.contentsWidth(), 'center');
    this.drawHorzLine(0, this.titleBlockHeight() - 3);
};

Window_QuestRewards.prototype.drawRewards = function () {
    if (!this._rewards.length) return;
    const ep = this.extraPadding();
    const ih = this.itemHeight();
    let y = ep + this.titleBlockHeight();
    this._rewards.forEach(reward => {
        let text = `~${this.getRewardName(reward)}`;
        this.drawTextEx(text, ep, y);
        y += ih;
    });
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_QuestRewards.prototype.refresh = function () {
    this.contents.clear();
    this.drawTitle();
    this.drawRewards();
};
