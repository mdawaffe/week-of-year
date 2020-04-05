"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PARTS = Symbol('PARTS');

var ISOWeek = /*#__PURE__*/function () {
  function ISOWeek(date) {
    var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, ISOWeek);

    this.date = date;
    this.utc = utc;
    this[PARTS] = ISOWeekDateParts(date, utc);
  }

  _createClass(ISOWeek, [{
    key: "parts",
    value: function parts() {
      return this[PARTS];
    }
  }, {
    key: "year",
    value: function year() {
      return this[PARTS][0];
    }
  }, {
    key: "week",
    value: function week() {
      return this[PARTS][1];
    }
  }, {
    key: "day",
    value: function day() {
      return this[PARTS][2];
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      return this.date.valueOf();
    }
    /**
     * Not very smart :)
     * @param {string} [format=ymd]:
     * 	YYYY-WWW-D
     * 	YYYY-WWW
     * 	y-w-d
     * 	y-w
     * @returns {string}
     */

  }, {
    key: "format",
    value: function format() {
      var _format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ywd';

      var parts = this[PARTS];
      _format = Array.from(new Set(('-' + _format).toLowerCase().split(''))).join('');

      switch (_format) {
        case '-yw':
          return ISOWeek.format.apply(null, parts.slice(0, 2));

        case '-ywd':
        default:
          return ISOWeek.format.apply(null, parts);
      }
    }
  }], [{
    key: "format",
    value: function format(year, week) {
      var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var formatted = '' + year + '-W' + week.toString().padStart(2, '0');

      if (undefined === day) {
        return formatted;
      }

      return formatted + '-' + day;
    }
  }, {
    key: "day",
    value: function day(date) {
      var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return ISODayOfWeek(date, utc);
    }
  }, {
    key: "fromParts",
    value: function fromParts(year, week) {
      var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var utc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (Array.isArray(year) && 1 < year.length) {
        utc = week || false;
        var _year = year;

        var _year2 = _slicedToArray(_year, 3);

        year = _year2[0];
        week = _year2[1];
        var _year2$ = _year2[2];
        day = _year2$ === void 0 ? 1 : _year2$;
      }

      var _map = [year, week, day].map(function (n) {
        return parseInt(n, 10);
      });

      var _map2 = _slicedToArray(_map, 3);

      year = _map2[0];
      week = _map2[1];
      day = _map2[2];
      var first = new ISOWeek(utc ? new Date(Date.UTC(year, 0, 4)) : new Date(year, 0, 4), utc);
      var doy = week * 7 + day - (first.day() + 3);
      return new ISOWeek(new Date(first.valueOf() + (doy - 1 - 3) * 24 * 3600 * 1000), utc);
    }
  }, {
    key: "fromString",
    value: function fromString(weekString) {
      var utc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var _weekString$split = weekString.split('-'),
          _weekString$split2 = _slicedToArray(_weekString$split, 3),
          year = _weekString$split2[0],
          week = _weekString$split2[1],
          _weekString$split2$ = _weekString$split2[2],
          day = _weekString$split2$ === void 0 ? 1 : _weekString$split2$;

      week = week.replace('W', '');
      return ISOWeek.fromParts(year, week, day, utc);
    }
  }]);

  return ISOWeek;
}(); // http://www.proesite.com/timex/wkcalc.htm


exports["default"] = ISOWeek;

function ISOWeekDateParts(date, utc) {
  var year = date[utc ? 'getUTCFullYear' : 'getFullYear']();
  var month = date[utc ? 'getUTCMonth' : 'getMonth']() + 1;
  var day = date[utc ? 'getUTCDate' : 'getDate'](); // Monday = 1, Sunday = 7

  var dow = ISODayOfWeek(date, utc);
  var dowOrig = dow; // Always use UTC for getting the DoW for the first day of the year
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
  } // JAZZ HANDS!


  return [year, (dow1 - 1 < 4) + 4 * (month - 1) + ((2 * month + day + dow1 - dow + 3) * 9 >> 6), dowOrig];
}
/**
 * Monday = 1
 * Sunday = 7
 * @param {Date} date
 * @param {boolean} utc Whether to treat date as UTC
 * @returns {number}
 */


function ISODayOfWeek(date, utc) {
  return 1 + (date[utc ? 'getUTCDay' : 'getDay']() + 6) % 7;
}
