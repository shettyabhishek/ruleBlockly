//statement blocks

'use strict';

Blockly.Blocks['js_for_statement'] = {
  init: function() {
    this.setColour(220);
    this.appendValueInput("CONDITION")
        .setCheck("")
        .appendField("for");
    this.appendStatementInput("FIRST")
        .setCheck("")
        .appendField("first");
    this.appendStatementInput("DO")
        .setCheck("")
        .appendField("do");
    this.appendStatementInput("STEP")
        .setCheck("")
        .appendField("step");
    this.setTooltip('');
    this.setPreviousStatement(true, 'Statement');
    this.setNextStatement(true, 'Statement');
  }
};
Blockly.Blocks['js_return_statement'] = {
  init: function() {
    this.setColour(220);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput('VALUE')
      .appendField('return');
    this.setTooltip('Function returns the value of input.');
  }
};
Blockly.Blocks['js_notimplemented'] = {
  init: function() {
    this.setColour(0);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
      .appendField('Importer for')
      .appendField(new Blockly.FieldTextInput(''), 'TYPE')
      .appendField('not yet implemented :(');
    this.setTooltip('Function returns the value of input.');
    Blocklify.JavaScript.Blocks.setMutators(this,[{name: 'switch'}]);
  }
};

Blockly.Blocks['js_if_statement'] = {
  /**
   * Block for if/elseif/else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
    this.setColour(220);
    this.appendValueInput('IF0')
        .setCheck('Boolean')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
    this.appendStatementInput('DO0')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    this.setPreviousStatement(true, 'Statement');
    this.setNextStatement(true, 'Statement');
    this.setMutator(new Blockly.Mutator(['js_elseif_statement',
                                         'js_else_statement']));
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      if (!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
      } else if (!thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
      } else if (thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
      } else if (thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
      }
      return '';
    });
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
  },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.elseifCount_) {
      container.setAttribute('elseif', this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute('else', 1);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
    for (var i = 1; i <= this.elseifCount_; i++) {
      this.appendValueInput('IF' + i)
          .setCheck('Boolean')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
      this.appendStatementInput('DO' + i)
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    }
    if (this.elseCount_) {
      this.appendStatementInput('ELSE')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
    }
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace, 'js_if_if_statement');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 1; i <= this.elseifCount_; i++) {
      var elseifBlock = Blockly.Block.obtain(workspace, 'js_elseif_statement');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = Blockly.Block.obtain(workspace, 'js_else_statement');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Disconnect the else input blocks and remove the inputs.
    if (this.elseCount_) {
      this.removeInput('ELSE');
    }
    this.elseCount_ = 0;
    // Disconnect all the elseif input blocks and remove the inputs.
    for (var i = this.elseifCount_; i > 0; i--) {
      this.removeInput('IF' + i);
      this.removeInput('DO' + i);
    }
    this.elseifCount_ = 0;
    // Rebuild the block's optional inputs.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'js_elseif_statement':
          this.elseifCount_++;
          var ifInput = this.appendValueInput('IF' + this.elseifCount_)
              .setCheck('Boolean')
              .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
          var doInput = this.appendStatementInput('DO' + this.elseifCount_);
          doInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
          // Reconnect any child blocks.
          if (clauseBlock.valueConnection_) {
            ifInput.connection.connect(clauseBlock.valueConnection_);
          }
          if (clauseBlock.statementConnection_) {
            doInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        case 'js_else_statement':
          this.elseCount_++;
          var elseInput = this.appendStatementInput('ELSE');
          elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
          // Reconnect any child blocks.
          if (clauseBlock.statementConnection_) {
            elseInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  setCounts: function(elseifCount_, elseCount_) {
    // Disconnect the else input blocks and remove the inputs.
    if (this.elseCount_) {
      this.removeInput('ELSE');
    }
    this.elseCount_ = 0;
    // Disconnect all the elseif input blocks and remove the inputs.
    for (var i = this.elseifCount_; i > 0; i--) {
      this.removeInput('IF' + i);
      this.removeInput('DO' + i);
    }
    this.elseifCount_ = 0;
    // Rebuild the block's optional inputs.
    while (this.elseifCount_ < elseifCount_) {
      this.elseifCount_++;
      var ifInput = this.appendValueInput('IF' + this.elseifCount_)
          .setCheck('Boolean')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
      var doInput = this.appendStatementInput('DO' + this.elseifCount_);
      doInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    }
    while (this.elseCount_ < elseCount_) {
      this.elseCount_++;
      var elseInput = this.appendStatementInput('ELSE');
      elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'js_elseif_statement':
          var inputIf = this.getInput('IF' + i);
          var inputDo = this.getInput('DO' + i);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case 'js_else_statement':
          var inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  }
};


Blockly.Blocks['js_if_if_statement'] = {
  /**
   * Mutator block for if container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(220);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_IF_TITLE_IF);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['js_elseif_statement'] = {
  /**
   * Mutator bolck for else-if condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(220);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['js_else_statement'] = {
  /**
   * Mutator block for else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(220);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE);
    this.setPreviousStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP);
    this.contextMenu = false;
  }
};

// TODO: Fix all blocks, those are a copy of js_if_statement blocks.
Blockly.Blocks['js_switch_statement'] = {
  /**
   * Block for if/elseif/else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(220);
    this.appendValueInput('DISCRIMINANT')
        .appendField('switch');
    this.setPreviousStatement(true, 'Statement');
    this.setNextStatement(true, 'Statement');
    this.setMutator(new Blockly.Mutator(['js_case_statement',
                                         'js_default_statement']));
    this.setTooltip('Switch statement.');
    this.caseCount_ = 0;
    this.defautCount_ = 0;
  },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.caseCount_ && !this.defaultCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.caseCount_) {
      container.setAttribute('case', this.elseifCount_);
    }
    if (this.defautCount_) {
      container.setAttribute('default', 1);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.caseCount_ = parseInt(xmlElement.getAttribute('case'), 10);
    this.defaultCount_ = parseInt(xmlElement.getAttribute('default'), 10);
    for (var i = 0; i < this.caseCount_; i++) {
      this.appendValueInput('CASE' + i)
          .appendField('case').setAlign(Blockly.ALIGN_RIGHT);
      this.appendValueInput('DO' + i)
          .appendField('do').setAlign(Blockly.ALIGN_RIGHT);
    }
    if (this.elseCount_) {
      this.appendStatementInput('DEFAULT')
          .appendField('default');
    }
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace, 'js_switch_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.caseCount_; i++) {
      var caseBlock = Blockly.Block.obtain(workspace, 'js_case_statement');
      caseBlock.initSvg();
      connection.connect(caseBlock.previousConnection);
      connection = caseBlock.nextConnection;
    }
    if (this.defaultCount_) {
      var defaultBlock = Blockly.Block.obtain(workspace, 'js_default_statement');
      defaultBlock.initSvg();
      connection.connect(defaultBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Disconnect the else input blocks and remove the inputs.
    if (this.defaultCount_) {
      this.removeInput('DEFAULT');
    }
    this.defaultCount_ = 0;
    // Disconnect all the elseif input blocks and remove the inputs.
    for (var i = this.caseCount_ - 1; i >= 0; i--) {
      this.removeInput('CASE' + i);
      this.removeInput('DO' + i);
    }
    this.caseCount_ = 0;
    // Rebuild the block's optional inputs.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'js_case_statement':
          var caseInput = this.appendValueInput('CASE' + this.caseCount_)
              .appendField('case').setAlign(Blockly.ALIGN_RIGHT);
          var doInput = this.appendStatementInput('DO' + this.caseCount_);
          doInput.appendField('do').setAlign(Blockly.ALIGN_RIGHT);
          // Reconnect any child blocks.
          if (clauseBlock.valueConnection_) {
            caseInput.connection.connect(clauseBlock.valueConnection_);
          }
          if (clauseBlock.statementConnection_) {
            doInput.connection.connect(clauseBlock.statementConnection_);
          }
          this.caseCount_++;
          break;
        case 'js_default_statement':
          this.defaultCount_++;
          var defaultInput = this.appendStatementInput('DEFAULT');
          defaultInput.appendField('default');
          // Reconnect any child blocks.
          if (clauseBlock.statementConnection_) {
            defaultInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  setCounts: function(defaultCount_, caseCount_) {
    // Disconnect the else input blocks and remove the inputs.
    if (this.defaultCount_) {
      this.removeInput('DEFAULT');
    }
    this.defaultCount_ = 0;
    // Disconnect all the case input blocks and remove the inputs.
    for (var i = this.caseCount_ - 1; i >= 0; i--) {
      this.removeInput('CASE' + i);
      this.removeInput('DO' + i);
    }
    this.caseCount_ = 0;
    // Rebuild the block's optional inputs.
    while (this.caseCount_ < caseCount_) {
      this.caseCount_++;
      var caseInput = this.appendValueInput('CASE' + this.caseCount_)
          .appendField('case');
      var doInput = this.appendStatementInput('DO' + this.caseCount_);
      doInput.appendField('do');
    }
    while (this.defaultCount_ < defaultCount_) {
      this.defaultCount_++;
      var defaultInput = this.appendStatementInput('DEFAULT');
      defaultInput.appendField('default');
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'js_case_statement':
          var inputCase = this.getInput('CASE' + i);
          var inputDo = this.getInput('DO' + i);
          clauseBlock.valueConnection_ =
              inputCase && inputCase.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case 'js_default_statement':
          var inputDo = this.getInput('DEFAULT');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  }
};


Blockly.Blocks['js_switch_container'] = {
  /**
   * Mutator block for if container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(220);
    this.appendDummyInput()
        .appendField('switch');
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['js_case_statement'] = {
  /**
   * Mutator bolck for else-if condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(220);
    this.appendDummyInput()
        .appendField('case');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('A case of a switch statement.');
    this.contextMenu = false;
  }
};

Blockly.Blocks['js_default_statement'] = {
  /**
   * Mutator block for else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(220);
    this.appendDummyInput()
        .appendField('default');
    this.setPreviousStatement(true);
    this.setTooltip('A default of a switch statement.');
    this.contextMenu = false;
  }
};
