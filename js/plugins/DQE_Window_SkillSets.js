//=============================================================================
// Dragon Quest Engine - Window Skill Sets
// DQE_Window_SkillSets.js                                                             
//=============================================================================

/*:
*
* @author NotADev
* @plugindesc The window for unlocking nodes in a skill set - V0.1
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
Imported.DQEng_Window_SkillSets = true;

var DQEng = DQEng || {};
DQEng.Window_SkillSets = DQEng.Window_SkillSets || {};

//-----------------------------------------------------------------------------
// Window_SkillSets
//-----------------------------------------------------------------------------

function Window_SkillSets() {
    this.initialize.apply(this, arguments);
}

Window_SkillSets.prototype = Object.create(Window_Pagination.prototype);
Window_SkillSets.prototype.constructor = Window_SkillSets;

Window_SkillSets.prototype.initialize = function (x, y, width, height, selectable) {
    Window_Pagination.prototype.initialize.call(this, x, y, width, height);
    // actor
    this._category = -1;
    this._lastCategory = -1;
    this._actor = null;
    // skillset
    this._skillSetIndex = -1;
    // display data
    this._data = {};
    this._page = 1;
    // determines whether the items are drawn with cursor space
    this._selectable = selectable;
    // the callback function to run after the highlighter has completed
    this._highlightCallback = null;
    this._isHighlightGrowing = true; // is the highlighter increasing in opacity?
    this._highlightDelay = 0;
};

//////////////////////////////
// Functions - window sizing
//////////////////////////////

Window_SkillSets.prototype.titleBlockHeight = function () {
    return 108;
};

//////////////////////////////
// Functions - visuals
//////////////////////////////

Window_SkillSets.prototype.showUnlockHighlight = function (callback, delay) {
    if (!this._highlightSprite) {
        this._highlightSprite = new Sprite();
        this._highlightSprite.bitmap = new Bitmap(0, 0);
        this.addChild(this._highlightSprite);
    }

    const bitmap = this._highlightSprite.bitmap;
    if (bitmap.width !== this.width || bitmap.height !== this.height) {
        this.refreshUnlockHighlightBitmap();
    }

    this._highlightDelay = delay;
    this._highlightSprite.opacity = 0;
    this._highlightSprite.visible = true;
    this._highlightCallback = callback;
};

Window_SkillSets.prototype.refreshUnlockHighlightBitmap = function () {
    if (this._highlightSprite) {
        const bitmap = this._highlightSprite.bitmap;
        const w = this.width;
        const h = this.height;
        const c1 = this.highlightColor();
        bitmap.resize(w, h);
        bitmap.fillRect(0, 0, w, h, c1);
        this._highlightSprite.setFrame(0, 0, w, h);
    }
};

Window_SkillSets.prototype.updateUnlockHighlight = function () {
    if (this._isHighlightGrowing) { // highlight opacity should increase
        this._highlightSprite.opacity += 25;
        if (this._highlightSprite.opacity >= 225) {
            this._isHighlightGrowing = false
            this.refresh(); // window refreshed when highlight is full opacity
        };
    } else { // highlight opacity should decrease
        this._highlightSprite.opacity -= 25;
        if (this._highlightSprite.opacity <= 0) {
            this._highlightCallback.call(SceneManager._scene);
            this._highlightCallback = null;
            this._isHighlightGrowing = true;
        }
    }
};

Window_SkillSets.prototype.highlightColor = function () {
    return 'rgba(255, 255, 255, 1)';
};

//////////////////////////////
// Functions - data
//////////////////////////////

/**
 * different to how other windows use this method.
 * Called by parent window which then sets the skill set
 * and refreshes this window
 * 
 * @param {number} category index of party member
 */
Window_SkillSets.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._actor = $gameParty.members()[this._category];
    }
};

Window_SkillSets.prototype.setItem = function (index) {
    if (this._skillSetIndex !== index || this._lastCategory !== this._category) {
        this._skillSetIndex = index;
        this._lastCategory = this._category;
        this._page = 1;
        this.makeItemList();
        this._itemsOnPage = this.itemsOnPage();
        this.select(this.index(), true); // refresh in here
    }
};

Window_SkillSets.prototype.data = function () {
    return this._data;
};

/**
 * Returns the currently selected node if the window has data
 */
Window_SkillSets.prototype.item = function () {
    const index = this.index();
    if (this._data && index >= 0) {
        return this.node(index);
    }
    
    return null;
};

Window_SkillSets.prototype.node = function (index) {
    return this.layer().nodes[index];
};

Window_SkillSets.prototype.layer = function () {
    return this._data.layers[this.getLayerIndex()];
};

Window_SkillSets.prototype.previouslayersNodesUnlocked = function () {
    return this._data.layers[this.getLayerIndex()-1].nodesUnlocked;
};

/**
 * if _skillSetIndex === -1 then the data should not change.
 * This prevents _data from being erased when deselecting the parent window
 * but allows emptying of _data when an actor has no skill sets
 */
Window_SkillSets.prototype.makeItemList = function () {
    if (this._skillSetIndex >= 0)  {
        this._data = this._actor.skillSets()[this._skillSetIndex];
    } else if (this._skillSetIndex < -1) {
        this._data = {};
    }
};

Window_SkillSets.prototype.maxItems = function () {
    return this._itemsOnPage;
};

//////////////////////////////
// Functions - help windows
//////////////////////////////

Window_SkillSets.prototype.updateHelp = function () {
    const node = this.item();
    if (node) {
        this.setHelpWindowItem($gameSystem.getNodeUnlockDescription(node));
        this._helpWindow[0].show();
    } else {
        // if actor has no skillSets then hide description window
        this._helpWindow[0].hide();
    }
};

Window_SkillSets.prototype.setHelpWindowItem = function (unlockDetails) {
    // Window_SkillSetDescription
    this._helpWindow[0].setItem(...unlockDetails);
};

//////////////////////////////
// Functions - display
//////////////////////////////

Window_SkillSets.prototype.setSelectable = function (selectable) {
    this._selectable = selectable;
};

//////////////////////////////
// Functions - index
//////////////////////////////

/**
 * @returns the current layers index in the skillset
 */
Window_SkillSets.prototype.getLayerIndex = function () {
    return this._page - 1;
};

Window_SkillSets.prototype.topIndex = function () {
    return 0;
};

/**
 * trueIndex always = index in this window
 */
Window_SkillSets.prototype.trueIndex = function (index) {
    return index;
};

//////////////////////////////
// Functions - page
//////////////////////////////

Window_SkillSets.prototype.numPages = function () {
    return this._data.layers?.length ? this._data.layers.length : 1;
};

Window_SkillSets.prototype.itemsOnPage = function () {
    return this._data?.layers?.[this.getLayerIndex()].nodes.length ?? 0;
};

//////////////////////////////
// Functions - row/column
//////////////////////////////

Window_SkillSets.prototype.row = function () {
    return Math.floor(this.index() / this.maxCols());
};

Window_SkillSets.prototype.column = function () {
    return 0;
};

//////////////////////////////
// Functions - cursor movement
//////////////////////////////

Window_SkillSets.prototype.processOk = function () {
    if (this.index() >= 0) { // check this actor has skillSets before processing anything
        if (this.layer().unlocked) {
            if (!this.item().unlocked) {
                // this node hasn't been bought yet
                this.playOkSound();
                this.updateInputData();
                this.deactivate();
                this.callOkHandler();
            }
        } else {
            // layer is locked
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callHandler('disabled');
        }
    }
};

Window_SkillSets.prototype.cursorDown = function () {
    Window_Selectable.prototype.cursorDown.call(this);
};

Window_SkillSets.prototype.cursorUp = function () {
    Window_Selectable.prototype.cursorUp.call(this);
};

Window_SkillSets.prototype.cursorRight = function () {
    this.gotoNextPage();
};

Window_SkillSets.prototype.cursorLeft = function () {
    this.gotoNextPage(-1);
};

/**
 * Sets this._page to next/previous page
 * 
 * @param {Number} next +1 if next page, -1 if previous
 */
Window_SkillSets.prototype.gotoNextPage = function (next = 1) {
    if (this._numPages <= 1) return;
    this._page = this.getNextPage(next);
    this._itemsOnPage = this.itemsOnPage();
    // force refresh
    this.select(this.index(), true);
};

//////////////////////////////
// Functions - draw items
//////////////////////////////

Window_SkillSets.prototype.drawTitleBlock = function () {
    const title = this._data.name || 'No Skill Set';
    const itemHeight = this.itemHeight();
    const numSkills = this._actor.numSkillSets();
    let y = this.extraPadding();

    // window title
    this.drawText(title, 0, y, this.contentsWidth(), 'center');

    // icons (switching pages)
    if (numSkills >= 2) this.drawPreviousNextAtEdges(y);

    y += itemHeight;
    // horizontal rule
    this.drawHorzLine(0, y);
    y += 3 + this.lineGap();

    if (numSkills >= 1) {
        const ep = this.extraPadding();
        const layer = this.layer();
        let layerText = `Layer ${this._page}`;

        // complete layer - color change & tick
        if (layer.complete) {
            layerText += ' ^';
            this.changeTextColor(this.completeSkillSetColor());
        }

        // layer number
        this.drawText(layerText, ep, y);
    
        // layer status (only shows on layers > 1)
        if (this._page !== 1) {
            if (layer.unlocked) {
                layerText = 'UNLOCKED';
                this.changeTextColor(this.unlockedSkillLayerColor());
            } else {
                layerText = 'LOCKED';
                this.changeTextColor(this.lockedSkillLayerColor());
            }
            layerText += ` ${this.previouslayersNodesUnlocked()}/${layer.unlockCost}`;
            this.drawText(layerText, 0, y, this.contentsWidth() - ep, 'right');
        }
        this.resetTextColor();

        y += itemHeight;
        // horizontal rule
        this.drawHorzLine(0, y);
    }
};

Window_SkillSets.prototype.drawItem = function (index) {
    const node = this.node(index);
    if (node) {
        // position items for cursor if selectable
        const rect = this._selectable ? this.itemRectForText(index) : this.itemRect(index);
        // unlocked nodes - color change & tick
        let name = node.name;
        if (node.unlocked) {
            name += ' ^';
            this.changeTextColor(this.completeSkillSetColor());
        } else if (!this.layer().unlocked) {
            this.changeTextColor(this.disabledColor());
        }
        // node name
        this.drawText(name, rect.x, rect.y, rect.width);
        // node cost
        const cost = $gameSystem.getNodeCostDetails(node, true, true);
        this.drawText(cost, rect.x, rect.y, rect.width, 'right');
        // reset node color
        this.resetTextColor();
    }
};

//////////////////////////////
// Functions - refresh
//////////////////////////////

Window_SkillSets.prototype.select = function (index, refresh = false) {
    this._index = Math.min(this._itemsOnPage - 1, index);
    this._stayCount = 0;
    this.setLastSelected(this._index);
    if (refresh) this.refresh(false);
    this.updateCursor();
    this.callUpdateHelp();
};

Window_SkillSets.prototype.refresh = function (resetLastSelected = true) {
    if (this._actor) {
        this.createContents();
        this.drawTitleBlock();
        if (resetLastSelected) this.setLastSelected(0);
        this._numPages = this.numPages();
        this._topIndex = this.topIndex();
        this._numRows = this.numRows();
        this.drawPageBlock();
        this.drawAllItems();
    }
};

Window_SkillSets.prototype.update = function () {
    Window_Pagination.prototype.update.call(this);
    if (this._highlightCallback && this._highlightDelay <= 0) {
        this.updateUnlockHighlight();
    } else {
        this._highlightDelay--;
    }
};
