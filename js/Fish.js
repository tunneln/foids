var Fish = function () {
	var obj = this;
	THREE.Geometry.call(this);
	function p(x, y, z) { obj.vertices.push(new THREE.Vector3(x, y, z)); }
	function f(x, y, z) { obj.faces.push(new THREE.Face3(x, y, z)); }

	// FISH
	p(   5,   0,   0); p(   0,   0, - 2); p(   0,   0,   2); // body a
	p( - 5,   0,   0); p(   0,   0, - 2); p(   0,   0,   2); // body b
	p( - 5,   0,   0); p( - 8,   4,   2); p( - 8,   4, - 2); // tail

	f(0, 1, 2); f(3, 4, 5); f(6, 7, 8);

	this.computeFaceNormals();
};

Fish.prototype = Object.create(THREE.Geometry.prototype);
Fish.prototype.constructor = Fish;
