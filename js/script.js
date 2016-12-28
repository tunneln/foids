var scene, camera, renderer;
var blob, blobs, foid, foids;

function event_resize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function event_cursor(event) {
	var vector = new THREE.Vector3(event.clientX - (window.innerWidth / 2),
		- event.clientY + (window.innerHeight / 2), 0);

	for (var i = 0, n = foids.length; i < n; i++) {
		foid = foids[i];
		vector.z = foid.position.z;
		foid.repulse(vector);
	}
}

function init() {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 450;
	scene = new THREE.Scene();

	blobs = [];
	foids = [];

	for (var i = 0; i < 200; i ++) {
		// init each particle at a random position and velocity
		foid = foids[i] = new Particle();
		foid.position.x = Math.random() * 250; foid.position.y = Math.random() * 250; foid.position.z = Math.random() * 250;
		foid.velocity.x = Math.random() * 2; foid.velocity.y = Math.random() * 2; foid.velocity.z = Math.random() * 2;
		foid.setBoundaries(250, 250, 250);

		blob = blobs[i] = new THREE.Mesh(new Fish(),
			new THREE.MeshBasicMaterial({
				color: 0x313131,
				side: THREE.DoubleSide
			}
		));
		blob.state = Math.ceil(Math.random() * 15);
		scene.add(blob);
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor(0xcacccd);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.addEventListener('mousemove', event_cursor, false);
	document.body.appendChild(renderer.domElement);
	window.addEventListener('resize', event_resize, false);
}

function animate() {
	requestAnimationFrame(animate);

	for (var i = 0, n = blobs.length; i < n; i++) {
		foid = foids[i];
		foid.swim(foids);
		blob = blobs[i]; blob.position.copy(foids[i].position);

		// Update the orientation of the foid
		blob.rotation.y = Math.atan2(- foid.velocity.z, foid.velocity.x);
		blob.rotation.z = Math.asin(foid.velocity.y / foid.velocity.length());

		// Simulate fish tail movement
		blob.state = ((Math.max(0, blob.rotation.z) + 0.1) + blob.state) % 15;
		blob.geometry.vertices[7].y = blob.geometry.vertices[8].y = Math.sin(blob.state) * 3;
	}

	renderer.render(scene, camera);
}

init();
animate();
