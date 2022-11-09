import { useRef, useEffect } from "react";
import {Col} from 'react-bootstrap';
import * as THREE from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

let canvas = null; 
let renderer, scene, camera, controls;

export const Transparent = ({brain}) => {
    const canvasRef = useRef(null);
    canvas = canvasRef.current;

    useEffect(() => {
        // console.log(canvasRef.current);
        canvas = canvasRef.current

        renderer = new THREE.WebGLRenderer({canvas:canvas, alpha:true});
        renderer.setSize(1200,700);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor( 0X000000, 1);

        renderer.outputEncoding = THREE.sRGBEncoding;

        scene = new THREE.Scene();

        // camera
        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.set( -250, -50, -50 );
        scene.add( camera );
        

        // scene.add( new THREE.AxesHelper( 1000 ) )

        // controls
        controls = new TrackballControls( camera, renderer.domElement );
        // controls.addEventListener( 'change', render );

        controls.rotateSpeed = 5.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;     

        // ambient
        scene.add( new THREE.AmbientLight( 0xffffff, .2 ) );

        // light
        const light = new THREE.PointLight( 0xffffff, 1.5 );
        camera.add( light );


        // model
        console.log(brain)
        new OBJLoader().load( `${brain}`, function ( obj ) {
            console.log(obj)
            obj.children.forEach( function ( child ) {
                // console.log(child)
                if ( child instanceof THREE.Mesh ) {

                    child.material.color.setHex( 0x111111 );
                    child.geometry.center()

                    child.material.side = THREE.DoubleSide;
                    

                }

            } );
            scene.add( obj );

            // render();

            animate();

        } );

        window.addEventListener('resize', onWindowResize);

      }, [canvasRef]);

    return (
        <Col md='6'>
            <canvas ref={el => { canvasRef.current = el; }}></canvas>
        </Col>
    )
}


function onWindowResize() {

    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    controls.handleResize();

    render();

}

function render() {

    renderer.render( scene, camera );

}

function animate() {
    requestAnimationFrame(animate)

    // trackball controls needs to be updated in the animation loop before it will work
    controls.update()

    render()

}