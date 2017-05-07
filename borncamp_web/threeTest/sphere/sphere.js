// Set some things up
// Get the canvas
var canvas = document.getElementById('canvas');

// set some variables
var renderer, scene, geometry, mesh, camera, cube;
var width = canvas.width;
var height = canvas.width;

function init() {
    // Make a new scene
    scene = new THREE.Scene();

    // Make a new camera. FOV, aspect, near plane, far plane
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    // Set up the render, thing-o-ma-bob that does the job
    renderer = new THREE.WebGLRenderer();
    // set resolution and size of window
    renderer.setSize(width, height);
    console.log(width, height);

    // add the renderer to the DOM
    document.body.appendChild(renderer.domElement);

}

function addCube() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;
}

function renderCube() {
    requestAnimationFrame(renderCube);
    // add rotation
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    renderer.render(scene, camera);
}

init();
addCube();
renderCube();