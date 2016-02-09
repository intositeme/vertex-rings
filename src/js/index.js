
window.$ = require("jquery");
// TweenMax = require ('gsap');
// $('h1').css('background-color', "red");
window.THREE = require('three');

var sectionHolder = document.querySelectorAll('section.post-content')[0];
var scene ;
var camera ;
var renderer ;
var raycaster;
var sphere;

var WIDTH ;
var HEIGHT;

var circlRawMesh;

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



// 





var render = function () {
	requestAnimationFrame( render );

	renderer.render(scene, camera);
	var time = performance.now();
	if (circlRawMesh) {
		//circlRawMesh.rotation.y = time * 0.0005;
		circlRawMesh.material.uniforms.time.value = time * 0.005;

	}
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
	var triangles = 500;
	var geometry = new THREE.BufferGeometry();
	var resolution = 300;
	var amplitude = 4;
	var innerThickness = 0.4;
	var thicknessAmp = 2;
	var size = 360 / resolution;

	var colors = new Float32Array( resolution * 4 * 2 );
	var vertices = new Float32Array( resolution * 2 * 3   );


	for(var i = 0; i < resolution; i++) {
	    var segment = ( i * size ) * Math.PI / 180;
	    var segment2 = ( (i  ) * size +  size*.5 ) * Math.PI / 180;
	    //outer ring
	    vertices[ i * 6      ] = Math.cos( segment ) * amplitude + Math.random() * innerThickness;
	    vertices[ i * 6 +  1 ] = Math.sin( segment ) * amplitude + Math.random() * innerThickness;
	    vertices[ i * 6 +  2 ] = Math.random() * thicknessAmp ;
	    //inner ring
	    vertices[ i * 6 +  3 ] = Math.cos( segment2 ) * (amplitude - innerThickness* Math.random()) ;
	    vertices[ i * 6 +  4 ] = Math.sin( segment2 ) * (amplitude - innerThickness* Math.random()) ;
	    vertices[ i * 6 +  5 ] = Math.random() * thicknessAmp; 

	    // push R G B A for each Vertice Set
	    var tB = Math.random()+ 0.2;
		colors[ i * 12        ] = ( tB );
		colors[ i * 12 +  1   ] = ( tB );
		colors[ i * 12 +  2   ] = ( tB );
		colors[ i * 12 +  3   ] = ( Math.random() + 0.2);
		tB = Math.random()+ 0.2;
	    // push R G B A for each Vertice Set
		colors[ i * 12 +  4   ] = ( tB );
		colors[ i * 12 +  5   ] = ( tB );
		colors[ i * 12 +  6   ] = ( tB );
		colors[ i * 12 +  7   ] = ( Math.random() + 0.2);
		tB = Math.random()+ 0.2;
		colors[ i * 12 +  8   ] = ( tB );
		colors[ i * 12 +  9   ] = ( tB );
		colors[ i * 12 +  10   ] = ( tB );
		colors[ i * 12 +  11   ] = ( Math.random() + 0.2);
	}

	var indices = new Uint32Array( resolution * 2 *3   );
	for ( i = 0; i < resolution * 2 * 3 ; i++) {
		var tI = i*3;
		var tNewI = i;
		tNewI = (tNewI >= resolution * 2 -1)? tNewI% resolution * 2 : tNewI;
		indices[tI] = i + Math.random() ;
		indices[tI+1] = i+1 >= (resolution * 2) -2 ? (i+1)% (resolution * 2 ) : i+1 + Math.random();
		indices[tI+2] = i+2  >= (resolution * 2) -2 ? (i+2)% (resolution * 2 ) : i+2  + Math.random();
	}
	console.log('indices', indices, indices.length); 

	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 4 ) );
	geometry.setIndex(  new THREE.BufferAttribute( indices, 1 ) );

	var material = new THREE.RawShaderMaterial( {
		uniforms: {
			time: { type: "f", value: 1.0 },
			mouse: { type: "v2", value: new THREE.Vector2(0.5, 0.5) }
		},
		vertexShader: document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		side: THREE.DoubleSide,
		transparent: true,
		wireframeLinewidth: 1
	} );

	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.set(0.0, 0.0, 0.0); 
	scene.add( mesh );
	circlRawMesh = mesh;

	renderer.domElement.onmousemove = function(event){
	    var tX = ( (event.clientX - this.offsetLeft )/ WIDTH ) * 2 - 1;
		var tY = 0- ( (event.clientY- this.offsetTop) / HEIGHT ) * 2 + 1;

	    circlRawMesh.material.uniforms.mouse.value.x = tX * 10 ; 
	    circlRawMesh.material.uniforms.mouse.value.y = tY * 10; 
	}
}


