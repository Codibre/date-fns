import isValid from '../isValid/index';
import toDate from '../toDate/index';
import type { FormatOptions, RepresentationOptions } from '../types';
import addLeadingZeros from '../_lib/addLeadingZeros/index';

/**
 * The {@link formatISO9075} function options.
 */
export interface FormatISO9075Options
	extends FormatOptions,
		RepresentationOptions {}

/**
 * @name formatISO9075
 * @category Common Helpers
 * @summary Format the date according to the ISO 9075 standard (https://dev.mysql.com/doc/refman/5.7/en/date-and-time-functions.html#function_get-format).
 *
 * @description
 * Return the formatted date string in ISO 9075 format. Options may be passed to control the parts and notations of the date.
 *
 * @param date - the original date
 * @param options - an object with options.
 * @returns the formatted date string
 * @throws {RangeError} `date` must not be Invalid Date
 *
 * @example
 * // Represent 18 September 2019 in ISO 9075 format:
 * const result = formatISO9075(new Date(2019, 8, 18, 19, 0, 52))
 * //=> '2019-09-18 19:00:52'
 *
 * @example
 * // Represent 18 September 2019 in ISO 9075, short format:
 * const result = formatISO9075(new Date(2019, 8, 18, 19, 0, 52), { format: 'basic' })
 * //=> '20190918 190052'
 *
 * @example
 * // Represent 18 September 2019 in ISO 9075 format, date only:
 * const result = formatISO9075(new Date(2019, 8, 18, 19, 0, 52), { representation: 'date' })
 * //=> '2019-09-18'
 *
 * @example
 * // Represent 18 September 2019 in ISO 9075 format, time only:
 * const result = formatISO9075(new Date(2019, 8, 18, 19, 0, 52), { representation: 'time' })
 * //=> '19:00:52'
 */
export default function formatISO9075(
	dirtyDate: Date | number,
	options?: FormatISO9075Options,
): string {
	const originalDate = toDate(dirtyDate);

	if (!isValid(originalDate)) {
		throw new RangeError('Invalid time value');
	}

	const format = options?.format ?? 'extended';
	const representation = options?.representation ?? 'complete';

	let result = '';

	const dateDelimiter = format === 'extended' ? '-' : '';
	const timeDelimiter = format === 'extended' ? ':' : '';

	// Representation is either 'date' or 'complete'
	if (representation !== 'time') {
		const day = addLeadingZeros(originalDate.getDate(), 2);
		const month = addLeadingZeros(originalDate.getMonth() + 1, 2);
		const year = addLeadingZeros(originalDate.getFullYear(), 4);

		// yyyyMMdd or yyyy-MM-dd.
		result = `${year}${dateDelimiter}${month}${dateDelimiter}${day}`;
	}

	// Representation is either 'time' or 'complete'
	if (representation !== 'date') {
		const hour = addLeadingZeros(originalDate.getHours(), 2);
		const minute = addLeadingZeros(originalDate.getMinutes(), 2);
		const second = addLeadingZeros(originalDate.getSeconds(), 2);

		// If there's also date, separate it with time with a space
		const separator = result === '' ? '' : ' ';

		// HHmmss or HH:mm:ss.
		result = `${result}${separator}${hour}${timeDelimiter}${minute}${timeDelimiter}${second}`;
	}

	return result;
}
