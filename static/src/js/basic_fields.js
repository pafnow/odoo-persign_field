odoo.define('percent_field.basic_fields', function (require) {
    "use strict";
    var field_registry = require('web.field_registry');
    var FieldFloat = require('web.basic_fields').FieldFloat;

    var FieldPercent = FieldFloat.extend({
        formatType:'percent', // formatType is used to determine which format (and parse) functions
        supportedFieldTypes: ['float'], // override to indicate which field types are supported by the widget
    });
    var FieldPermille = FieldFloat.extend({
        formatType:'permille',
        supportedFieldTypes: ['float'],
    });

    //registering fields
    field_registry.add('percent', FieldPercent);
    field_registry.add('permille', FieldPermille);
    return {
        FieldPercent: FieldPercent,
        FieldPermille: FieldPermille
    };
});

