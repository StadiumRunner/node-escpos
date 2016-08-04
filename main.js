const { Printer, PrintJob } = require( './escpos.js' );

let myPrinter = new Printer();
let myPrintJob = new PrintJob();

myPrinter.connect();


// Make a pretty page...
myPrintJob.setTextFormat( 'quad' ); // TODO: setTextFormat doesn't work
myPrintJob.pad( 1 ); // add some padding
myPrintJob.text( 'This is line 1' ); // add some text

myPrintJob.setTextAlignment( 'center' ); // change the text alignment
myPrintJob.separator(); // draw a horizontal line

myPrintJob.setTextAlignment( 'right' );
myPrintJob.text( 'This is line 2' );

myPrintJob.setTextAlignment( 'center' );
myPrintJob.separator();

myPrintJob.text( 'And line 3' );

myPrintJob.pad( 1 );
myPrintJob.cut(); // slice dat.

// Send the printJob to the printer
myPrinter.print( myPrintJob, function () {
	console.log( "It's finished printing!!" );
} );
