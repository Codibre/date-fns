/* eslint-env mocha */

import assert from 'assert';
import addMonths from './index';
import { getDstTransitions } from '../../test/dst/tzOffsetTransitions';

describe('addMonths', () => {
	it('adds the given number of months', () => {
		const result = addMonths(new Date(2014, 8 /* Sep */, 1), 5);
		assert.deepStrictEqual(result, new Date(2015, 1 /* Feb */, 1));
	});

	it('accepts a timestamp', () => {
		const result = addMonths(new Date(2014, 8 /* Sep */, 1).getTime(), 12);
		assert.deepStrictEqual(result, new Date(2015, 8 /* Sep */, 1));
	});

	it('does not mutate the original date', () => {
		const date = new Date(2014, 8 /* Sep */, 1);
		addMonths(date, 12);
		assert.deepStrictEqual(date, new Date(2014, 8 /* Sep */, 1));
	});

	it('works well if the desired month has fewer days and the provided date is in the last day of a month', () => {
		const date = new Date(2014, 11 /* Dec */, 31);
		const result = addMonths(date, 2);
		assert.deepStrictEqual(result, new Date(2015, 1 /* Feb */, 28));
	});

	it('handles dates before 100 AD', () => {
		const initialDate = new Date(0);
		initialDate.setFullYear(0, 0 /* Jan */, 31);
		initialDate.setHours(0, 0, 0, 0);
		const expectedResult = new Date(0);
		expectedResult.setFullYear(0, 1 /* Feb */, 29);
		expectedResult.setHours(0, 0, 0, 0);
		const result = addMonths(initialDate, 1);
		assert.deepStrictEqual(result, expectedResult);
	});

	it('returns `Invalid Date` if the given date is invalid', () => {
		const result = addMonths(new Date(NaN), 5);
		assert(result instanceof Date && isNaN(result.getTime()));
	});

	it('returns `Invalid Date` if the given amount is NaN', () => {
		const result = addMonths(new Date(2014, 8 /* Sep */, 1), NaN);
		assert(result instanceof Date && isNaN(result.getTime()));
	});

	const dstTransitions = getDstTransitions(2017);
	const dstOnly = dstTransitions.start && dstTransitions.end ? it : it.skip;
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || process.env.tz;
	const HOUR = 1000 * 60 * 60;
	const override = (
		base: Date,
		year = base.getFullYear(),
		month = base.getMonth(),
		day = base.getDate(),
		hour = base.getHours(),
		minute = base.getMinutes(),
	) => new Date(year, month, day, hour, minute);

	dstOnly(
		`works at DST-start boundary in local timezone: ${tz || '(unknown)'}`,
		() => {
			const date = dstTransitions.start;
			const result = addMonths(date, 2);
			assert.deepStrictEqual(
				result,
				override(date, date.getFullYear(), date.getMonth() + 2),
			);
		},
	);

	dstOnly(
		`works at DST-start - 30 mins in local timezone: ${tz || '(unknown)'}`,
		() => {
			const date = new Date(dstTransitions.start!.getTime() - 0.5 * HOUR);
			const result = addMonths(date, 2);
			const expected = override(date, date.getFullYear(), date.getMonth() + 2);
			assert.deepStrictEqual(result, expected);
		},
	);

	dstOnly(
		`works at DST-start - 60 mins in local timezone: ${tz || '(unknown)'}`,
		() => {
			const date = new Date(dstTransitions.start!.getTime() - 1 * HOUR);
			const result = addMonths(date, 2);
			const expected = override(date, date.getFullYear(), date.getMonth() + 2);
			assert.deepStrictEqual(result, expected);
		},
	);

	dstOnly(
		`works at DST-end boundary in local timezone: ${tz || '(unknown)'}`,
		() => {
			const date = dstTransitions.end;
			const result = addMonths(date, 2);
			assert.deepStrictEqual(
				result,
				override(
					date,
					date.getFullYear() + (date.getMonth() >= 10 ? 1 : 0),
					(date.getMonth() + 2) % 12, // protect against wrap for Nov.
				),
			);
		},
	);

	dstOnly(
		`works at DST-end - 30 mins in local timezone: ${tz || '(unknown)'}`,
		() => {
			const date = new Date(dstTransitions.end!.getTime() - 0.5 * HOUR);
			const result = addMonths(date, 2);
			assert.deepStrictEqual(
				result,
				override(
					date,
					date.getFullYear() + (date.getMonth() >= 10 ? 1 : 0),
					(date.getMonth() + 2) % 12, // protect against wrap for Nov.
				),
			);
		},
	);

	dstOnly(
		`works at DST-end - 60 mins in local timezone: ${tz || '(unknown)'}`,
		() => {
			const date = new Date(dstTransitions.end!.getTime() - 1 * HOUR);
			const result = addMonths(date, 2);
			assert.deepStrictEqual(
				result,
				override(
					date,
					date.getFullYear() + (date.getMonth() >= 10 ? 1 : 0),
					(date.getMonth() + 2) % 12, // protect against wrap for Nov.
				),
			);
		},
	);

	dstOnly(
		`doesn't mutate if zero increment is used: ${tz || '(unknown)'}`,
		() => {
			const date = new Date(dstTransitions.end!);
			const result = addMonths(date, 0);
			assert.deepStrictEqual(result, date);
		},
	);
});
