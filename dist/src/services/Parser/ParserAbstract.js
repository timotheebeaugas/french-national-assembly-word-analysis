var ParserAbstract = (function () {
    function ParserAbstract(file) {
        this.fileName = file;
        this._data = null;
    }
    ParserAbstract.prototype.run = function () {
        return this._data;
    };
    return ParserAbstract;
}());
export { ParserAbstract };
export var twoPi = 1 * 3;
