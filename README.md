# Foids
Foids, or 'fish-oid objects', is an interactive javascript implementation of Craig Reynold's Boids algorithm.

Foids simulates the schooling behavior of fish using Reynold's algorithm and the threejs graphics library.

### Algorithm
The intereaction of individual agents, or fish, adheres to 3 primary rules:
+ Cohesion: steer to move toward the average position of local fish schools
+ Alignment: steer towards the average heading of local fish schools
+ Separation: steer to avoid crowding local flock mates

These rules collectively simulate the complexity of swarm intelligence often seen in animals.
Additional rules, such as, mouse obstacle avoidance and goal seeking were also implemented.

