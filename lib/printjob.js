
var iconv = require('iconv-lite'),
	cmds = require('./commands');



/**
 * Creates a new Printjob object that can process escpos commands
 * which can then be printed with an attached USB escpos printer.
 *
 * @class
 */
var Printjob = function () {

	this._queue = [];

}



Printjob.prototype = {

	/**
	  * Add a string of text to the printjob.
	  *
	  * @param {string} text Text string to be added to the current printjob.
	  */
	text: function (text) {

		this._queue.push( iconv.encode(text, 'cp437') );

		return this;

	},

	/**
	  * Add new line(s) to the printjob.
	  *
	  * @param {number} [count=1] Number of new lines to be added to the current printjob.
	  */
	newLine: function (count) {

		// DEFAULTS
		count = count || 1;

		var buf = new Buffer([ cmds.CTL_CR, cmds.CTL_LF ]);
		for (var i = 0; i < count; i++) {
			this._queue.push(buf);
		}

		return this;

	},

	pad: function (count) {

		// DEFAULTS
		count = count || 1;

		var buf = new Buffer([ 0x1b, 0x4a, 0xff, 0x1b, 0x4a, 0xff ]);
		for (var i = 0; i < count; i++) {
			this._queue.push(buf);
		}

		return this;

	},

	/**
	  * Set text formatting for the current printjob.
	  *
	  * @param {string} [format='normal'] Text format (one of: 'normal', 'tall', 'wide')
	  */
	setTextFormat: function (format) {

		// DEFAULTS
		format = format.toLowerCase() || 'normal';

		var formats = {
			normal: 	cmds.TXT_NORMAL,
			tall: 		cmds.TXT_2HEIGHT,
			wide: 		cmds.TXT_2WIDTH
		};

		var cmd = formats[ format ];

		if (cmd) {
			var buf = new Buffer(cmd);
			this._queue.push(buf);
		}
		else {
			throw new Error('Text format must be one of: ', Object.keys(formats).join(', '));
		}

		return this;

	},

	/**
	  * Set text alignment for the current printjob.
	  *
	  * @param {string} [count='left'] Text alignment (one of: 'left', 'center', 'right')
	  */
	setTextAlignment: function (align) {

		// DEFAULTS
		align = align.toLowerCase() || 'left';

		var aligns = {
			left: 		cmds.TXT_ALIGN_LT,
			center: 	cmds.TXT_ALIGN_CT,
			right: 		cmds.TXT_ALIGN_RT
		};

		var cmd = aligns[ align ];

		if (cmd) {
			var buf = new Buffer(cmd);
			this._queue.push(buf);
		}
		else {
			throw new Error('Text alignment must be one of: ', Object.keys(aligns).join(', '));
		}

		return this;

	},

	/**
	  * Set underline for the current printjob.
	  *
	  * @param {boolean} [underline=true] Enables/disables underlined text
	  */
	setUnderline: function (underline) {

		// DEFAULTS
		if (typeof underline !== 'boolean') {
			underline = true;
		}

		var cmd = underline ? cmds.TXT_UNDERL_ON : cmds.TXT_UNDERL_OFF;
		var buf = new Buffer(cmd);
		this._queue.push(buf);

		return this;

	},

	/**
	  * Set text bold for the current printjob.
	  *
	  * @param {boolean} [bold=true] Enables/disables bold text
	  */
	setBold: function (bold) {

		// DEFAULTS
		if (typeof bold !== 'boolean') {
			bold = true;
		}

		var cmd = bold ? cmds.TXT_BOLD_ON : cmds.TXT_BOLD_OFF;
		var buf = new Buffer(cmd);
		this._queue.push(buf);

		return this;

	},

	/**
	  * Set text font for the current printjob.
	  *
	  * @param {string} [font='A'] Text font (one of: 'A', 'B')
	  */
	setFont: function (font) {

		// DEFAULTS
		font = font.toUpperCase() || 'A';

		var fonts = {
			A: 	cmds.TXT_NORMAL,
			B: 	cmds.TXT_2HEIGHT
		};

		var cmd = fonts[ font ];

		if (cmd) {
			var buf = new Buffer(cmd);
			this._queue.push(buf);
		}
		else {
			throw new Error('Font must be one of: ', Object.keys(fonts).join(', '));
		}

		return this;

	},

	separator: function () {

		var i = 0
		var line = ''
		var width = 42;
		while (i < width) {
			line += '-'
			i++
		}

		return this.text(line);

	},

	/**
	  * Cuts paper on the current printjob.
	  */
	cut: function () {

		var buf = new Buffer( cmds.PAPER_FULL_CUT );
		this._queue.push(buf);

		return this;

	},

	/**
	  * Kicks cash drawer on the current printjob.
	  * Default parameters are for Epson TM-88V from: http://keyhut.com/popopen.htm
	  *
	  * @param {number} [pin=2] Pin number used to send the pulse (one of: 2, 5)
	  * @param {number} [t1=110] Pulse ON time in ms (0 <= t1 <= 510)
	  * @param {number} [t2=242] Pulse OFF time in ms (0 <= t2 <= 510)
	  */
	cashdraw: function (pin, t1, t2) {

		// DEFAULTS
		pin = pin || 2;
		t1 = t1 || 110;
		t2 = t2 || 242;

		var buf = new Buffer(5);

		if (pin == 2) {
			new Buffer( cmds.CD_KICK_2 ).copy(buf);
		}
		else if (pin == 5) {
			new Buffer( cmds.CD_KICK_5 ).copy(buf);
		}
		else {
			throw new Error('Pin must be one of: 2, 5');
		}

		if (t1 >= 0 && t2 >= 0 && t1 <= 242 && t2 <= 242) {
			// Pulse ON/OFF times in 2ms increments
			buf.writeUInt8(t1/2, 3);
			buf.writeUInt8(t2/2, 4);
		}
		else {
			throw new Error('Pulse timings must be between 0 and 242 inclusive.');
		}

		this._queue.push(buf);

		return this;

	},

	printData: function () {

		var init = new Buffer( cmds.HW_INIT );
		
		var queue = this._queue.slice(0);	// Clone queue
		queue.unshift(init);				// Prepend init command

		return Buffer.concat(queue);

	}

}



module.exports = Printjob;



