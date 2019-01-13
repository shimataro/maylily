/**
 * @description MayLily - distributable, serverless, and customizable unique ID generator based on Snowflake
 * @license MIT License
 * https://github.com/shimataro/maylily
 */
export default maylily;

import BigInteger from "big-integer";

/**
 * @typedef {Object} MaylilyOptions
 * @property {number} radix radix of generated ID
 * @property {number} timeBase base time [milliseconds]
 * @property {number} machineId ID of machine, use when generate ID by multiple machines
 * @property {number} machineBits size of machineId
 * @property {number} generatorId ID of generator
 * @property {number} generatorBits size of generatorId
 * @property {number} sequenceBits size of sequence
 */

const DEFAULT_BITS_MACHINE = 3; // up to 8 machines
const DEFAULT_BITS_GENERATOR = 10; // 0-1023
const DEFAULT_BITS_SEQUENCE = 8; // 0-255

/** @type {MaylilyOptions} */
const optionsGlobal = {
	radix: 10,
	timeBase: Date.parse("2000-01-01T00:00:00Z"),
	machineId: 0,
	machineBits: DEFAULT_BITS_MACHINE,
	generatorId: process.pid % (1 << DEFAULT_BITS_GENERATOR),
	generatorBits: DEFAULT_BITS_GENERATOR,
	sequenceBits: DEFAULT_BITS_SEQUENCE,
};

let timePrev = 0;
let sequence = 0;

/**
 * generate unique ID
 * @param {MaylilyOptions | null} [options = null] ID options
 * @return {Promise<string>} generated ID
 */
function maylily(options = null)
{
	// Merge options if specified.
	if(options !== null)
	{
		Object.assign(optionsGlobal, options);
	}
	const sequenceLimit = 1 << optionsGlobal.sequenceBits;

	{
		const time = Date.now();
		if(time < timePrev)
		{
			return Promise.reject(errorUnixtimeBackwards(time));
		}

		if(time > timePrev)
		{
			// Reset sequence when unixtime is updated.
			sequence = 0;
			return Promise.resolve(buildId(time, optionsGlobal));
		}

		if(sequence < sequenceLimit)
		{
			// Increment sequence when sequence DOESN'T reach to limit.
			return Promise.resolve(buildId(time, optionsGlobal));
		}
	}

	// Wait until unixtime is updated
	return new Promise((resolve, reject) =>
	{
		let timeout = setInterval(() =>
		{
			const time = Date.now();
			if(time < timePrev)
			{
				reject(errorUnixtimeBackwards(time));
			}

			// Clear timer and resolve when time is updated.
			if(time > timePrev)
			{
				clearInterval(timeout);
				timeout = null;

				sequence = 0;
				resolve(buildId(time, optionsGlobal));
			}

			if(sequence < sequenceLimit)
			{
				// Increment sequence when sequence DOESN'T reach to limit.
				resolve(buildId(time, optionsGlobal));
			}
		}, 1);
	});
}

/**
 * build unique ID
 * @param {number} time unixtime[millisec]
 * @param {MaylilyOptions} options other options
 * @return {string} generated ID
 */
function buildId(time, options)
{
	timePrev = time;

	return BigInteger(time - options.timeBase)
		.shiftLeft(options.machineBits).add(options.machineId)
		.shiftLeft(options.generatorBits).add(options.generatorId)
		.shiftLeft(options.sequenceBits).add(sequence++)
		.toString(options.radix);
}

/**
 * generate error instance for unixtime error
 * @param {number} time unixtime[millisec]
 * @return {Error} error instance
 */
function errorUnixtimeBackwards(time)
{
	const message = `Clock moved backwards. Refusing to generate id for ${time} milliseconds`;
	return new Error(message);
}
