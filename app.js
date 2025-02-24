let scene, camera, renderer, model, controls;

// Toggle functionality
document.querySelector('.message-button').addEventListener('click', function() {
    const note = document.querySelector('.love-note');
    note.classList.toggle('show');
    this.textContent = note.classList.contains('show') ? '✖ Close Message' : '💌 Show Message';
});

// Prevent model rotation when clicking message
document.querySelector('.love-note').addEventListener('click', (e) => {
    e.stopPropagation();
});

function init() {
    // Scene setup with transparent background
    scene = new THREE.Scene();
    scene.background = null;

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Renderer setup with transparency
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Model loading
    const loader = new THREE.GLTFLoader();
    loader.load(
        './valentine_parachute.glb',
        (gltf) => {
            model = gltf.scene;
            model.scale.set(0.7, 0.7, 0.7);
            model.position.y = -1;
            scene.add(model);
            document.querySelector('.loading').style.display = 'none';
            
            // Center model
            const bbox = new THREE.Box3().setFromObject(model);
            const center = bbox.getCenter(new THREE.Vector3());
            model.position.sub(center);
        },
        (xhr) => console.log(`Loaded ${(xhr.loaded/xhr.total*100).toFixed(0)}%`),
        (error) => {
            console.error(error);
            document.querySelector('.loading').textContent = 'Error loading model!';
        }
    );

    // Window resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
animate();