module.exports = function(fs, file) {
	//  Local cache for static content.
	var path = "./file/"
	file['jquery.min.1.11.2.js'] = fs.readFileSync(path + 'jquery/1.11.2/jquery.min.js');
	file['bootstrap.min.3.3.4.js'] = fs.readFileSync(path + 'bootstrap/3.3.4/js/bootstrap.min.js');
	file['bootstrap.min.3.3.4.css'] = fs.readFileSync(path + 'bootstrap/3.3.4/css/bootstrap.min.css');
	
	
	file['jquery.mobile-git.js'] = fs.readFileSync(path + 'jquery.mobile/jquery.mobile-git.js');
	file['jquery-2.1.4.min.js'] = fs.readFileSync(path + 'jquery.mobile/jquery-2.1.4.min.js');
	file['socket.io-1.4.5.js'] = fs.readFileSync(path + 'jquery.mobile/socket.io-1.4.5.js');
	file['jquery.mobile-git.css'] = fs.readFileSync(path + 'jquery.mobile/jquery.mobile-git.css');
	file['history.txt'] = fs.readFileSync(path + 'history.txt');
}