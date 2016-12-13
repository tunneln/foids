var Blob = function () {

	var scope = this;

	THREE.Geometry.call(this);

	function p(x, y, z) { scope.vertices.push(new THREE.Vector3(x, y, z)); }
	function f(a, b, c) { scope.faces.push(new THREE.Face3(a, b, c)); }

	p(  5,   0,   0); p(- 10, - 2,   1); p(- 5,   0,   0); p(- 10, - 2, - 1);
	p(  0,   0, - 0); p(  0,   0,   0); p(  0,   0,   0); p(- 0,   0,   0);

	f(0, 2, 1); f(4, 7, 6); f(5, 6, 7);

	this.computeFaceNormals();
}

Blob.prototype = Object.create(THREE.Geometry.prototype);
Blob.prototype.constructor = Blob;
