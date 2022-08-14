"use strict";
exports.__esModule = true;
var index_1 = require("../node_modules/axios/index");
var URL = {
    value: "https://data.assemblee-nationale.fr/static/openData/repository/16/vp/syceronbrut/syseron.xml.zip"
};
index_1["default"].get(URL.value)
    .then(function (response) {
    console.log(response);
})["catch"](function (error) {
    console.log(error);
});
