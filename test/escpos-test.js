
var escpos = require('../lib/escpos');

var vendorId = 0x04b8;
var productId = 0x0202;

var printer = new escpos(vendorId, productId);
