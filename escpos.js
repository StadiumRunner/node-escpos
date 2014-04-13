
/**
 * @module escpos
 */

module.exports = {

	/** Printer object used for connecting, disconnecting,
	  * and printing to an attached USB escpos printer.
	  */
	printer: require('./lib/printer'),
	
	/** Printjob object used for creating printable
	  * documents that can be sent to a printer object.
	  */
	printjob: require('./lib/printjob')

}
