/* @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with the Game Closure SDK.  If not, see <http://www.gnu.org/licenses/>.
 */

var crypto = require('crypto');
var ff = require('ff');
var fs = require('fs');
var path = require('path');

function md5file (filename, cb) {
	var md5sum = crypto.createHash('md5');
	try {
		var s = fs.createReadStream(filename);
	} catch (e) {
		return cb(e);
	}

	s.on('error', function (e) { cb(e); });
	s.on('data', function(d) { md5sum.update(d); });
	s.on('end', function() {
		cb(null, md5sum.digest('hex'));
	});
}

module.exports = function (filename, cb) {
	var f = ff(function () {
		fs.stat(filename, f());
		md5file(filename, f());
	}, function (stat, md5) {
		f(md5 + '|' + (+stat.mtime));
	}).cb(cb);
}