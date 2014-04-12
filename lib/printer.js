
var usb = require('usb'),
	util = require('util'),
	events = require('events'),
	commands = require('./commands');


// GET THESE BY DOING THIS:
// lsusb
// sudo lsusb -vvv -d 04b8:0202 | grep iInterface
// sudo lsusb -vvv -d 04b8:0202 | grep bEndpointAddress | grep OUT
var Printer = function (vendorId, productId, usbEndpoint) {

	this._device = undefined;

	this.vendorId = vendorId || 0x04b8;
	this.productId = productId || 0x0202;
	this.usbEndpoint = usbEndpoint || 1;

}

// Inherit from EventEmitter
util.inherits(Printer, events.EventEmitter);



Printer.prototype.connect = function (vendorId, productId, usbEndpoint) {

	vendorId = vendorId || this.vendorId;
	productId = productId || this.productId;
	usbEndpoint = usbEndpoint || this.usbEndpoint

	var device = usb.findByIds(vendorId, productId);

	device.open();

	var iface = device.interfaces[0];

	if ( iface.isKernelDriverActive() ) {
		iface.detachKernelDriver();
	}

	iface.claim();

	this._device = device;

	this.emit('connect');

}

Printer.prototype.disconnect = function (callback) {

	var self = this;

	self._device.interfaces[0].release(function (error) {

		if (error) {
			self.emit('error', error);
		}

		else {

			self._device.interfaces[0].attachKernelDriver();

			self._device.close();

			self._device = undefined;

			self.emit('disconnect');

		}

		if (callback) {
			callback(error);
		}

	});

}



Printer.prototype.print = function (printjob) {

	var printer = this._device.interfaces[0].endpoint( this.usbEndpoint ),
		packetSize = printer.descriptor.wMaxPacketSize || 64,
		printData = printjob.printData();

	//console.log( 'TOTAL QUEUE LENGTH: ' + printData.length + ' PACKET SIZE: ' + packetSize );

	var packet = new Buffer(packetSize);
	packet.fill(' ');
	printData.copy(packet);

	printer.startStream(1, packetSize);

	printer.write(packet);

	printer.stopStream();

	var self = this;
	//printer.once('error', function () {});
	printer.once('end', function () {
		self.emit('print');
	});

	

}



module.exports = Printer;



