import './style.css'

//WebGL Curtain
import { Curtains, Plane, ShaderPass, Vec2, PingPongPlane } from 'curtainsjs'

//SmoothScroll

import { SmoothScroll } from './native.smooth.scroll'

//Shaders and textures
import scrollFs from './shaders/scrollfs.glsl'
import fs from './shaders/fs.glsl'
import vs from './shaders/vs.glsl'
import vs_plane from './shaders/vs_plane.glsl'
import fs_plane from './shaders/fs_plane.glsl'
import {TextTexture} from 'https://gistcdn.githack.com/martinlaxenaire/549b3b01ff4bd9d29ce957edd8b56f16/raw/2f111abf99c8dc63499e894af080c198755d1b7a/TextTexture.js'

//TextReveal animations
import {gsap} from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";

window.addEventListener('load', () => {
    //Smooth Scroll
    const smoothScroll = new SmoothScroll({
        container: document.getElementById("page"),
        threshold: 1, 
        // use built-in raf loop
        useRaf: true
    })
    // create curtains instance
    const curtains = new Curtains({
        container: "canvas",
        pixelRatio: Math.min(1.5, window.devicePixelRatio)
    }).onError(() => {
        // we will add a class to the document body to display original images
        document.body.classList.add("no-curtains");

    }).onContextLost(() => {
        // on context lost, try to restore the context
        curtains.restoreContext();


    });
    // track scroll values
    const scroll = {
        value: 0,
        lastValue: 0,
        effect: 0,
    };

     // mouse/touch move
     const ww = window.innerWidth;
     const wh = window.innerHeight;

     //Represents a two-component vector. Access the X component of the vector as v and the Y component as v.
     // Constructor new Vec2 (x, y) Constructs a two-component vector.
     
    // on success
    curtains.onSuccess(() => {
        //Variables for reveal animation
        let imagePlanes = []
        let textPlanes = []

        // create our shader pass
        const scrollPass = new ShaderPass(curtains, {
            fragmentShader: scrollFs,
            depth: false,
            uniforms: {
                scrollEffect: {
                    name: "uScrollEffect",
                    type: "1f",
                    value: scroll.effect,
                },
                scrollStrength: {
                    name: "uScrollStrength",
                    type: "1f",
                    value: 2.5,
                },
            }
        });  

        // calculate the lerped scroll effect
        scrollPass.onRender(() => {

        scroll.lastValue = scroll.value;
        scroll.value = curtains.getScrollValues().y;

        // clamp delta
        scroll.delta = Math.max(-30, Math.min(30, scroll.lastValue - scroll.value));

        scroll.effect = curtains.lerp(scroll.effect, scroll.delta, 0.05);
        scrollPass.uniforms.scrollEffect.value = scroll.effect;

        });
        
         // create our text planes
         const textEls = document.querySelectorAll('.text-plane');
         

         textEls.forEach(textEl => {
             const textPlane = new Plane(curtains, textEl, {
                 vertexShader: vs, // our vertex shader 
                 fragmentShader: fs, // our framgent shader
                 renderOrder: 0
             });

             textPlanes.push(textPlane)

             const textTexture = new TextTexture({
              plane: textPlane,
              textElement: textPlane.htmlElement,
              sampler: "uTexture",
              resolution: 1.5,
              skipFontLoading: true, // we've already loaded the fonts
            });
        });
        //create our image planes
        
        const imageEls = document.querySelectorAll('.plane');

        // get our plane element
        if(imageEls.length != 0)
        {
                // set our initial parameters (basic uniforms)
            var params = {
                vertexShader: vs_plane, // our vertex shader 
                fragmentShader: fs_plane, // our framgent shader
                widthSegments: 40,
                heightSegments: 40, // we now have 40*40*6 = 9600 vertices !
                fov: 35,
                renderOrder:1,
                uniforms: {
                    time: {
                        name: "uTime", // uniform name that will be passed to our shaders
                        type: "1f", // this means our uniform is a float
                        value: 0,
                    },
                }
            }
            
         // create our plane mesh
            imageEls.forEach(imageEls => {
                const imagePlane = new Plane(curtains, imageEls, params)
                console.log(imagePlane)
                imagePlanes.push(imagePlane)
                imagePlane.onReady(function() {}).onRender(function() {
                    // update our time uniform value
                    imagePlane.uniforms.time.value++;
                });
            });
        }
        
        
        // gsap.registerPlugin(ScrollTrigger)

        // let listItems = [...document.querySelectorAll('.scroll-trigger')]
        
        // let options = {
        //     rootMargin: '0%',
        //     threshold: 0.0
        // }
        // let observer = new IntersectionObserver(showItem, options);
        
        
        // function showItem(entries) {
        //     entries.forEach(entry => {
        //         if (entry.isIntersecting) {
        //             var tl = gsap.timeline();
        //             console.log(entry)
        //             tl.set(e, {
        //                 duration: 1, 
        //                 opacity: 1, 
        //                 delay: 0.5, 
        //                 stagger: 0.2,
        //                 ease: "slow", 
        //                 force3D: true 
        //             });
        //         } 
        //     });     
        // }
        
        // listItems.forEach(item => {
        //     observer.observe(item);
        // })      
    });
    window.addEventListener("resize", () => {
        smoothScroll.resize();
    })
});


