
var usb = require('usb'),
	util = require('util'),
	events = require('events');



/**
 * Creates a new Printer object that is ready to connect to an attached USB escpos printer.
 *
 * You can get the vendorId and productId by issuing this command on the command line:
 * `lsusb`
 *
 * You can get the usbEndpoint by issuing this command on the command line:
 * `sudo lsusb -vvv -d ****:**** | grep bEndpointAddress | grep OUT`
 *
 * @class
 * @property {number} [vendorId=0x04b8] The USB Vendor ID of the printer to connect to.
 * @property {number} [productId=0x0202] The USB Product ID of the printer to connect to.
 * @property {number} [usbEndpoint=1] The output USB Endpoint Index of the printer to connect to.
 */
var Printer = function (vendorId, productId, usbEndpoint) {

	this.vendorId = vendorId || 0x04b8;
	this.productId = productId || 0x0202;
	this.usbEndpoint = usbEndpoint || 1;

	this._device = undefined;

}

// Inherit from EventEmitter
util.inherits(Printer, events.EventEmitter);


/**
  * Establish a connection with the printer.
  * Printer must be connected before issuing any print or disconnect commands.
  *
  * @param {number} [vendorId=0x04b8] The USB Vendor ID of the printer to connect to.
  * @param {number} [productId=0x0202] The USB Product ID of the printer to connect to.
  * @param {number} [usbEndpoint=1] The output USB Endpoint Index of the printer to connect to.
  */
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

/**
  * Disconnect from a printer.
  * Printer must be connected before calling disconnect.
  */
Printer.prototype.disconnect = function () {

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

	});

}


/**
  * Execute a printjob using a connected printer.
  * Printer must be connected before attempting a print.
  *
  * @param {Printjob} printjob Printjob to be executed by this printer.
  */
Printer.prototype.print = function (printjob) {

	var printer = this._device.interfaces[0].endpoint( this.usbEndpoint ),
		packetSize = printer.descriptor.wMaxPacketSize || 64,
		printData = printjob.printData();

	console.log( 'TOTAL QUEUE LENGTH: ' + printData.length + ' PACKET SIZE: ' + packetSize );

	var packets = [],
		packetCount = Math.ceil( printData.length / packetSize );

	for (var i = 0; i < packetCount; i++) {

		console.log('PACKET #' + i);

		var packet = new Buffer(packetSize);
		packet.fill(' ');
		//printData.slice( i*packetSize, (i+1)*packetSize ).copy(packet);
		printData.copy(packet, 0, i*packetSize, (i+1)*packetSize);

		console.log( '['+i+'] MADE PACKET OF LENGTH: ' + packet.length );
		console.log( '['+i+'] sliced from '+(i*packetSize)+' to '+((i+1)*packetSize) );

		packets.push( packet );

	}

	/*
	var packet = new Buffer(packetSize);
	packet.fill(' ');
	printData.copy(packet);
	*/

	printer.startStream(1, packetSize);

	//printer.write(packet);
	for (var idx in packets) {
		console.log('Writing packet #'+idx);
		printer.write( packets[idx] );
	}

	printer.stopStream();

	var self = this;
	//printer.on('drain', function () {});
	//printer.once('error', function () {});
	printer.once('end', function () {
		self.emit('print');
	});

}



module.exports = Printer;



