
window.$ = require("jquery");
// TweenMax = require ('gsap');
// $('h1').css('background-color', "red");
window.THREE = require('three');
var MeshRing = require('./myplaylab/components/mesh-ring/ring');

var sectionHolder = document.querySelectorAll('section.post-content')[0];
var scene ;
var camera ;
var renderer ;
var raycaster;
var sphere;

var WIDTH ;
var HEIGHT;

var circlRawMesh;

var circles = [];

//meshRing._settings.resolution = 100;
//console.log(meshRing, meshRing.getSettings()  );

$(function () {

 	scene = new THREE.Scene();
 	camera = new THREE.PerspectiveCamera( 10, $(sectionHolder).width()  / window.innerHeight, 0.1, 1000 );
 	raycaster = new THREE.Raycaster();
 	console.log($(sectionHolder).width() );
 	camera.position.set(0, 0, 100); 
	// camera.lookAt(scene.position); 
	//camera.position.z = 5;
	scene.add(camera); 

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( $(sectionHolder).width() , window.innerHeight  );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setClearColor( 0xF2F3F5, 1);
	console.log('window.devicePixelRatio', window.devicePixelRatio);

	WIDTH = $(sectionHolder).width();
	HEIGHT = window.innerHeight;
	$(sectionHolder).prepend (renderer.domElement);
	// sectionHolder.appendChild( renderer.domElement );
	init();
	// drawCircle();
	drawRawCircle();

	render();
});

//sectionHolder.appendChild(renderer.domElement);

// camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100); 



var render = function () {
	requestAnimationFrame( render );

	renderer.render(scene, camera);
	var time = performance.now();
	// if (circlRawMesh) {
	// 	//circlRawMesh.rotation.y = time * 0.0005;
	// 	circlRawMesh.material.uniforms.time.value = time * 0.005;

	// }
	_(circles).forEach(function(value) {
		value.material.uniforms.time.value = time * 0.005 * 0.1;
		value.update();
	});
	//console.log(circlRawMesh);
};


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
    // scene.add(triangleMesh); 
}

/**
 * Draw Circle Ring Mesh
 */
function drawCircle () {
	var resolution = 8;
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


	var ringMesh = new THREE.Mesh(geometry, material); 
    ringMesh.position.set(-1.5, 0.0, -14.0); 
    scene.add(ringMesh); 
}

/**
 * Draw Raw Buffer Circle Geomertry 
 */
function drawRawCircle () {
	
	
	
	for (var i = 0; i < 20; i++) {
		var meshRing = new MeshRing ({
			seed: i * 0.1,
			resolution: 20 + 20 * i,
			amplitude: 0.5 + i*.4,
			innerThickness: 0.2 + i* 0.05,
			mass: 5 + i * 4,
			vertexShader: document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent
		});
		scene.add( meshRing.mesh );
		circles.push (meshRing); 
	};

	$(renderer.domElement).mousemove (
		function(event){
		    var tX = ( (event.pageX - this.offsetLeft )/ this.offsetWidth ) * 2 - 1;
			var tY = 0- ( (event.pageY- this.offsetTop) / $(this).height() ) * 2 + 1;
			// console.log('tY', event.pageX, this.offsetTop, $(this).height(), tY); 
		    _(circles).forEach(function(value) {
				// value.material.uniforms.mouse.value.x = tX * 10; 
		  //   	value.material.uniforms.mouse.value.y = tY * 10; 
		    	value.setPosition(tX * 10, tY * 10);
			});
		}
	);
}


