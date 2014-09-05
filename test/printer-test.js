
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
			.text('Hello world!')
			.newLine(2)
			.cut()

		);
	
}

/*
exports.testLongPrint = function (test) {

	printer.once('print', test.done);

	var job = new Printjob;

	for (var i = 0; i < 100; i++) {
		job.text( i + ' Hello world!' ).newLine();
	}

	job.newLine(2).cut();

	printer.print(job);

}
*/

exports.testDisconnect = function (test) {

	printer.once('disconnect', test.done);

	printer.disconnect();
}



