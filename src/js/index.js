//'use strict';

window.$ = require("jquery");
// TweenMax = require ('gsap');
// $('h1').css('background-color', "red");
console.log('hello world');
window.THREE = require('three');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100); 
camera.position.set(0, 0, 10); 
camera.lookAt(scene.position); 
camera.position.z = 5;
scene.add(camera); 

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight  );
renderer.setPixelRatio( window.devicePixelRatio);
console.log('window.devicePixelRatio', window.devicePixelRatio);
// 

var sphere;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;



var render = function () {
	requestAnimationFrame( render );

	renderer.render(scene, camera);
};

render();

function init () {
	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( -5,  5, 0 ),
		new THREE.Vector3( -5, -5, 0 ),
		new THREE.Vector3(  5, -5, 0 ),
		new THREE.Vector3( -2,  5, 0 ),
		new THREE.Vector3( 10,  -5, 0 ),
		new THREE.Vector3( -3,  5, 0 )
	);

	geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
	geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
	geometry.faces.push( new THREE.Face3( 1, 2, 3 ) );
	geometry.faces.push( new THREE.Face3( 1, 3, 0 ) );
	geometry.computeBoundingSphere();

	var triangleMaterial = new THREE.MeshBasicMaterial({ 
		color:0xFFFFFF, 
		side: THREE.DoubleSide,
		wireframe: true
	});

	var triangleMesh = new THREE.Mesh(geometry, triangleMaterial); 
    triangleMesh.position.set(-1.5, 0.0, -14.0); 
    scene.add(triangleMesh); 
}

/**
 * Draw Circle Ring Mesh
 */
function drawCircle () {
	var resolution = 16;
	var amplitude = 10;
	var size = 360 / resolution;

	var geometry = new THREE.Geometry();
	var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF,
		side: THREE.DoubleSide,
		wireframe: true} );
	// geometry.vertices.push(  new THREE.Vector3( 0, 0, 0 ) );
	for(var i = 0; i <= resolution; i++) {
	    var segment = ( i * size ) * Math.PI / 180;
	    var segment2 = ( i * size + size * 0.5 ) * Math.PI / 180;
	    geometry.vertices.push(  new THREE.Vector3( Math.cos( segment ) * amplitude,  Math.sin( segment ) * amplitude, 0 ) );    
	    geometry.vertices.push(  new THREE.Vector3( Math.cos( segment2 ) * (amplitude-2),  Math.sin( segment2 ) * (amplitude -2), 0 ) );    
	}

	for ( i = 0; i < geometry.vertices.length -2; i++) {
		geometry.faces.push ( new THREE.Face3( i, i+1, i+2 ) );
	}
	console.log ('Vertices', geometry.faces);
	geometry.computeBoundingSphere();

	var shaderMaterial = new THREE.ShaderMaterial( {

		uniforms: {
			time: { type: "f", value: 1.0 },
			resolution: { type: "v2", value: new THREE.Vector2() },
			color: { type: 'v3', value: new THREE.Vector3(1.0, 1.0, 0.0) }
		},
		attributes: {
			vertexOpacity: { type: 'f', value: [] },
			size: { type: 'f', value: 1.0 },
			customColor: { type: 'v3', value: new THREE.Vector3(1.0, 0.0, 0.0) }
		},
		vertexShader: document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent

	} );

	var ringMesh = new THREE.Mesh(geometry, material); 
    ringMesh.position.set(-1.5, 0.0, -14.0); 
    scene.add(ringMesh); 
}

document.body.appendChild( renderer.domElement );
init();
drawCircle();