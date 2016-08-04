const usb = require( 'usb' );
const events = require( 'events' );

/**
 * Creates a new Printer object that is ready to connect to an attached USB escpos printer.
 *
 * You can get the vendorId and productId by issuing this command on the command line:
 * `lsusb`
 *
 * @class
 * @property {number} [vendorId=0x0471] The USB Vendor ID of the printer to connect to.
 * @property {number} [productId=0x0055] The USB Product ID of the printer to connect to.
 */
class Printer extends events.EventEmitter {

	constructor( vendorId, productId ) {
		super();
		this.vendorId = vendorId || 0x0471;
		this.productId = productId || 0x0055;
		this._device = undefined;

		return this;
	}

	/**
	 * Establish a connection with the printer.
	 * Printer must be connected before issuing any print or disconnect commands.
	 *
	 * @param {number} [vendorId=0x04b8] The USB Vendor ID of the printer to connect to.
	 * @param {number} [productId=0x0202] The USB Product ID of the printer to connect to.
	 */
	connect( vendorId = this.vendorId, productId = this.productId, callback = () => {} ) {
		let device = usb.findByIds( vendorId, productId );
		device.open();

		let iface = device.interfaces[ 0 ];
		if ( iface.isKernelDriverActive() ) iface.detachKernelDriver();
		iface.claim();
		this._device = device;

		callback( null, true );
		this.emit( 'connect' );

		return device;
	}

	/**
	 * Disconnect from a printer.
	 * Printer must be connected before calling disconnect.
	 */
	disconnect( callback = () => {} ) {

		this._device.interfaces[ 0 ].release( error => {
			if ( error ) {
				callback( error, null );
				return this.emit( 'error', error );
			}

			this._device.interfaces[ 0 ].attachKernelDriver();
			this._device.close();
			this._device = undefined;

			callback( null, true );
			this.emit( 'disconnect' );
		} );

	}

	/**
	 * Execute a printJob using a connected printer.
	 * Printer must be connected before attempting a print.
	 *
	 * @param {Printjob} printJob Printjob to be executed by this printer.
	 */
	print( printJob, callback = () => {} ) {
		if ( !printJob ) throw new Error( 'A print job is required' );

		let inEndpoint = this._device.interfaces[ 0 ].endpoints[ 0 ],
			outEndpoint = this._device.interfaces[ 0 ].endpoints[ 1 ],
			packetSize = outEndpoint.descriptor.wMaxPacketSize || 64,
			printData = printJob.printData(),
			packets = [],
			packetCount = Math.ceil( printData.length / packetSize );

		for ( let i = 0; i < packetCount; i++ ) {
			let packet = new Buffer( packetSize );

			packet.fill( ' ' );
			printData.copy( packet, 0, i * packetSize, ( i + 1 ) * packetSize );
			packets.push( packet );
		}

		inEndpoint.startPoll( 1, packetSize );

		for ( const idx in packets ) {
			outEndpoint.transfer( packets[ idx ] );
		}

		inEndpoint.stopPoll();

		callback( null, true );
		this.emit( 'print' );
	}

	// status( status ) {
	// 	const statuses = {
	// 		1: [ 0x10, 0x04, 0x01 ],
	// 		2: [ 0x10, 0x04, 0x02 ],
	// 		3: [ 0x10, 0x04, 0x03 ],
	// 		4: [ 0x10, 0x04, 0x04 ]
	// 	};
	//
	// 	const cmd = statuses[ status ];
	// 	if ( cmd ) {
	// 		// transmit
	// 	} else {
	// 		throw new Error( 'Status must be one of ' + Object.keys( statuses ).join( ', ' ) );
	// 	}
	// }
}

module.exports = Printer;
