"use strict";
exports.__esModule = true;
exports.ParserAbstract = void 0;
var ParserAbstract = (function () {
    function ParserAbstract(file) {
        this.fileName = file;
    }
    ParserAbstract.prototype.run = function () {
        return this.data;
    };
    return ParserAbstract;
}());
exports.ParserAbstract = ParserAbstract;
