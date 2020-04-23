let scene, camera, renderer, controls, hemiLight, spotlight;

scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,1,2000);
camera.position.set(0, 100, 70);

// scene.add(new THREE.AxesHelper(1000));

renderer = new THREE.WebGLRenderer({antialias: true});
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.7;
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement); 
controls.keys = {
	LEFT: 37, //left arrow
	UP: 38, // up arrow
	RIGHT: 39, // right arrow
	BOTTOM: 40 // down arrow
}

hemiLight = new THREE.HemisphereLight(0x66dbe8, 0xcfd1d0, 4);
scene.add(hemiLight);   

spotlight = new THREE.SpotLight(0xc1e0e3, 5);
spotlight.castShadow = true;
spotlight.shadow.bias = -0.0001;
spotlight.shadow.mapSize.width = 1024*4;
spotlight.shadow.mapSize.height = 1024*4;
scene.add(spotlight);

new THREE.GLTFLoader().load('models/sas-csgo/scene.gltf', result =>{
    model = result.scene.children[0];
    model.traverse(n => {
        if(n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
            if(n.material.map) n.material.map.anisotropy = 16;
        }
    })
    scene.add(model);
    render();
});

function render() {
    renderer.render(scene, camera);
    controls.update();

    spotlight.position.set(
        camera.position.x + 10,
        camera.position.y + 10,
        camera.position.z + 10
    );

    requestAnimationFrame(render);
}
render();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
