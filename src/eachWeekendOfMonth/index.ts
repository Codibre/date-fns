import eachWeekendOfInterval from '../eachWeekendOfInterval/index';
import endOfMonth from '../endOfMonth/index';
import startOfMonth from '../startOfMonth/index';

/**
 * @name eachWeekendOfMonth
 * @category Month Helpers
 * @summary List all the Saturdays and Sundays in the given month.
 *
 * @description
 * Get all the Saturdays and Sundays in the given month.
 *
 * @param date - the given month
 * @returns an array containing all the Saturdays and Sundays
 * @throws {RangeError} The passed date is invalid
 *
 * @example
 * // Lists all Saturdays and Sundays in the given month
 * const result = eachWeekendOfMonth(new Date(2022, 1, 1))
 * //=> [
 * //   Sat Feb 05 2022 00:00:00,
 * //   Sun Feb 06 2022 00:00:00,
 * //   Sat Feb 12 2022 00:00:00,
 * //   Sun Feb 13 2022 00:00:00,
 * //   Sat Feb 19 2022 00:00:00,
 * //   Sun Feb 20 2022 00:00:00,
 * //   Sat Feb 26 2022 00:00:00,
 * //   Sun Feb 27 2022 00:00:00
 * // ]
 */
export default function eachWeekendOfMonth(dirtyDate: Date): Date[] {
	const startDate = startOfMonth(dirtyDate);
	if (isNaN(startDate.getTime()))
		{throw new RangeError('The passed date is invalid');}

	const endDate = endOfMonth(dirtyDate);
	return eachWeekendOfInterval({ start: startDate, end: endDate });
}
