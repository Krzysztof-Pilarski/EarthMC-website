const radius = 100,
	bounds = { leftX: -33280, rightX: 33080, upZ: -16640, downZ: 16508 },
	x_constant = 0.54249580568,
	z_constant = 0.358392393,
	x_divisor = 184.333333,
	z_divisor = 184.155555,
	zoom_stages = [
		{ maxDistance: 1001, minDistance: 900, speed: 2 },
		{ maxDistance: 899, minDistance: 800, speed: 1.8 },
		{ maxDistance: 799, minDistance: 700, speed: 1.7 },
		{ maxDistance: 699, minDistance: 600, speed: 1.6 },
		{ maxDistance: 599, minDistance: 500, speed: 1.4 },
		{ maxDistance: 499, minDistance: 400, speed: 1.3 },
		{ maxDistance: 399, minDistance: 300, speed: 1.25 },
		{ maxDistance: 299, minDistance: 230, speed: 1.2 },
		{ maxDistance: 229, minDistance: 180, speed: 0.9 },
		{ maxDistance: 179, minDistance: 140, speed: 0.7 },
		{ maxDistance: 139, minDistance: 120, speed: 0.4 },
		{ maxDistance: 119, minDistance: 104, speed: 0.25 }
	],
	rotate_stages = [
		{ maxDistance: 1001, minDistance: 900, speed: 0.5 },
		{ maxDistance: 899, minDistance: 800, speed: 0.48 },
		{ maxDistance: 799, minDistance: 700, speed: 0.45 },
		{ maxDistance: 699, minDistance: 600, speed: 0.4 },
		{ maxDistance: 599, minDistance: 500, speed: 0.34 },
		{ maxDistance: 499, minDistance: 400, speed: 0.25 },
		{ maxDistance: 399, minDistance: 300, speed: 0.2 },
		{ maxDistance: 299, minDistance: 230, speed: 0.13 },
		{ maxDistance: 229, minDistance: 180, speed: 0.09 },
		{ maxDistance: 179, minDistance: 140, speed: 0.06 },
		{ maxDistance: 139, minDistance: 120, speed: 0.04 },
		{ maxDistance: 119, minDistance: 104, speed: 0.025 }
	],
	playerGeometry = new THREE.SphereGeometry(0.2),
	playerMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }),
	townLabelsObj =  [], playersObj = [], playerLabelsObj = [], townsObj = [],
	axis = new THREE.Vector3( 1, 0, 0 );
	
let scene, renderer, camera, controls;
let surfaceFlight = true,
	angleMod = 0.04;

// Buttons/togglers listeners and methods.

function initialize() {
	const canvas = document.getElementById('dynglobe');
	const width = canvas.clientWidth;
		height = canvas.clientHeight;
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x1c1c21 );
	camera = new THREE.PerspectiveCamera(20, width / height, 0.1, 10000);
	renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	renderer.setSize(width, height);
	renderer.setPixelRatio(window.devicePixelRatio);
	// musimy renderować nasz canvas w #earth-container, bo #dynglobe to właśnie jest sam canvas, i probowałeś zrenderować go samego w sobie :D
	document.getElementById('earth-container').appendChild(renderer.domElement);
	camera.position.z = 800;
	
	// Render planet.
	const server = 'aurora',
		earthGeometry = new THREE.SphereGeometry(radius, 50, 50),
		earthMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(`img/aurora.jpg`) }),
		earth = new THREE.Mesh(earthGeometry, earthMaterial);
	earth.rotation.y = -1.57;
	scene.add(earth);

	// Render atmosphere.
	const atmoGeometry = new THREE.SphereGeometry(radius * 1.1, 50, 50),
		vertexShader = 'varying vec3 vertexNormal;void main(){vertexNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
		fragmentShader = 'varying vec3 vertexNormal;void main(){float intensity=pow(0.45-dot(vertexNormal,vec3(0,0,1.0)),2.0);gl_FragColor=vec4(0.3,0.6,1.0,1.0)*intensity;}',
		atmoMaterial = new THREE.ShaderMaterial({ vertexShader: vertexShader, fragmentShader: fragmentShader, blending: THREE.AdditiveBlending, side: THREE.BackSide }),
		atmosphere = new THREE.Mesh(atmoGeometry, atmoMaterial);
	scene.add(atmosphere);

	// Configure controls.
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.minDistance = 104;
	controls.maxDistance = 1000;
	controls.enableDamping = true;
	controls.dampingFactor = 0.2;
	controls.enablePan = false;
	controls.zoomToCursor = true;
	controls.doubleClickZoom = true;
}

function update() {
	controls.update();


	// Zoom & rotate staging.
	const zoom = controls.getDistance();
	zoom_stages.forEach(stage => {
		if (zoom >= stage.minDistance && zoom <= stage.maxDistance) controls.zoomSpeed = stage.speed;
	});
	rotate_stages.forEach(stage => {
		if (zoom >= stage.minDistance && zoom <= stage.maxDistance) controls.rotateSpeed = stage.speed;
	});
	if (zoom > 150) {
		playerLabelsObj.forEach(player => { player.visible = false; });
		townLabelsObj.forEach(label => { label.visible = false; });
	} else {
		playerLabelsObj.forEach(player => { player.visible = document.getElementById('players').checked; });
		townLabelsObj.forEach(player => { player.visible = document.getElementById('labels').checked; });
	}

	renderer.render( scene, camera );
	requestAnimationFrame(update);
}

function resize() {
	const canvas = document.getElementById('dynglobe');
	const width = canvas.clientWidth;
		height = canvas.clientHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

window.addEventListener('resize', resize, false);
initialize();
update();
