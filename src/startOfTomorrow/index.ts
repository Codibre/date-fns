/**
 * @name startOfTomorrow
 * @category Day Helpers
 * @summary Return the start of tomorrow.
 * @pure false
 *
 * @description
 * Return the start of tomorrow.
 *
 * > ⚠️ Please note that this function is not present in the FP submodule as
 * > it uses `new Date()` internally hence impure and can't be safely curried.
 *
 * @returns the start of tomorrow
 *
 * @example
 * // If today is 6 October 2014:
 * const result = startOfTomorrow()
 * //=> Tue Oct 7 2014 00:00:00
 */
export default function startOfTomorrow(): Date {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const day = now.getDate();

	const date = new Date(0);
	date.setFullYear(year, month, day + 1);
	date.setHours(0, 0, 0, 0);
	return date;
}
