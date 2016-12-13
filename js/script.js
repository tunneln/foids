var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var HALF_SCREEN_WIDTH = SCREEN_WIDTH  / 2;
var HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2;

var camera, scene, renderer,
blobs, blob, boid, boids;

function init() {
	camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
	camera.position.z = 450;

	scene = new THREE.Scene();

	blobs = [];
	boids = [];

	for (var i = 0; i < 200; i ++) {
		boid = boids[i] = new Particle();
		boid.position.x = Math.random() * 400 - 200;
		boid.position.y = Math.random() * 400 - 200;
		boid.position.z = Math.random() * 400 - 200;
		boid.velocity.x = Math.random() * 2 - 1;
		boid.velocity.y = Math.random() * 2 - 1;
		boid.velocity.z = Math.random() * 2 - 1;
		boid.setAvoidWalls(true);
		boid.setWorldSize(500, 500, 400);

		blob = blobs[i] = new THREE.Mesh(new Blob(), new THREE.MeshBasicMaterial(
					{
						color:Math.random() * 0xffffff, side: THREE.DoubleSide
					}));
		blob.phase = Math.floor(Math.random() * 62.83);
		scene.add(blob);
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor(0x000000);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
	var vector = new THREE.Vector3(event.clientX - HALF_SCREEN_WIDTH, - event.clientY + HALF_SCREEN_HEIGHT, 0);

	for (var i = 0, il = boids.length; i < il; i++) {
		boid = boids[i];
		vector.z = boid.position.z;
		boid.repulse(vector);
	}
}

function render() {
	for (var i = 0, il = blobs.length; i < il; i++) {
		boid = boids[i];
		boid.run(boids);

		blob = blobs[i];
		blob.position.copy(boids[i].position);

		color = blob.material.color;
		color.r = color.g = color.b = (500 - blob.position.z) / 1000;

		blob.rotation.y = Math.atan2(- boid.velocity.z, boid.velocity.x);
		blob.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());

		blob.phase = (blob.phase + (Math.max(0, blob.rotation.z) + 0.1)) % 62.83;
		blob.geometry.vertices[5].y = blob.geometry.vertices[4].y = Math.sin(blob.phase) * 5;
	}

	renderer.render(scene, camera);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

init();
animate();
