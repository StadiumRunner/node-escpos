
var iconv = require('iconv-lite'),
	cmds = require('./commands');



var Printjob = function () {

	this._queue = [];

}



Printjob.prototype = {

	text: function (str) {

		this._queue.push( iconv.encode(str, 'cp437') );

		return this;

	},

	nextLine: function (count) {

		count = count || 1;

		var buf = new Buffer( cmds.CTL_LF );
		for (var i = 0; i < count; i++) {
			this._queue.push(buf);
		}

		return this;

	},

	cut: function () {

		var buf = new Buffer( cmds.PAPER_FULL_CUT );
		this._queue.push( buf );

		return this;

	},

	printData: function () {

		// Prepend init command to print queue

		var init = new Buffer( cmds.HW_INIT );
		var feed = new Buffer( cmds.CTL_FF );

		var queue = [ init, feed ].concat( this._queue );

		return Buffer.concat(queue);

	}

}



module.exports = Printjob;



