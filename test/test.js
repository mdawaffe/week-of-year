const assert = require( 'assert' )
const time = require( 'time' )

let modulePath = '../'

if ( 'TEST_PRODUCTION' in process.env && process.env.TEST_PRODUCTION ) {
	modulePath = '../dist'
}

const { default: ISOWeek } = require( modulePath )

let dates = [
	[ new Date( 2004, 11, 31 ), [ 2004, 53, 5 ] ],
	[ new Date( 2005,  0,  1 ), [ 2004, 53, 6 ] ],
	[ new Date( 2005,  0,  2 ), [ 2004, 53, 7 ] ],
	[ new Date( 2005, 11, 31 ), [ 2005, 52, 6 ] ],
	[ new Date( 2006,  0,  1 ), [ 2005, 52, 7 ] ],
	[ new Date( 2006,  0,  2 ), [ 2006,  1, 1 ] ],
	[ new Date( 2006, 11, 31 ), [ 2006, 52, 7 ] ],
	[ new Date( 2007,  0,  1 ), [ 2007,  1, 1 ] ],
	[ new Date( 2007, 11, 30 ), [ 2007, 52, 7 ] ],
	[ new Date( 2007, 11, 31 ), [ 2008,  1, 1 ] ],
	[ new Date( 2008,  0,  1 ), [ 2008,  1, 2 ] ],
	[ new Date( 2008, 11, 28 ), [ 2008, 52, 7 ] ],
	[ new Date( 2008, 11, 29 ), [ 2009,  1, 1 ] ],
	[ new Date( 2008, 11, 30 ), [ 2009,  1, 2 ] ],
	[ new Date( 2008, 11, 31 ), [ 2009,  1, 3 ] ],
	[ new Date( 2009,  0,  1 ), [ 2009,  1, 4 ] ],
	[ new Date( 2009, 11, 31 ), [ 2009, 53, 4 ] ],
	[ new Date( 2010,  0,  1 ), [ 2009, 53, 5 ] ],
	[ new Date( 2010,  0,  2 ), [ 2009, 53, 6 ] ],
	[ new Date( 2010,  0,  3 ), [ 2009, 53, 7 ] ],
	[ new Date( 2010,  0,  4 ), [ 2010,  1, 1 ] ],
	[ new Date( 2016,  1, 29 ), [ 2016,  9, 1 ] ],
	[ new Date( 2017,  8, 29 ), [ 2017, 39, 5 ] ],
	[ new Date( 2017,  8, 30 ), [ 2017, 39, 6 ] ],
];

describe( 'ISOWeek', () => {
	test('should throw if called as a function', () => {
		assert.throws( () => {
			ISOWeek( new Date() )
		}, TypeError )
	})

	describe( '#format()', () => {
		test('should return 9999-W01 for #format( 9999, 1 )', () => {
			assert.equal( ISOWeek.format( 9999, 1 ), '9999-W01' )
		})

		test('should return 9999-W10 for #format( 9999, 10 )', () => {
			assert.equal( ISOWeek.format( 9999, 10 ), '9999-W10' )
		})

		test('should return 9999-W01-4 for #format( 9999, 1, 4 )', () => {
			assert.equal( ISOWeek.format( 9999, 1, 4 ), '9999-W01-4' )
		})
	} )

	describe( '#day()', () => {
		test('should return 1 for Monday', () => {
			assert.strictEqual( ISOWeek.day( new Date( 1970, 5, 1 ) ), 1 )
		})

		test('should return 2 for Tuesday', () => {
			assert.strictEqual( ISOWeek.day( new Date( 2000, 1, 1 ) ), 2 )
		})

		test('should return 3 for Wednesday', () => {
			assert.strictEqual( ISOWeek.day( new Date( 2001, 7, 22 ) ), 3 )
		})

		test('should return 4 for Thursday', () => {
			assert.strictEqual( ISOWeek.day( new Date( 2004, 1, 26 ) ), 4 )
		})

		test('should return 5 for Friday', () => {
			assert.strictEqual( ISOWeek.day( new Date( 2004, 2, 5 ) ), 5 )
		})

		test('should return 6 for Saturday', () => {
			assert.strictEqual( ISOWeek.day( new Date( 2017, 8, 30 ) ), 6 )
		})

		test('should return 7 for Sunday', () => {
			assert.strictEqual( ISOWeek.day( new Date( 2014, 8, 21 ) ), 7 )
		})

		test('should return 1 for UTC Monday', () => {
			assert.strictEqual( ISOWeek.day(
				new Date( Date.UTC( 1970, 5, 1 ) ),
				true
			), 1 )
		})
	} )

	describe( '#fromParts()', () => {
		for ( let date of dates ) {
			test( 'should return ' + ISOWeek.format( ...date[1] ) + ' for ' + date[1].toString(), () => {
				let week = ISOWeek.fromParts( ...date[1] )

				assert.equal( week.format( 'y-w-d' ), ISOWeek.format( ...date[1] ) )
			} )
		}

		for ( let date of dates ) {
			test( 'should return ' + ISOWeek.format( ...date[1] ) + ' for ' + date[1].toString() + ' UTC', () => {
				let week = ISOWeek.fromParts( ...date[1], true )

				assert.equal( week.format( 'y-w-d' ), ISOWeek.format( ...date[1] ) )
			} )
		}

		for ( let date of dates ) {
			test( 'should return ' + ISOWeek.format( ...date[1] ) + ' for [' + date[1].toString() + ']', () => {
				let week = ISOWeek.fromParts( date[1] )

				assert.equal( week.format( 'y-w-d' ), ISOWeek.format( ...date[1] ) )
			} )
		}

		for ( let date of dates ) {
			test( 'should return ' + ISOWeek.format( ...[...date[1].slice( 0, -1 ), 1 ] ) + ' for ' + date[1].slice( 0, -1 ).toString(), () => {
				let week = ISOWeek.fromParts( ...date[1].slice( 0, -1 ) )

				assert.equal( week.format( 'y-w-d' ), ISOWeek.format( ...[...date[1].slice( 0, -1 ), 1 ] ) )
			} )
		}

		for ( let date of dates ) {
			test( 'should return ' + ISOWeek.format( ...[...date[1].slice( 0, -1 ), 1 ] ) + ' for [' + date[1].slice( 0, -1 ).toString() + ']', () => {
				let week = ISOWeek.fromParts( date[1].slice( 0, -1 ) )

				assert.equal( week.format( 'y-w-d' ), ISOWeek.format( ...[...date[1].slice( 0, -1 ), 1 ] ) )
			} )
		}
	} )

	describe( '#fromString()', () => {
		for ( let date of dates ) {
			test( 'should return ' + ISOWeek.format( ...date[1] ) + ' for ' + ISOWeek.format( ...date[1] ), () => {
				let input = ISOWeek.format( ...date[1] )
				let week = ISOWeek.fromString( input )

				assert.equal( week.format( 'y-w-d' ), input )
			} )
		}

		for ( let date of dates ) {
			test( 'should return ' + ISOWeek.format( ...date[1] ) + ' for ' + ISOWeek.format( ...date[1] ) + ' UTC', () => {
				let input = ISOWeek.format( ...date[1] )
				let week = ISOWeek.fromString( input, true )

				assert.equal( week.format( 'y-w-d' ), input )
			} )
		}

		for ( let date of dates ) {
			test( 'should return ' + ISOWeek.format( ...[...date[1].slice( 0, -1 ), 1 ] ) + ' for ' + ISOWeek.format( ...date[1].slice( 0, -1 ) ), () => {
				let input = ISOWeek.format( ...date[1].slice( 0, -1 ) )
				let week = ISOWeek.fromString( input )

				assert.equal( week.format( 'y-w-d' ), ISOWeek.format( ...[...date[1].slice( 0, -1 ), 1 ] ) )
			} )
		}
	} )

	describe( 'constructor', () => {
		// January 1st, 2007 is a Monday
		// Set the timezone to something behind UTC, so that in UTC, we're in
		// 2007 and in the local timezone, we're in 2006.
		let date = new time.Date( 2006, 11, 31, 23, 59, 59, 'America/New_York' )

		test('should set the .date property to the date input', () => {
			let week = new ISOWeek( date )
			assert.equal( week.date, date )
		})

		test('should set the .utc property to the utc input', () => {
			let week = new ISOWeek( date )
			assert.strictEqual( week.utc, false )

			let weekUTC = new ISOWeek( date, true )
			assert.strictEqual( weekUTC.utc, true )
		})

		test('should examine the date as UTC if utc is true', () => {
			let week = new ISOWeek( date, true )

			assert.strictEqual( week.year(), 2007 )
		})

		test('should not examine the date as UTC if utc is false', () => {
			let week = new ISOWeek( date, false )

			assert.strictEqual( week.year(), 2006 )
		})

		test('should not examine the date as UTC if utc is not passed', () => {
			let week = new ISOWeek( date )

			assert.strictEqual( week.year(), 2006 )
		})

		test('should not have own props other than .date, .utc', () => {
			let week = new ISOWeek( date )
			let expected = [ 'date', 'utc' ]

			expect( Object.getOwnPropertyNames( week ) ).toEqual( expected )
		})
	} )

	describe( '.parts()', () => {
		for ( let date of dates ) {
			test( 'should return ' + date[1].toString() + ' for ' + date[0].toISOString().split( 'T' )[0], () => {
				let week = new ISOWeek( date[0] )
				let parts = week.parts()

				assert.strictEqual( Array.isArray( parts ), true )
				assert.equal( parts.toString(), date[1].toString() )
			} )
		}
	} )

	describe( '.year()', () => {
		for ( let date of dates ) {
			test( 'should return ' + date[1][0] + ' for ' + date[0].toISOString().split( 'T' )[0], () => {
				let week = new ISOWeek( date[0] )
				let year = week.year()

				assert.equal( typeof year, 'number' )
				assert.strictEqual( year, date[1][0] )
			} )
		}
	} )

	describe( '.week()', () => {
		for ( let date of dates ) {
			test( 'should return ' + date[1][1] + ' for ' + date[0].toISOString().split( 'T' )[0], () => {
				let week = new ISOWeek( date[0] )
				let theWeek = week.week()

				assert.equal( typeof theWeek, 'number' )
				assert.strictEqual( theWeek, date[1][1] )
			} )
		}
	} )

	describe( '.day()', () => {
		for ( let date of dates ) {
			test( 'should return ' + date[1][2] + ' for ' + date[0].toISOString().split( 'T' )[0], () => {
				let week = new ISOWeek( date[0] )
				let day = week.day()

				assert.equal( typeof day, 'number' )
				assert.strictEqual( day, date[1][2] )
			} )
		}
	} )

	describe( '.format()', () => {
		let week = new ISOWeek( new Date( Date.UTC( 2017, 8, 29 ) ), true )

		let weekAndDayFormats = [ 'YYYY-WWW-D', 'YYYY-WWW-d', 'Y-W-D', 'y-w-d' ]
		for ( let format of weekAndDayFormats ) {
			test('should return 2017-W39-5 for 2017-09-29 with format ' + format, () => {
				assert.equal( week.format( format ), '2017-W39-5' )
			})
		}

		test('should return 2017-W39-5 for 2017-09-29 without format', () => {
			assert.equal( week.format(), '2017-W39-5' )
		})

		let weekOnlyFormats = [ 'YYYY-WWW', 'Y-W', 'Y-w', 'y-w' ]
		for ( let format of weekOnlyFormats ) {
			test('should return 2017-W39 for 2017-09-29 with format ' + format, () => {
				assert.equal( week.format( format ), '2017-W39' )
			})
		}
	} )

	describe( '.valueOf()', () => {
		let date = new Date( Date.UTC( 2017, 8, 29 ) )
		let week = new ISOWeek( date, true )

		assert.equal( week.valueOf(), date.valueOf() )
	} )
} )
