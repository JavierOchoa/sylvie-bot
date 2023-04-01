const fs = require('node:fs');
const path = require('node:path');

const getAllFiles = function(dirPath, arrayOfFiles = []) {
	const files = fs.readdirSync(dirPath);

	arrayOfFiles = arrayOfFiles || [];

	files.forEach(function(file) {
		if (fs.statSync(dirPath + "/" + file).isDirectory()) {
			arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
		}
		else {
			arrayOfFiles.push(path.join(dirPath, "/", file));
		}
	});

	arrayOfFiles = arrayOfFiles.filter(file => file.endsWith('.js'));

	return arrayOfFiles;
};

module.exports = getAllFiles;