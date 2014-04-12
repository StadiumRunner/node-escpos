
var Printer = require('../lib/printer'),
	Printjob = require('../lib/printjob'),
	printer = new Printer;



exports.testConnect = function (test) {

	printer.once('connect', test.done);

	printer.connect();

}

exports.testPrint = function (test) {

	printer.once('print', test.done);

	printer.print(

		new Printjob()
			.nextLine(10)
			.text('Hello world!')
			.nextLine(10)
			.cut()

		);
	
}

exports.testDisconnect = function (test) {

	printer.once('disconnect', test.done);

	printer.disconnect();
}



