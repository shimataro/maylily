/*!
 * MayLily - distributable, serverless, and customizable unique ID generator based on Snowflake
 * https://github.com/shimataro/maylily
 * MIT License
 */
export default maylily;

import BigInteger from "big-integer";

const DEFAULT_BITS_MACHINE = 3; // up to 8 machines
const DEFAULT_BITS_GENERATOR = 10; // 0-1023
const DEFAULT_BITS_SEQUENCE = 8; // 0-255

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
 * @param {?Object} options ID options
 * @return {Promise<string>} generated ID
 */
function maylily(options = null)
{
	// Merge options if specified.
	if(options !== null)
	{
		Object.assign(optionsGlobal, options);
	}

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

	const sequenceLimit = 1 << optionsGlobal.sequenceBits;
	if(sequence < sequenceLimit)
	{
		// Increment sequence when sequence DOESN'T reach to limit.
		return Promise.resolve(buildId(time, optionsGlobal));
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
 * @param {int} time unixtime[millisec]
 * @param {Object} options other options
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
 * @param {int} time unixtime[millisec]
 * @return {Error} error instance
 */
function errorUnixtimeBackwards(time)
{
	const message = `Clock moved backwards. Refusing to generate id for ${time} milliseconds`;
	return new Error(message);
}
