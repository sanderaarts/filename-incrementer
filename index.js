const glob = require('glob');
const path = require('path');
const incrPattern = '###';

module.exports = {
	getFiles,
	getFilesMap,
	getMax,
	getMin,
	getNew,
	getNewName,
	getMatchPattern,
};

/**
 * Get file paths matching the pattern.
 * @param {string} pattern - Path to files, with '###' (or pattern described in `incr`) where the incrementer is set, e.g. '/path/filename-###.ext'
 * @param {string} [incr = '###'] - Incrementer pattern
 * returns {Promise<string[]>}
 */
function getFiles(pattern, incr) {
	return new Promise((resolve, reject) => {
		glob(getMatchPattern('glob', pattern, incr), (error, files) => {
			if (error) {
				reject(error);
			}
			resolve(files);
		});
	});
}

/**
 * Get map of paths matching the pattern and their incrementer value.
 * @param {string} pattern - Path to files, with '###' (or pattern described in `incr`) where the incrementer is set, e.g. '/path/filename-###.ext'
 * @param {string} [incr = '###'] - Incrementer pattern
 * returns {Promise<{[filename: string]: number}>}
 */
function getFilesMap(pattern, incr) {
	const regExp = new RegExp(getMatchPattern('regexp', pattern, incr));

	return getFiles(pattern, incr)
		.then(files => {
			const map = {};

			files.forEach(filename => {
				const match = filename.match(regExp);

				if (match) {
					map[filename] = Number(match[1]);
				}
			});
			return map;
		});
}

/**
 * Get max. incrementer value for files matching the pattern.
 * @param {string} pattern - Path to files, with '###' (or pattern described in `incr`) where the incrementer is set, e.g. '/path/filename-###.ext'
 * @param {string} [incr = '###'] - Incrementer pattern
 * returns {Promise<number>}
 */
function getMax(pattern, incr) {
	return getFilesMap(pattern, incr)
		.then(map => Math.max.apply(null, [0].concat(Object.values(map))));
}

/**
 * Get min. incrementer value for files matching the pattern.
 * @param {string} pattern - Path to files, with '###' (or pattern described in `incr`) where the incrementer is set, e.g. '/path/filename-###.ext'
 * @param {string} [incr = '###'] - Incrementer pattern
 * returns {Promise<number>}
 */
function getMin(pattern, incr) {
	return getFilesMap(pattern, incr)
		.then(map => Math.max(0, Math.min.apply(null, Object.values(map))));
}

/**
 * Get incremented value for files matching the pattern.
 * @param {string} pattern - Path to files, with '###' (or pattern described in `incr`) where the incrementer is set, e.g. '/path/filename-###.ext'
 * @param {string} [incr = '###'] - Incrementer pattern
 * returns {Promise<number>}
 */
function getNew(pattern, incr) {
	return getMax(pattern, incr)
		.then(max => max + 1);
}

/**
 * Get filename with incremented value.
 * @param {string} pattern - Path to files, with '###' (or pattern described in `incr`) where the incrementer is set, e.g. '/path/filename-###.ext'
 * @param {string} [incr = '###'] - Incrementer pattern
 * returns {Promise<string>}
 */
function getNewName(pattern, incr) {
	const namePattern = path.basename(pattern);

	return getNew(pattern, incr)
		.then(value => namePattern.replace(incr || incrPattern, value));
}

/**
 * Get glob or regexp matching pattern.
 * @param {string} type - Pattern type, one of 'glob'|'regexp'
 * @param {string} pattern - Path to files, with '###' (or pattern described in `incr`) where the incrementer is set, e.g. '/path/filename-###.ext'
 * @param {string} [incr = '###'] - Incrementer pattern
 * returns {string}
 */
function getMatchPattern(type, pattern, incr) {
	const pathData = path.parse(pattern);
	const nameParts = pathData.name.split(incr || incrPattern);

	if (nameParts.length > 2) {
		throw Error(`Pattern may use only one incrementer in the filename! '${pattern}' has ${nameParts.length - 1}.`);
	}
	if (type === 'glob') {
		return path.join(pathData.dir, pathData.name.replace(incr || incrPattern, '+([0-9])') + pathData.ext);
	} else if (type === 'regexp') {
		nameParts[0] = path.join(pathData.dir, nameParts[0]);
		nameParts[1] = (nameParts[1] || '') + pathData.ext;

		const escapedParts = nameParts.map(part => part.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'));

		return '^' + escapedParts.join('([0-9]+)') + '$';
	}
}
