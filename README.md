Node HOIN POS-80 / POS-58
===========

A nodejs library to interact with the Excelvan/Hoin POS-80 / POS-58 printer over usb.


## Getting started

Clone the repo `git clone https://github.com/carlevans719/node-escpos.git`.
Install dependencies `sudo apt-get install libudev-dev` and `npm install`.
Plug in the printer.
```js
const { Printer, PrintJob } = require( './escpos.js' );

let myPrinter = new Printer(); // Optionally pass in the manufacturer & vendor ID(s)
let myPrintJob = new PrintJob();

myPrinter.connect(); // Optionally specify manufacturer and vendor ID(s) here too

myPrintJob.text('hello, printed world!'); // Add some plain text to the output

myPrinter.print(myPrintJob); // Send the job to the printer
```

## Example

```js
const { Printer, PrintJob } = require( './escpos.js' );

let myPrinter = new Printer();
let myPrintJob = new PrintJob();

myPrinter.connect();


// Make a pretty page...
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
```

## PrintJob

- #### text
 adds plain text to the output
 
- #### newLine
 prints a newline character
 
- #### pad
 adds vertical white-space
 
- #### setTextFormat
 (_coming soon_) set various aspects of font
 
- #### setFont
 choose font A or font B
 
- #### setBold
 set bold to true/false
 
- #### setUnderline
 set underline to true/false
 
- #### setTextAlignment
 set alignment to 'left', 'center' or 'right'
 
- #### separator
 print horizontal line
 
- #### cut
 cuts paper
 


## Printer

#### todo



## Thanks

The [python-escpos][python-escpos] team - for creating the original, Python version

[@StaduimRunner][stadiumrunner] - for their great work creating a nodejs version


[python-escpos]: https://code.google.com/p/python-escpos
[stadiumrunner]: https://github.com/StadiumRunner
