var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ParserAbstract = require("./ParserAbstract.ts");
var ParserXML = (function (_super) {
    __extends(ParserXML, _super);
    function ParserXML(fileName) {
        var _this = _super.call(this, fileName) || this;
        _this.fileName = fileName;
        return _this;
    }
    ParserXML.prototype.getDate = function () {
        return this.run().date;
    };
    ParserXML.prototype.getTitle = function () {
        return this.run().title;
    };
    ParserXML.prototype.getQuotes = function () {
        return this.run().quotes;
    };
    return ParserXML;
}(ParserAbstract));
