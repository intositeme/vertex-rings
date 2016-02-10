var _ = require('lodash');
var THREE = require('three');
var __id = 0;

function MeshRing (options) {
	var id, resolution, size, colors, vertices, indices;
	this._id = __id;
	__id++;
	this.mesh;
	this.geometry = new THREE.BufferGeometry();
	this._settings = {
		resolution : 500,
		amplitude : 4,
		innerThickness : 0.4,
		thicknessAmp : 2,
		size : 360,
		seed: this._id,
		wireframeLinewidth:1,
		wireframe:true,
		vertexShader: '',
		fragmentShader: '',
		mass: 10
	};
	this.goPosition = {x:0.5, y: 0.5};
	this.currentPosition = {x:0.5, y: 0.5};

	_.merge(this._settings, options);
	// Calculate size based on new Resolution passed in via options
	this._settings.size = 360 / this._settings.resolution;

	resolution = this._settings.resolution;
	size = this._settings.size;

	colors = new Float32Array( resolution * 4 * 2 );
	vertices = new Float32Array( resolution * 2 * 3   );
	indices = new Uint32Array( resolution * 2 *3   );

	for(var i = 0; i < resolution; i++) {
	    var segment = ( i * size ) * Math.PI / 180;
	    var segment2 = ( (i  ) * size +  size*.5 ) * Math.PI / 180;
	    //
	    this.setVertices(vertices, i, segment, segment2, this._settings.amplitude, this._settings.innerThickness);
	    // push R G B A for each Vertice Set
	    var tB = Math.random()+ 0.2;
	    this.setVertexColor (colors, i*12, tB, tB, tB, Math.random() + 0.2 );
		tB = Math.random()+ 0.2;
	    this.setVertexColor (colors, i*12 + 4, tB, tB, tB, Math.random() + 0.2 );
		tB = Math.random()+ 0.2;
	    this.setVertexColor (colors, i*12 + 8, tB, tB, tB, Math.random() + 0.2 );
	}

	for ( i = 0; i < resolution * 2 * 3 ; i++) {
		var tI = i*3;
		var tNewI = i;
		tNewI = (tNewI >= resolution * 2 -1)? tNewI% resolution * 2 : tNewI;
		indices[tI] = i + Math.random() ;
		indices[tI+1] = i+1 >= (resolution * 2) -2 ? (i+1)% (resolution * 2 ) : i+1 + Math.random();
		indices[tI+2] = i+2  >= (resolution * 2) -2 ? (i+2)% (resolution * 2 ) : i+2  + Math.random();
	}

	this.geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	this.geometry.addAttribute( 'normal', new THREE.BufferAttribute( vertices, 3 ) );
	this.geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 4 ) );
	this.geometry.setIndex(  new THREE.BufferAttribute( indices, 1 ) );
	
	this.material = new THREE.RawShaderMaterial( {
		uniforms: {
			time: { type: "f", value: 1.0 },
			seed: { type: "f", value: this._settings.seed },
			mouse: { type: "v2", value: new THREE.Vector2(0.5, 0.5) }
		},
		vertexShader: this._settings.vertexShader,
		fragmentShader: this._settings.fragmentShader,
		side: THREE.DoubleSide,
		transparent: true,
		wireframe: this._settings.wireframe,
		wireframeLinewidth:  this._settings.wireframeLinewidth
	} );
	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.position.set(0.0, 0.0, 0.0); 
}

(function() {
    this.getSettings = function () {
    	return this._settings;
    };
    this.setVertices = function (vertexList, index, segment, segment2, amplitude, thickness, thicknessAmp) {
    	var thicknessAmp = typeof thicknessAmp !== 'undefined' ?  thicknessAmp : 2;
    	vertexList[ index * 6      ] = Math.cos( segment ) * amplitude + Math.random() * thickness;
	    vertexList[ index * 6 +  1 ] = Math.sin( segment ) * amplitude + Math.random() * thickness;
	    vertexList[ index * 6 +  2 ] = Math.random() * thicknessAmp ;
	    //inner ring
	    vertexList[ index * 6 +  3 ] = Math.cos( segment2 ) * (amplitude - thickness* Math.random()) ;
	    vertexList[ index * 6 +  4 ] = Math.sin( segment2 ) * (amplitude - thickness* Math.random()) ;
	    vertexList[ index * 6 +  5 ] = Math.random() * thicknessAmp; 
    };
    this.setVertexColor = function (colorList, index, colorR, colorG, colorB, colorA) {
    	colorList[ index        ] = ( colorR );
		colorList[ index +  1   ] = ( colorG );
		colorList[ index +  2   ] = ( colorB );
		colorList[ index +  3   ] = ( colorA);
    };
    this.setPosition = function (x, y) {
    	this.goPosition.x = x;
    	this.goPosition.y = y;
    };
    this.update = function () {
    	this.updatePosition();	
    	this.material.uniforms.mouse.value.x = this.currentPosition.x; 
		this.material.uniforms.mouse.value.y =  this.currentPosition.y; 
    };
    this.updatePosition = function () {
    	var tX = (this.goPosition.x - this.currentPosition.x) / this._settings.mass;
    	var tY = (this.goPosition.y - this.currentPosition.y) / this._settings.mass;
    	this.currentPosition.x += tX;
    	this.currentPosition.y += tY;

    };
}).call(MeshRing.prototype);

module.exports = MeshRing;