const iconv = require( 'iconv-lite' );
const cmds = require( './commands' );


/**
 * Creates a new Printjob object that can process escpos commands
 * which can then be printed with an attached USB escpos printer.
 *
 * @class
 */
class Printjob {

	constructor() {
		this._queue = [];
		this._textFormat = {
			TXT_FONT_B: false,
			TXT_BOLD_ON: false,
			TXT_2HEIGHT: false,
			TXT_2WIDTH: false,
			TXT_UNDERL_ON: false
		};

		return this;
	}

	/**
	 * Add a string of text to the printjob.
	 *
	 * @param {string} text Text string to be added to the current printjob.
	 */
	text( text ) {
		this._queue.push( iconv.encode( text, 'cp437' ) );

		return this;
	}

	/**
	 * Add new line(s) to the printjob.
	 *
	 * @param {number} [count=1] Number of new lines to be added to the current printjob.
	 */
	newLine( count = 1 ) {
		const buf = new Buffer( [ cmds.CTL_CR, cmds.CTL_LF ] );
		for ( let i = 0; i < count; i++ ) {
			this._queue.push( buf );
		}

		return this;
	}

	pad( count = 1 ) {
		const buf = new Buffer( [ 0x1b, 0x4a, 0xff, 0x1b, 0x4a, 0xff ] );
		for ( let i = 0; i < count; i++ ) {
			this._queue.push( buf );
		}

		return this;
	}

	determineTextFormatHex() {
		let baseCmd = cmds.TXT_NORMAL;
		let decVal = 0;

		for ( let format in this._textFormat ) {
			if ( this._textFormat.hasOwnProperty( format ) ) {
				if ( this._textFormat[ format ] ) decVal += cmds[ format ];
			}
		}

		baseCmd[ baseCmd.length - 1 ] = decVal.toString( 16 );
		return baseCmd;
	}

	/**
	 * Set text formatting for the current printjob.
	 *
	 * @param {string} [format='normal'] Text format (one of: 'normal', 'tall', 'wide')
	 */
	setTextFormat( format = 'normal' ) {
		format = format.toLowerCase();

		if ( format === 'normal' ) {
			for ( let key in this._textFormat ) {
				if ( this._textFormat.hasOwnProperty( key ) ) {
					this._textFormat[ key ] = false;
				}
			}
		} else if ( format === 'tall' ) {
			this._textFormat.TXT_2HEIGHT = true;
		} else if ( format === 'wide' ) {
			this._textFormat.TXT_2WIDTH = true;
		} else if ( format === 'quad' ) {
			this._textFormat.TXT_2HEIGHT = true;
			this._textFormat.TXT_2WIDTH = true;
		} else if ( format === 'bold' ) {
			this._textFormat.TXT_BOLD_ON = true;
		} else if ( format === 'underlined' ) {
			this._textFormat.TXT_UNDERL_ON = true;
		} else {
			throw new Error( 'Text format must be one of: normal, tall, wide, quad, bold, underlined' );
		}

		const cmd = this.determineTextFormatHex();

		if ( cmd !== undefined ) {
			const buf = new Buffer( cmd );
			this._queue.push( buf );
		}

		return this;
	}

	/**
	 * Set text alignment for the current printjob.
	 *
	 * @param {string} [count='left'] Text alignment (one of: 'left', 'center', 'right')
	 */
	setTextAlignment( align = 'left' ) {
		align = align.toLowerCase();

		const aligns = {
			left: cmds.TXT_ALIGN_LT,
			center: cmds.TXT_ALIGN_CT,
			right: cmds.TXT_ALIGN_RT
		};

		const cmd = aligns[ align ];

		if ( cmd ) {
			const buf = new Buffer( cmd );
			this._queue.push( buf );
		} else {
			throw new Error( 'Text alignment must be one of: ', Object.keys( aligns ).join( ', ' ) );
		}

		return this;
	}

	/**
	 * Set underline for the current printjob.
	 *
	 * @param {boolean} [underline=true] Enables/disables underlined text
	 */
	setUnderline( underline ) {
		if ( typeof underline !== 'boolean' ) {
			underline = true;
		}

		this._textFormat.TXT_UNDERL_ON = underline;
		const cmd = this.determineTextFormatHex();
		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Set text bold for the current printjob.
	 *
	 * @param {boolean} [bold=true] Enables/disables bold text
	 */
	setBold( bold ) {
		if ( typeof bold !== 'boolean' ) {
			bold = true;
		}

		this._textFormat.TXT_BOLD_ON = bold;
		const cmd = this.determineTextFormatHex();
		const buf = new Buffer( cmd );
		this._queue.push( buf );

		return this;
	}

	/**
	 * Set text font for the current printjob.
	 *
	 * @param {string} [font='A'] Text font (one of: 'A', 'B')
	 */
	setFont( font = 'A' ) {
		font = font.toUpperCase();

		if ( font === 'A' ) {
			this._textFormat.TXT_FONT_B = false;
		} else if ( font === 'B' ) {
			this._textFormat.TXT_FONT_B = true;
		} else {
			throw new Error( 'Font must be one of: A, B' );
		}

		const cmd = this.determineTextFormatHex();

		if ( cmd ) {
			const buf = new Buffer( cmd );
			this._queue.push( buf );
		}

		return this;
	}

	separator() {
		let line = '';
		let i = 0;
		let width = 42;

		while ( i < width ) {
			line += '-';
			i++;
		}

		return this.newLine() && this.text( line ) && this.newLine();
	}

	/**
	 * Cuts paper on the current printjob.
	 */
	cut() {

		const buf = new Buffer( cmds.PAPER_FULL_CUT );
		this._queue.push( buf );

		return this;
	}

	printData() {
		const init = new Buffer( cmds.HW_INIT );
		let queue = this._queue.slice( 0 ); // Clone queue

		queue.unshift( init ); // Prepend init command

		return Buffer.concat( queue );
	}

}

module.exports = Printjob;
