import { millisecondsInMinute, millisecondsInHour } from './constants';
import constructFrom from './constructFrom';
import getISOWeekYear from './getISOWeekYear';
import isSaturday from './isSaturday';
import isSunday from './isSunday';
import isWeekend from './isWeekend';
import setISOWeekYear from './setISOWeekYear';
import toDate from './toDate';
import toNumber from './toNumber';
import { Duration } from './types';

/**
 * @name addMilliseconds
 * @category Millisecond Helpers
 * @summary Add the specified number of milliseconds to the given date.
 *
 * @description
 * Add the specified number of milliseconds to the given date.
 *
 * @param date - the date to be changed
 * @param amount - the amount of milliseconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns the new date with the milliseconds added
 *
 * @example
 * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
 * const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:30.750
 */
export function addMilliseconds(
	dirtyDate: Date | number,
	amount: number,
): Date {
	const timestamp = toNumber(dirtyDate);
	return new Date(timestamp + amount);
}

/**
 * @name addSeconds
 * @category Second Helpers
 * @summary Add the specified number of seconds to the given date.
 *
 * @description
 * Add the specified number of seconds to the given date.
 *
 * @param date - the date to be changed
 * @param amount - the amount of seconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns the new date with the seconds added
 *
 * @example
 * // Add 30 seconds to 10 July 2014 12:45:00:
 * const result = addSeconds(new Date(2014, 6, 10, 12, 45, 0), 30)
 * //=> Thu Jul 10 2014 12:45:30
 */
export function addSeconds(dirtyDate: Date | number, amount: number): Date {
	return addMilliseconds(dirtyDate, amount * 1000);
}

/**
 * @name addMonths
 * @category Month Helpers
 * @summary Add the specified number of months to the given date.
 *
 * @description
 * Add the specified number of months to the given date.
 *
 * @param date - the date to be changed
 * @param amount - the amount of months to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns the new date with the months added
 *
 * @example
 * // Add 5 months to 1 September 2014:
 * const result = addMonths(new Date(2014, 8, 1), 5)
 * //=> Sun Feb 01 2015 00:00:00
 */
export function addMonths(dirtyDate: Date | number, amount: number): Date {
	const date = toDate(dirtyDate);
	if (isNaN(amount)) return constructFrom(dirtyDate, NaN);
	if (!amount) {
		// If 0 months, no-op to avoid changing times in the hour before end of DST
		return date;
	}
	const dayOfMonth = date.getDate();

	// The JS Date object supports date math by accepting out-of-bounds values for
	// month, day, etc. For example, new Date(2020, 0, 0) returns 31 Dec 2019 and
	// new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
	// want except that dates will wrap around the end of a month, meaning that
	// new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
	// we'll default to the end of the desired month by adding 1 to the desired
	// month and using a date of 0 to back up one day to the end of the desired
	// month.
	const endOfDesiredMonth = constructFrom(dirtyDate, date.getTime());
	endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
	const daysInMonth = endOfDesiredMonth.getDate();
	if (dayOfMonth >= daysInMonth) {
		// If we're already at the end of the month, then this is the correct date
		// and we're done.
		return endOfDesiredMonth;
	} else {
		// Otherwise, we now know that setting the original day-of-month value won't
		// cause an overflow, so set the desired day-of-month. Note that we can't
		// just set the date of `endOfDesiredMonth` because that object may have had
		// its time changed in the unusual case where where a DST transition was on
		// the last day of the month and its local time was in the hour skipped or
		// repeated next to a DST transition.  So we use `date` instead which is
		// guaranteed to still have the original time.
		date.setFullYear(
			endOfDesiredMonth.getFullYear(),
			endOfDesiredMonth.getMonth(),
			dayOfMonth,
		);
		return date;
	}
}

/**
 * @name addQuarters
 * @category Quarter Helpers
 * @summary Add the specified number of year quarters to the given date.
 *
 * @description
 * Add the specified number of year quarters to the given date.
 *
 * @param date - the date to be changed
 * @param amount - the amount of quarters to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns the new date with the quarters added
 *
 * @example
 * // Add 1 quarter to 1 September 2014:
 * const result = addQuarters(new Date(2014, 8, 1), 1)
 * //=> Mon Dec 01 2014 00:00:00
 */
export function addQuarters(dirtyDate: Date | number, amount: number): Date {
	const months = amount * 3;
	return addMonths(dirtyDate, months);
}

/**
 * @name addYears
 * @category Year Helpers
 * @summary Add the specified number of years to the given date.
 *
 * @description
 * Add the specified number of years to the given date.
 *
 * @param date - the date to be changed
 * @param amount - the amount of years to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns the new date with the years added
 *
 * @example
 * // Add 5 years to 1 September 2014:
 * const result = addYears(new Date(2014, 8, 1), 5)
 * //=> Sun Sep 01 2019 00:00:00
 */
export function addYears(dirtyDate: Date | number, amount: number): Date {
	return addMonths(dirtyDate, amount * 12);
}

/**
 * @name addMinutes
 * @category Minute Helpers
 * @summary Add the specified number of minutes to the given date.
 *
 * @description
 * Add the specified number of minutes to the given date.
 *
 * @param date - the date to be changed
 * @param amount - the amount of minutes to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns the new date with the minutes added
 *
 * @example
 * // Add 30 minutes to 10 July 2014 12:00:00:
 * const result = addMinutes(new Date(2014, 6, 10, 12, 0), 30)
 * //=> Thu Jul 10 2014 12:30:00
 */
export function addMinutes(dirtyDate: Date | number, amount: number): Date {
	return addMilliseconds(dirtyDate, amount * millisecondsInMinute);
}

/**
 * @name addISOWeekYears
 * @category ISO Week-Numbering Year Helpers
 * @summary Add the specified number of ISO week-numbering years to the given date.
 *
 * @description
 * Add the specified number of ISO week-numbering years to the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @param date - the date to be changed
 * @param amount - the amount of ISO week-numbering years to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns the new date with the ISO week-numbering years added
 *
 * @example
 * // Add 5 ISO week-numbering years to 2 July 2010:
 * const result = addISOWeekYears(new Date(2010, 6, 2), 5)
 * //=> Fri Jn 26 2015 00:00:00
 */
export function addISOWeekYears(
	dirtyDate: Date | number,
	amount: number,
): Date {
	return setISOWeekYear(dirtyDate, getISOWeekYear(dirtyDate) + amount);
}

/**
 * @name addHours
 * @category Hour Helpers
 * @summary Add the specified number of hours to the given date.
 *
 * @description
 * Add the specified number of hours to the given date.
 *
 * @param date - the date to be changed
 * @param amount - the amount of hours to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns the new date with the hours added
 *
 * @example
 * // Add 2 hours to 10 July 2014 23:00:00:
 * const result = addHours(new Date(2014, 6, 10, 23, 0), 2)
 * //=> Fri Jul 11 2014 01:00:00
 */
export function addHours(dirtyDate: Date | number, amount: number): Date {
	return addMilliseconds(dirtyDate, amount * millisecondsInHour);
}

/**
 * @name addDays
 * @category Day Helpers
 * @summary Add the specified number of days to the given date.
 *
 * @description
 * Add the specified number of days to the given date.
 *
 * @param date - the date to be changed
 * @param amount - the amount of days to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns - the new date with the days added
 *
 * @example
 * // Add 10 days to 1 September 2014:
 * const result = addDays(new Date(2014, 8, 1), 10)
 * //=> Thu Sep 11 2014 00:00:00
 */
export function addDays(dirtyDate: Date | number, amount: number): Date {
	const date = toDate(dirtyDate);
	if (isNaN(amount)) return constructFrom(dirtyDate, NaN);
	if (!amount) {
		// If 0 days, no-op to avoid changing times in the hour before end of DST
		return date;
	}
	date.setDate(date.getDate() + amount);
	return date;
}

/**
 * @name addWeeks
 * @category Week Helpers
 * @summary Add the specified number of weeks to the given date.
 *
 * @description
 * Add the specified number of week to the given date.
 *
 * @param date - the date to be changed
 * @param amount - the amount of weeks to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns the new date with the weeks added
 *
 * @example
 * // Add 4 weeks to 1 September 2014:
 * const result = addWeeks(new Date(2014, 8, 1), 4)
 * //=> Mon Sep 29 2014 00:00:00
 */
export function addWeeks(dirtyDate: Date | number, amount: number): Date {
	const days = amount * 7;
	return addDays(dirtyDate, days);
}

/**
 * @name addBusinessDays
 * @category Date Extension Helpers
 * @summary Add the specified number of business days (mon - fri) to the given date.
 *
 * @description
 * Add the specified number of business days (mon - fri) to the given date, ignoring weekends.
 *
 * @param date - the date to be changed
 * @param amount - the amount of business days to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns the new date with the business days added
 *
 * @example
 * // Add 10 business days to 1 September 2014:
 * const result = addBusinessDays(new Date(2014, 8, 1), 10)
 * //=> Mon Sep 15 2014 00:00:00 (skipped weekend days)
 */
export function addBusinessDays(
	dirtyDate: Date | number,
	amount: number,
): Date {
	const date = toDate(dirtyDate);
	const startedOnWeekend = isWeekend(date);

	if (isNaN(amount)) return constructFrom(dirtyDate, NaN);

	const hours = date.getHours();
	const sign = amount < 0 ? -1 : 1;
	const fullWeeks = Math.trunc(amount / 5);

	date.setDate(date.getDate() + fullWeeks * 7);

	// Get remaining days not part of a full week
	let restDays = Math.abs(amount % 5);

	// Loops over remaining days
	while (restDays > 0) {
		date.setDate(date.getDate() + sign);
		if (!isWeekend(date)) restDays -= 1;
	}

	// If the date is a weekend day and we reduce a dividable of
	// 5 from it, we land on a weekend date.
	// To counter this, we add days accordingly to land on the next business day
	if (startedOnWeekend && isWeekend(date) && amount !== 0) {
		// If we're reducing days, we want to add days until we land on a weekday
		// If we're adding days we want to reduce days until we land on a weekday
		if (isSaturday(date)) date.setDate(date.getDate() + (sign < 0 ? 2 : -1));
		if (isSunday(date)) date.setDate(date.getDate() + (sign < 0 ? 1 : -2));
	}

	// Restore hours to avoid DST lag
	date.setHours(hours);

	return date;
}

/**
 * @name add
 * @category Common Helpers
 * @summary Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
 *
 * @description
 * Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
 *
 * @param date - the date to be changed
 * @param duration - the object with years, months, weeks, days, hours, minutes and seconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 *
 * | Key            | Description                        |
 * |----------------|------------------------------------|
 * | years          | Amount of years to be added        |
 * | months         | Amount of months to be added       |
 * | weeks          | Amount of weeks to be added        |
 * | days           | Amount of days to be added         |
 * | hours          | Amount of hours to be added        |
 * | minutes        | Amount of minutes to be added      |
 * | seconds        | Amount of seconds to be added      |
 *
 * All values default to 0
 *
 * @returns the new date with the seconds added
 *
 * @example
 * // Add the following duration to 1 September 2014, 10:19:50
 * const result = add(new Date(2014, 8, 1, 10, 19, 50), {
 *   years: 2,
 *   months: 9,
 *   weeks: 1,
 *   days: 7,
 *   hours: 5,
 *   minutes: 9,
 *   seconds: 30,
 * })
 * //=> Thu Jun 15 2017 15:29:20
 */
export function add(dirtyDate: Date | number, duration: Duration): Date {
	const {
		years = 0,
		months = 0,
		weeks = 0,
		days = 0,
		hours = 0,
		minutes = 0,
		seconds = 0,
	} = duration;

	// Add years and months
	const date = toDate(dirtyDate);
	const dateWithMonths =
		months || years ? addMonths(date, months + years * 12) : date;

	// Add weeks and days
	const dateWithDays =
		days || weeks ? addDays(dateWithMonths, days + weeks * 7) : dateWithMonths;

	// Add days, hours, minutes and seconds
	const minutesToAdd = minutes + hours * 60;
	const secondsToAdd = seconds + minutesToAdd * 60;
	const msToAdd = secondsToAdd * 1000;
	const finalDate = constructFrom(dirtyDate, dateWithDays.getTime() + msToAdd);

	return finalDate;
}
