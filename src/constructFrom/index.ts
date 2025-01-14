import type { GenericDateConstructor } from '../types';

/**
 * @name constructFrom
 * @category Date Extension Helpers
 * @summary Constructs a date using the reference date and the value
 *
 * @description
 * The function constructs a new date using the constructor from the reference
 * date and the given value. It helps to build generic functions that accept
 * date extensions.
 *
 * @param date {Date|number} - the reference date to take constructor from
 * @param value {Date|number} - the value to create the date
 * @returns date initialized using the given date and value
 *
 * @example
 * import { constructFrom } from 'date-fns'
 *
 * // A function that clones a date preserving the original type
 * function cloneDate<Date extends Date(date: Date): Date {
 *   return constructFrom(
 *     date, // Use contrustor from the given date
 *     date.getTime() // Use the date value to create a new date
 *   )
 * }
 */
export default function constructFrom(
	date: Date | number,
	value: Date | number,
): Date {
	if (date instanceof Date) {
		return new (date.constructor as GenericDateConstructor<Date>)(value);
	} else {
		return new Date(value);
	}
}
