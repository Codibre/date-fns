import toDate from '../toDate/index';

/**
 * @name lastDayOfQuarter
 * @category Quarter Helpers
 * @summary Return the last day of a year quarter for the given date.
 *
 * @description
 * Return the last day of a year quarter for the given date.
 * The result will be in the local timezone.
 *
 * @param date - the original date
 * @returns the last day of a quarter
 *
 * @example
 * // The last day of a quarter for 2 September 2014 11:55:00:
 * const result = lastDayOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 00:00:00
 */
export default function lastDayOfQuarter(dirtyDate: Date | number): Date {
	const date = toDate(dirtyDate);
	const currentMonth = date.getMonth();
	const month = currentMonth - (currentMonth % 3) + 3;
	date.setMonth(month, 0);
	date.setHours(0, 0, 0, 0);
	return date;
}
