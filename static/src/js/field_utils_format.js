odoo.define('percent_field.field_utils_format', function (require) {
    "use strict";
    var field_utils = require('web.field_utils');
    var BasicController = require('web.BasicController');
    var _t = require('web.core')._t;

    function formatPerSign(value, sign) {
        if (value) { return value + sign; }
        else { return 0.0 + sign; }
    }
    function formatPercent(value) {
        return formatPerSign(value, '%');
    }
    function formatPermille(value) {
        return formatPerSign(value, '‰');
    }

    /**
     * Parse a String containing per-sign in language formatting
     *
     * @param {string} value
     *        The string to be parsed with the setting of thousands and decimal separator
     * @returns {float with per-sign symbol}
     * @throws {Error} if no float is found respecting the language configuration
     */
    function parsePerSign(value, sign) {
        if (value) {
            var lastChar = value[value.length -1];
            var parsedValue = (lastChar == sign) ? value.slice(0,-1) : value;
            var maxValue = (sign == "%") ? 100 : (sign == "‰") ? 1000 : 0;

            if (isNaN(parsedValue)) {
                throw new Error(_.str.sprintf(core._t("'%s' is not a correct float"), value));
            }
            if (parsedValue < 0 || parsedValue > maxValue) {
                throw new Error(_.str.sprintf(core._t("'%s' should be between 0 and %s"), value, maxValue));
            }
            return parsedValue;
        }
    }
    function parsePercent(value) {
        return parsePerSign(value, '%');
    }
    function parsePermille(value) {
        return parsePerSign(value, '‰');
    }

    field_utils['format']['percent'] = formatPercent;
    field_utils['parse']['percent'] = parsePercent;
    field_utils['format']['permille'] = formatPermille;
    field_utils['parse']['permille'] = parsePermille;

    BasicController.include({
        _notifyInvalidFields: function (invalidFields) {
            var record = this.model.get(this.handle, {raw: true});
            var fields = record.fields;
            var self = this;
            var call_once = true;
            var not_persign = true;
            var errors = invalidFields.map(function (fieldName) {
                var fieldtype = fields[fieldName].type;
                if (fieldtype === "percent") {
                    not_persign = false;
                    self.do_warn(_t("Percent field value must be 0 to 100 only"));
                }
                else if (fieldtype === "permille") {
                    not_persign = false;
                    self.do_warn(_t("Permille field value must be 0 to 1000 only"));
                }
                if (call_once && not_persign) {
                    call_once = false;
                    self._super(invalidFields);
                }
            });
        }
    })
});
