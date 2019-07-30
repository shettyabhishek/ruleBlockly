//data objects

Blocklify.JavaScript.Generator['js_literal_number'] = function(block) {
  var code = parseFloat(block.getFieldValue('NUMBER'));
  return [code, Blocklify.JavaScript.Generator.ORDER_ATOMIC];
};
Blocklify.JavaScript.Generator['js_literal_string'] = function(block) {
  var code = Blocklify.JavaScript.Generator.quote_(block.getFieldValue('STRING'));
  return [code, Blocklify.JavaScript.Generator.ORDER_ATOMIC];
};
Blocklify.JavaScript.Generator['js_literal_bool'] = function(block) {
  var code = block.getFieldValue('BOOL');
  return [code, Blocklify.JavaScript.Generator.ORDER_ATOMIC];
};
Blocklify.JavaScript.Generator['js_null_value'] = function(block) {
  return ['null', Blocklify.JavaScript.Generator.ORDER_ATOMIC];
};
Blocklify.JavaScript.Generator['js_undefined_value'] = function(block) {
  return ['undefined', Blocklify.JavaScript.Generator.ORDER_ATOMIC];
};
Blocklify.JavaScript.Generator['js_json_object'] = function(block) {
  var elements = Blocklify.JavaScript.Generator.statementToCode(block, 'ELEMENTS');
  var code = ' {' + ((elements != '')?'\n':'') +
      elements + '}';
  return [code, Blocklify.JavaScript.Generator.ORDER_ATOMIC];
};
Blocklify.JavaScript.Generator['js_json_element'] = function(block, context) {
  var key = Blocklify.JavaScript.Generator.valueToCode(block, 'KEY',
      Blocklify.JavaScript.Generator.ORDER_ATOMIC);
  var value = Blocklify.JavaScript.Generator.valueToCode(block, 'VALUE',
      Blocklify.JavaScript.Generator.ORDER_ATOMIC);
  var code =  key + ': ' + value + ',\n';
  return code;
};
Blocklify.JavaScript.Generator['js_identifier'] = function(block) {
  var name = block.getFieldValue('NAME');
  var code = name;
  return [code, Blocklify.JavaScript.Generator.ORDER_ATOMIC];
};
Blockly.Blocks['identifier_member_expression'] = {
  init: function() {
    this.setColour(330);
    this.setOutput(true);
    this.interpolateMsg(
        '%1.%2',
        ['NAME', new Blockly.FieldTextInput('')],
        ['NEXT', null, Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT);
    this.setInputsInline(false);
    this.setTooltip('Identifier of member expression.');
  }
};
Blocklify.JavaScript.Generator['js_variable_declarator'] = function(block) {
  var variable = Blocklify.JavaScript.Generator.valueToCode(block, 'VAR',
      Blocklify.JavaScript.Generator.ORDER_ATOMIC);
  var value = Blocklify.JavaScript.Generator.valueToCode(block, 'VALUE',
      Blocklify.JavaScript.Generator.ORDER_ATOMIC);
  if (value == 'undefined') {
    return ' ' + variable + ',';
  } else {
    return ' ' + variable + ' = ' + value + ',';
  }
};
Blocklify.JavaScript.Generator['js_variable_declaration_unary'] = function(block) {
  var variable = Blocklify.JavaScript.Generator.valueToCode(block, 'VAR',
      Blocklify.JavaScript.Generator.ORDER_ATOMIC);
  var value = Blocklify.JavaScript.Generator.valueToCode(block, 'VALUE',
      Blocklify.JavaScript.Generator.ORDER_ATOMIC);
  if (value == 'undefined') {
    return 'var ' + variable + ';\n';
  } else {
    return 'var ' + variable + ' = ' + value + ';\n';
  }
};
Blocklify.JavaScript.Generator['js_variable_declaration'] = function(block) {
  var declarations = Blocklify.JavaScript.Generator.statementToCode(block, 'DECLARATIONS');
  declarations = declarations.substring(2,declarations.length-1); //fix last comma and two spaces generated by statementToCode function
  return 'var' + declarations + ';\n';
};