'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _leftPad = require('left-pad');

var _leftPad2 = _interopRequireDefault(_leftPad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PARTS = Symbol('PARTS');

var ISOWeek = function () {
	function ISOWeek(date) {
		var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		_classCallCheck(this, ISOWeek);

		this.date = date;
		this.utc = utc;
		this[PARTS] = ISOWeekDateParts(date, utc);
	}

	_createClass(ISOWeek, [{
		key: 'parts',
		value: function parts() {
			return this[PARTS];
		}
	}, {
		key: 'year',
		value: function year() {
			return this[PARTS][0];
		}
	}, {
		key: 'week',
		value: function week() {
			return this[PARTS][1];
		}
	}, {
		key: 'day',
		value: function day() {
			return this[PARTS][2];
		}

		/**
   * Not very smart :)
   * YYYY-WWW-D
   * YYYY-WWW
   * y-w-d
   * y-w
   */

	}, {
		key: 'format',
		value: function format() {
			var _format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ywd';

			var parts = this[PARTS];

			_format = Array.from(new Set(('-' + _format).toLowerCase().split(''))).join('');

			switch (_format) {
				case '-yw':
					return ISOWeek.format.apply(null, parts.slice(0, 2));
				case '-ywd':
					return ISOWeek.format.apply(null, parts);
			}
		}
	}], [{
		key: 'format',
		value: function format(year, week) {
			var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

			var formatted = '' + year + '-W' + (0, _leftPad2.default)(week, 2, '0');

			if (undefined === day) {
				return formatted;
			}

			return formatted + '-' + day;
		}
	}, {
		key: 'day',
		value: function day(date) {
			var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			return ISODayOfWeek(date, utc);
		}
	}]);

	return ISOWeek;
}();

// http://www.proesite.com/timex/wkcalc.htm


exports.default = ISOWeek;
function ISOWeekDateParts(date, utc) {
	var year = date[utc ? 'getUTCFullYear' : 'getFullYear']();
	var month = date[utc ? 'getUTCMonth' : 'getMonth']() + 1;
	var day = date[utc ? 'getUTCDate' : 'getDate']();

	// Monday = 1, Sunday = 7
	var dow = ISODayOfWeek(date, utc);
	var dowOrig = dow;

	// Always use UTC for getting the DoW for the first day of the year
	// It doesn't matter which we use as long as we ignore the utc parameter.
	var first = new Date(Date.UTC(year, 0, 1));
	var dow1 = ISODayOfWeek(first, true);

	if (1 === month && 4 < dow1 && dow1 < 9 - day) {
		// If January 1st is a Friday, Saturday or Sunday,
		// it belongs in the last week of the previous year.
		// If our date is in the beginning of January,
		// it will be in that same last week.
		// We still have to go through the calculation, though
		// since the last week could be week 52 or 53 depending
		// on the year. So let's look at the week number for
		// December 31st of the previous year.
		dow = dow1 - 1; // the day before is December 31st
		year = year - 1; // the previous year
		first = new Date(Date.UTC(year, 0, 1));
		dow1 = ISODayOfWeek(first, true);
		month = 12;
		day = 31;
	} else if (12 === month) {
		// As above, if our date is late in December,
		// it may be part of the first week of the next year.
		// This is simpler, since the first week is always week 1.
		var firstOfNext = new Date(Date.UTC(year + 1, 0, 1));
		var dow1n = ISODayOfWeek(firstOfNext, true);
		if (32 - day < dow1n && dow1n < 5) {
			return [year + 1, 1, dow];
		}
	}

	// JAZZ HANDS!
	return [year, (dow1 - 1 < 4) + 4 * (month - 1) + ((2 * (month - 1) + (day - 1) + dow1 - dow + 6) * 9 >> 6), dowOrig];
}

/**
 * Monday = 1
 * Sunday = 7
 */
function ISODayOfWeek(date, utc) {
	return 1 + (date[utc ? 'getUTCDay' : 'getDay']() + 6) % 7;
}
