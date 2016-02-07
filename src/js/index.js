'use strict';

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
renderer.setSize( window.innerWidth, window.innerHeight -200 );
renderer.setPixelRatio( window.devicePixelRatio );
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

document.body.appendChild( renderer.domElement );
init();