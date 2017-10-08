module.exports = function(fs, image) {
	//  Local cache for static content.
	var path = "./image/"
	image['postgirl'] = fs.readFileSync(path + 'postgirl.png');
	image['sister'] = fs.readFileSync(path + 'sister.jpg');
}