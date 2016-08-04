module.exports = {

	// Feed control sequences
	CTL_LF: [ 0x0a ], // Print and line feed
	CTL_CR: [ 0x0d ], // Carriage return
	CTL_HT: [ 0x09 ], // Horizontal tab

	// Printer hardware
	HW_INIT: [ 0x1b, 0x40 ], // Clear data in buffer and reset modes
	HW_SELECT: [ 0x1b, 0x3d, 0x01 ], // Printer select

	// Cash Drawer
	CD_KICK_2: [ 0x1b, 0x70, 0x00 ], // Sends a pulse to pin 2 []
	CD_KICK_5: [ 0x1b, 0x70, 0x01 ], // Sends a pulse to pin 5 []

	// Paper
	PAPER_FULL_CUT: [ 0x1d, 0x56, 0x42 /* could be 0x66 */ , 0x00 ], // Full cut paper
	PAPER_PART_CUT: [ 0x1d, 0x56, 0x01 ], // Partial cut paper

	// Print modes
	TXT_NORMAL: [ 0x18, 0x21, 0x00 ], // Normal text
	TXT_FONT_A: 0, // [ 0x1b, 0x4d, 0x00 ], // Font type A
	TXT_FONT_B: 1, // [ 0x1b, 0x4d, 0x01 ], // Font type B
	TXT_BOLD_OFF: 0, // [ 0x1b, 0x45, 0x00 ], // Bold font OFF
	TXT_BOLD_ON: 8, // [ 0x1b, 0x45, 0x01 ], // Bold font ON
	TXT_2HEIGHT_OFF: 0, // Double height text OFF
	TXT_2HEIGHT_OFF: 16, // [ 0x1b, 0x21, 0x10 ], // Double height text ON
	TXT_2WIDTH_OFF: 0, // Double width text OFF
	TXT_2WIDTH: 32, // [ 0x1b, 0x21, 0x20 ], // Double width text ON
	TXT_UNDERL_OFF: 0, // [ 0x1b, 0x2d, 0x00 ], // Underline font OFF
	TXT_UNDERL_ON: 128, // [ 0x1b, 0x2d, 0x01 ], // Underline font 1-dot ON

	// Text format
	TXT_ALIGN_LT: [ 0x1b, 0x61, 0x00 ], // Left justification
	TXT_ALIGN_CT: [ 0x1b, 0x61, 0x01 ], // Centering
	TXT_ALIGN_RT: [ 0x1b, 0x61, 0x02 ], // Right justification

	// Barcode format
	BARCODE_TXT_OFF: [ 0x1d, 0x48, 0x00 ], // HRI barcode chars OFF
	BARCODE_TXT_ABV: [ 0x1d, 0x48, 0x01 ], // HRI barcode chars above
	BARCODE_TXT_BLW: [ 0x1d, 0x48, 0x02 ], // HRI barcode chars below
	BARCODE_TXT_BTH: [ 0x1d, 0x48, 0x03 ], // HRI barcode chars both above and below
	BARCODE_FONT_A: [ 0x1d, 0x66, 0x00 ], // Font type A for HRI barcode chars
	BARCODE_FONT_B: [ 0x1d, 0x66, 0x01 ], // Font type B for HRI barcode chars
	BARCODE_HEIGHT: [ 0x1d, 0x68, 0x64 ], // Barcode Height [1-255]
	BARCODE_WIDTH: [ 0x1d, 0x77, 0x03 ], // Barcode Width  [2-6]
	BARCODE_UPC_A: [ 0x1d, 0x6b, 0x00, 0x00 ], // Barcode type UPC-A
	BARCODE_UPC_E: [ 0x1d, 0x6b, 0x01, 0x00 ], // Barcode type UPC-E
	BARCODE_EAN13: [ 0x1d, 0x6b, 0x02, 0x00 ], // Barcode type EAN13
	BARCODE_EAN8: [ 0x1d, 0x6b, 0x03, 0x00 ], // Barcode type EAN8
	BARCODE_CODE39: [ 0x1d, 0x6b, 0x04, 0x00 ], // Barcode type CODE39
	BARCODE_ITF: [ 0x1d, 0x6b, 0x05, 0x00 ], // Barcode type ITF

	// Image format
	S_RASTER_N: [ 0x1d, 0x76, 0x30, 0x00 ], // Set raster image normal size
	S_RASTER_2W: [ 0x1d, 0x76, 0x30, 0x01 ], // Set raster image double width
	S_RASTER_2H: [ 0x1d, 0x76, 0x30, 0x02 ], // Set raster image double height
	S_RASTER_Q: [ 0x1d, 0x76, 0x30, 0x03 ], // Set raster image quadruple

}
