const PARTS = Symbol( 'PARTS' )

export default class ISOWeek {
	constructor( date, utc = false ) {
		this.date = date
		this.utc = utc
		this[PARTS] = ISOWeekDateParts( date, utc )
	}

	parts() {
		return this[PARTS]
	}

	year() {
		return this[PARTS][0]
	}

	week() {
		return this[PARTS][1]
	}

	day() {
		return this[PARTS][2]
	}

	valueOf() {
		return this.date.valueOf()
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
	format( format = 'ywd' ) {
		let parts = this[PARTS]

		format = Array.from(
			new Set( ( '-' + format ).toLowerCase().split( '' ) )
		).join( '' )

		switch ( format ) {
		case '-yw' :
			return ISOWeek.format.apply( null, parts.slice( 0, 2 ) )
		case '-ywd' :
		default:
			return ISOWeek.format.apply( null, parts )
		}
	}

	static format( year, week, day = undefined ) {
		let formatted = '' + year + '-W' + week.toString().padStart( 2, '0' )

		if ( undefined === day ) {
			return formatted
		}

		return formatted + '-' + day
	}

	static day( date, utc = false ) {
		return ISODayOfWeek( date, utc )
	}

	static fromParts( year, week, day = 1, utc = false ) {
		if ( Array.isArray( year ) && 1 < year.length ) {
			utc = week || false;
			[ year, week, day = 1 ] = year
		}

		[ year, week, day ] = [ year, week, day ].map( n => parseInt( n, 10 ) )

		let first = new ISOWeek( utc ? new Date( Date.UTC( year, 0, 4 ) ) : new Date( year, 0, 4 ), utc )
		let doy = week * 7 + day - ( first.day() + 3 )

		return new ISOWeek( new Date( first.valueOf() + ( doy - 1 - 3 ) * 24 * 3600 * 1000 ), utc )
	}

	static fromString( weekString, utc = false ) {
		let [ year, week, day = 1 ] = weekString.split( '-' )
		week = week.replace( 'W', '' )

		return ISOWeek.fromParts( year, week, day, utc )
	}
}

// http://www.proesite.com/timex/wkcalc.htm
function ISOWeekDateParts( date, utc ) {
	let year = date[ utc ? 'getUTCFullYear' : 'getFullYear' ]()
	let month = date[ utc ? 'getUTCMonth' : 'getMonth' ]() + 1
	let day = date[ utc ? 'getUTCDate' : 'getDate' ]()

	// Monday = 1, Sunday = 7
	let dow = ISODayOfWeek( date, utc )
	let dowOrig = dow

	// Always use UTC for getting the DoW for the first day of the year
	// It doesn't matter which we use as long as we ignore the utc parameter.
	let first = new Date( Date.UTC( year, 0, 1 ) )
	let dow1 = ISODayOfWeek( first, true )

	if ( 1 === month && 4 < dow1 && dow1 < 9 - day ) {
		// If January 1st is a Friday, Saturday or Sunday,
		// it belongs in the last week of the previous year.
		// If our date is in the beginning of January,
		// it will be in that same last week.
		// We still have to go through the calculation, though
		// since the last week could be week 52 or 53 depending
		// on the year. So let's look at the week number for
		// December 31st of the previous year.
		dow = dow1 - 1  // the day before is December 31st
		year = year - 1 // the previous year
		first = new Date( Date.UTC( year, 0, 1 ) )
		dow1 = ISODayOfWeek( first, true )
		month = 12
		day = 31
	} else if ( 12 === month ) {
		// As above, if our date is late in December,
		// it may be part of the first week of the next year.
		// This is simpler, since the first week is always week 1.
		let firstOfNext = new Date( Date.UTC( year + 1, 0, 1 ) )
		let dow1n = ISODayOfWeek( firstOfNext, true )
		if ( 32 - day < dow1n && dow1n < 5 ) {
			return [ year + 1, 1, dow ]
		}
	}
	
	// JAZZ HANDS!
	return [
		year,

		( dow1 - 1 < 4 )
		+
		4 * ( month - 1 )
		+
		( ( ( 2 * month + day + dow1 - dow + 3 ) * 9 ) >> 6 ),

		dowOrig
	];
}

/**
 * Monday = 1
 * Sunday = 7
 * @param {Date} date
 * @param {boolean} utc Whether to treat date as UTC
 * @returns {number}
 */
function ISODayOfWeek( date, utc ) {
	return 1 + ( date[ utc ? 'getUTCDay' : 'getDay' ]() + 6 ) % 7
}
