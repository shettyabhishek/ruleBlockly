/** 
    Filename: customBlocks.js
    Author: UI Offshore development team 
    Description: This file holds all the custom blocks added to the component. 
    
*/


//Block to add fm error
Blockly.Blocks['error'] = {
    init: function() {
        this.appendDummyInput().appendField("FM Error")
            .appendField(new Blockly.FieldTextInput("Enter Error Message"), "msg");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
}
Blockly.JavaScript['error'] = function(block) {
    var errorFlag='';
    var text_msg = block.getFieldValue('msg');
    // TODO: Assemble JavaScript into code variable.
    var code = "fm.error('"+text_msg+"')";
    return code;
}; 

//Block to add fm lookup
Blockly.Blocks['fm_lookup'] = {
    init: function() {
        this.appendDummyInput().appendField("FM Lookup");
        this.appendValueInput("table_name").setCheck("String").appendField("Table Name");
        this.appendValueInput("output_columns").setCheck("Array").appendField("Output Columns");
        this.appendValueInput("where_clause").setCheck("Array").appendField("Where Clause");
        this.setInputsInline(true);
        this.setOutput(true, "Array");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['fm_lookup'] = function(block) {
    var errorFlag='';
    var value_table_name = Blockly.JavaScript.valueToCode(block, 'table_name', Blockly.JavaScript.ORDER_ATOMIC);
    var value_output_columns = Blockly.JavaScript.valueToCode(block, 'output_columns', Blockly.JavaScript.ORDER_ATOMIC);
    var value_where_clause = Blockly.JavaScript.valueToCode(block, 'where_clause', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    //console.log('Table_Name ->'+value_table_name + 'OP Columns -> '+value_output_columns+'Where Clause ->'+value_where_clause);
    if(value_table_name.length === 0)
        errorFlag+= 'Parameter Table Name Missing';
    if(value_output_columns.length === 0)
        errorFlag+= 'Parameter Output Columns Missing';
    if(value_where_clause.length === 0)
        errorFlag+= 'Parameter Where Clause Missing';
    if(errorFlag.length!= 0)
        window.alert('FM Lookup Error : ' + errorFlag);
    var code = "fm.sqlLookupGeneric(" + value_table_name + "," + value_output_columns + ", "+value_where_clause + " )";
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

//Block to add fm get
Blockly.Blocks['fm_get'] = {
    init: function() {
        this.appendDummyInput().appendField("Object Get");
        this.appendValueInput("array_name").setCheck("Array").setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Array Object");
        this.appendValueInput("length").setCheck("Number").setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Object Length");
        this.appendDummyInput().appendField("Output Fields")
            .appendField(new Blockly.FieldTextInput("Enter Field Name"), "output_fields");
        this.setInputsInline(true);
        this.setOutput(true, "String");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['fm_get'] = function(block) {
    var errorFlag='';
    var value_array_name = Blockly.JavaScript.valueToCode(block, 'array_name', Blockly.JavaScript.ORDER_ATOMIC);
    var value_length = Blockly.JavaScript.valueToCode(block, 'length', Blockly.JavaScript.ORDER_ATOMIC);
    var text_output_fields = block.getFieldValue('output_fields');
    // TODO: Assemble JavaScript into code variable.
    if(value_array_name.length === 0)
        errorFlag+= 'Array Name is missing';
    if(value_length.length === 0)
        errorFlag+= 'Array Length is missing';
    if(text_output_fields.length === 0)
        errorFlag+= 'Output Fields are missing';
    if(errorFlag.length!= 0)
        window.alert('Object.get Error: '+errorFlag);
    var code = value_array_name+".get( "+value_length+", "+text_output_fields+" )";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

//Block to add parameterless fm get
Blockly.Blocks['fm_get_parameterless'] = {
    init: function() {
        this.appendDummyInput().appendField("FM Get");
        this.appendValueInput("db_column").setCheck("String").setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Output Column");
        this.setInputsInline(true);
        this.setOutput(true, "String");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['fm_get_parameterless'] = function(block) {
    var errorFlag='';
    var value_db_column = Blockly.JavaScript.valueToCode(block, 'db_column', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    if(value_db_column.length === 0)
        errorFlag+= 'DB Columns are missing';
    if(errorFlag.length!= 0)
        window.alert('FM.get Error: '+errorFlag);
    var code = "fm.get( "+value_db_column+ " )"; 
    return [code, Blockly.JavaScript.ORDER_NONE];
};

//Block to add fm set
Blockly.Blocks['fm_set'] = {
    init: function() {
        this.appendDummyInput().appendField("FM set");
        this.appendValueInput("field_name").setCheck("String")
            .appendField("Field Name");
        this.appendValueInput("field_value").setCheck("String")
            .appendField("Field Value");
        this.setInputsInline(true);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['fm_set'] = function(block) {
    var errorFlag='';
    var value_field_name = Blockly.JavaScript.valueToCode(block, 'field_name', Blockly.JavaScript.ORDER_ATOMIC);
    var value_field_value = Blockly.JavaScript.valueToCode(block, 'field_value', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    if(value_field_name.length === 0)
        errorFlag+= 'Field Name is missing';
    if(value_field_value.length === 0)
        errorFlag+= 'Field Value is missing';
    if(errorFlag.length!= 0)
        window.alert('FM.set Error: '+errorFlag);
    var code = "fm.set( "+ value_field_name + ", " + value_field_value + " )";
    return code;
};

//Block to add fm isNan (is not a number)
Blockly.Blocks['fm_isnan'] = {
    init: function() {
        this.appendDummyInput().appendField("isNan");
        this.appendValueInput("ip_value").setCheck("String").appendField("Input Value");
        this.setInputsInline(true);
        this.setOutput(true, "Boolean");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['fm_isnan'] = function(block) {
    var errorFlag='';
    var value_ip_value = Blockly.JavaScript.valueToCode(block, 'ip_value', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    if(value_ip_value.length === 0)
        errorFlag+= 'Input value missing'
    if(errorFlag.length === 0)
        window.alert('isNan error: '+errorFlag);
    var code = "isNan( "+value_ip_value+" )";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

//Block to add other custom avery functions 
Blockly.Blocks['avery_functions3'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("Avery Functions"), "function_name");
        this.appendValueInput("table").setCheck(null).setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldTextInput(""), "field1");
        this.appendValueInput("columns").setCheck(null).setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldTextInput(""), "field2");
        this.appendValueInput("condition").setCheck(null).setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldTextInput(""), "field3");
        this.setInputsInline(true);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['avery_functions3'] = function(block) {
    var errorFlag='';
    var text_function_name = block.getFieldValue('function_name');
    var value_table = Blockly.JavaScript.valueToCode(block, 'table', Blockly.JavaScript.ORDER_ATOMIC);
    var value_columns = Blockly.JavaScript.valueToCode(block, 'columns', Blockly.JavaScript.ORDER_ATOMIC);
    var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC);
    if(value_table.length === 0)
        errorFlag+= text_field1 +' is missing';
    if(value_columns.length === 0)
        errorFlag+= text_field2 +' is missing';
    if(value_condition.length === 0)
        errorFlag+= text_field3 +' is missing';
    if(errorFlag.length!= 0)
        window.alert(text_function_name + ' Error: '+errorFlag);
    var code = text_function_name + "( "+ value_table + "," + value_columns + "," + value_condition + " );";
    return code;
};

//Block to add other custom avery functions 
Blockly.Blocks['avery_functions2'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("Avery Functions"), "function_name");
        this.appendValueInput("table").setCheck(null)
            .appendField(new Blockly.FieldTextInput(""), "field1");
        this.appendValueInput("columns").setCheck(null)
            .appendField(new Blockly.FieldTextInput(""), "field2");
        this.setInputsInline(true);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['avery_functions2'] = function(block) {
    var errorFlag='';
    var text_function_name = block.getFieldValue('function_name');
    var text_field1 = block.getFieldValue('field1');
    var value_table = Blockly.JavaScript.valueToCode(block, 'table', Blockly.JavaScript.ORDER_ATOMIC);
    var text_field2 = block.getFieldValue('field2');
    var value_columns = Blockly.JavaScript.valueToCode(block, 'columns', Blockly.JavaScript.ORDER_ATOMIC);
    if(value_table.length === 0)
        errorFlag+= text_field1 +' is missing';
    if(value_columns.length === 0)
        errorFlag+= text_field2 +' is missing';
    if(errorFlag.length!= 0)
        window.alert(text_function_name + ' Error: '+errorFlag);
    var code = text_function_name + "( " + value_table + ", " + value_columns + " );";
    return code;
};

Blockly.Blocks['avery_functions1'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("Avery Functions"), "function_name");
        this.appendValueInput("table")
            .setCheck(null)
            .appendField(new Blockly.FieldTextInput(""), "field1");
        this.setInputsInline(true);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['avery_functions1'] = function(block) {
    var errorFlag='';
    var text_function_name = block.getFieldValue('function_name');
    var text_field1 = block.getFieldValue('field1');
    var value_table = Blockly.JavaScript.valueToCode(block, 'table', Blockly.JavaScript.ORDER_ATOMIC);
    if(value_table.length === 0)
    errorFlag+= text_field1 +' is missing';
    if(errorFlag.length!= 0)
        window.alert(text_function_name + ' Error: '+errorFlag);
    var code = text_function_name + "( " + value_table + " );";
    return code;
};