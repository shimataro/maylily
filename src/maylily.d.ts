/**
 * Type definitions for MayLily
 */
export default maylily;

interface MaylilyOptions {
	/** radix of generated ID */
	radix?: number;
	/** base time [milliseconds] */
	timeBase?: number;
	/** ID of machine, use when generate ID by multiple machines */
	machineId?: number;
	/** size of machineId */
	machineBits?: number;
	/** ID of generator */
	generatorId?: number;
	/** size of generatorId */
	generatorBits?: number;
	/** size of sequence */
	sequenceBits?: number;
}

/**
 * generate unique ID
 * @param [options] ID options
 * @return generated ID
 */
declare function maylily(options?: MaylilyOptions | null): Promise<string>;
