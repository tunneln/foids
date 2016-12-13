var Particle = function() {

	var vector = new THREE.Vector3(),
	_height = 500, _depth = 200, _width = 500, _padding = 100,
	_speed = 2, _maneuver = 0.1, _avoidWalls = false, _acceleration, _goal;

	this.position = new THREE.Vector3();
	this.velocity = new THREE.Vector3();
	_acceleration = new THREE.Vector3();

	this.setGoal = function (target) {
		_goal = target;
	};

	this.setAvoidWalls = function (value) {
		_avoidWalls = value;
	};

	this.setWorldSize = function (width, height, depth) {
		_width = width;
		_height = height;
		_depth = depth;
	};

	this.run = function (particles) {
		if (_avoidWalls) {
			vector.set(- _width, this.position.y, this.position.z);
			vector = this.avoid(vector);
			vector.multiplyScalar(5);
			_acceleration.add(vector);

			vector.set(_width, this.position.y, this.position.z);
			vector = this.avoid(vector);
			vector.multiplyScalar(5);
			_acceleration.add(vector);

			vector.set(this.position.x, - _height, this.position.z);
			vector = this.avoid(vector);
			vector.multiplyScalar(5);
			_acceleration.add(vector);

			vector.set(this.position.x, _height, this.position.z);
			vector = this.avoid(vector);
			vector.multiplyScalar(5);
			_acceleration.add(vector);

			vector.set(this.position.x, this.position.y, - _depth);
			vector = this.avoid(vector);
			vector.multiplyScalar(5);
			_acceleration.add(vector);

			vector.set(this.position.x, this.position.y, _depth);
			vector = this.avoid(vector);
			vector.multiplyScalar(5);
			_acceleration.add(vector);
		}
		if (Math.random() > 0.5) {
			this.flock(particles);
		}

		this.move();
	};

	this.flock = function (particles) {
		if (_goal) {
			_acceleration.add(this.reach(_goal, 0.005));
		}

		_acceleration.add(this.alignment(particles));
		_acceleration.add(this.cohesion(particles));
		_acceleration.add(this.separation(particles));
	};

	this.move = function () {
		this.velocity.add(_acceleration);

		var l = this.velocity.length();

		if (l > _speed) {
			this.velocity.divideScalar(l / _speed);
		}

		this.position.add(this.velocity);
		_acceleration.set(0, 0, 0);
	};

	this.avoid = function (target) {
		var steer = new THREE.Vector3();

		steer.copy(this.position);
		steer.sub(target);

		steer.multiplyScalar(1 / this.position.distanceToSquared(target));

		return steer;
	};

	this.repulse = function (target) {
		var distance = this.position.distanceTo(target);

		if (distance < 150) {
			var steer = new THREE.Vector3();

			steer.subVectors(this.position, target);
			steer.multiplyScalar(0.5 / distance);

			_acceleration.add(steer);
		}
	};

	this.reach = function (target, amount) {
		var steer = new THREE.Vector3();

		steer.subVectors(target, this.position);
		steer.multiplyScalar(amount);

		return steer;
	};

	this.alignment = function (particles) {
		var particle, velSum = new THREE.Vector3(),
		count = 0;

		for (var i = 0, il = particles.length; i < il; i++) {
			if (Math.random() > 0.6) continue;

			particle = particles[i];
			distance = particle.position.distanceTo(this.position);

			if (distance > 0 && distance <= _padding) {
				velSum.add(particle.velocity);
				count++;
			}
		}

		if (count > 0) {
			velSum.divideScalar(count);
			var l = velSum.length();

			if (l > _maneuver) {
				velSum.divideScalar(l / _maneuver);
			}
		}

		return velSum;
	};

	this.cohesion = function (particles) {
		var particle, distance,
		posSum = new THREE.Vector3(),
		steer = new THREE.Vector3(),
		count = 0;

		for (var i = 0, il = particles.length; i < il; i ++) {

			if (Math.random() > 0.6) continue;

			particle = particles[i];
			distance = particle.position.distanceTo(this.position);

			if (distance > 0 && distance <= _padding) {
				posSum.add(particle.position);
				count++;
			}
		}

		if (count > 0) {
			posSum.divideScalar(count);
		}

		steer.subVectors(posSum, this.position);
		var l = steer.length();

		if (l > _maneuver) {
			steer.divideScalar(l / _maneuver);
		}

		return steer;
	};

	this.separation = function (particles) {
		var particle, distance,
		posSum = new THREE.Vector3(),
		repulse = new THREE.Vector3();

		for (var i = 0, il = particles.length; i < il; i ++) {
			if (Math.random() > 0.6) continue;

			particle = particles[i];
			distance = particle.position.distanceTo(this.position);

			if (distance > 0 && distance <= _padding) {
				repulse.subVectors(this.position, particle.position);
				repulse.normalize();
				repulse.divideScalar(distance);
				posSum.add(repulse);
			}
		}

		return posSum;
	}
}
