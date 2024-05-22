import React from 'react'
import Scene from './Scene'
import {
  Camera,
  DynamicDoubleArrow,
  EmergentEntity,
  TargetText,
  EmergentEntityNoBoundary,
  EntityScopes,
  EntityScopesTest
} from '../animationComponents'
import * as THREE from 'three'
import { AnimationController } from '../AnimationController' // Adjust import path as necessary
import useStore from '../useStore' // Adjust import path as necessary
import { Environment, OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'

/****************************
Scene Description:

Demonstrate the concepts of bottom-up causation, top-down causation, emergent entities
The scene will be 2D viewed from above
In SceneOne there is an abstract concept of an Emergent Entity that is represented by a Circle.
In this scene we will not use an abstract circle to show the boundary of the entity. 
The boundary of an Emergent Entity be formed by many small spheres.

Having the emergent entity with a fluid boundary is not obvious. It could use a soft body physics simulation.

Instead of top-down: outside-in
Instead of bottom-up: inside-out

 ****************************/

function SceneThree() {
  const emergentEntityRadius = 3.5

  // Delay, animationComponent id, animationState
  const animationSequence = [
    //[0, 'emergent1', { variant: "default" }],
  ]

  const cameraInitialState = {
    position: [0, 0, 35],
    zoom: 35,
    left: window.innerWidth / -2,
    right: window.innerWidth / 2,
    top: window.innerHeight / 2,
    bottom: window.innerHeight / -2,
    near: 0.1,
    far: 100
  }

  return (
    <>
      <AnimationController animations={animationSequence} useStore={useStore}>
        <Physics gravity={[0, 0, 0]}>
          <Scene>
            {/*

                    <EmergentEntityNoBoundary
                        id="emergent2"
                        initialState={{
                            position: new THREE.Vector3(+emergentEntityRadius * 2, 0, 0),
                            radius: emergentEntityRadius,
                            sphereCount: 100,
                            color: "blue",
                        }}
                    />

                    <EmergentEntityNoBoundary
                        id="emergent2"
                        initialState={{
                            position: new THREE.Vector3(-emergentEntityRadius * 2, 0, 0),
                            radius: emergentEntityRadius,
                            sphereCount: 100,
                            color: "green",
                        }}
                    />

                    <EmergentEntityNoBoundary
                        id="emergent2"
                        initialState={{
                            position: new THREE.Vector3(0, +emergentEntityRadius * 2, 0),
                            radius: emergentEntityRadius,
                            sphereCount: 100,
                            color: "orange",
                        }}
                    />

                    <EmergentEntityNoBoundary
                        id="emergent2"
                        initialState={{
                            position: new THREE.Vector3(0, -emergentEntityRadius * 2, 0),
                            radius: emergentEntityRadius,
                            sphereCount: 100,
                            color: "yellow",
                        }}
                    />

                    */}

            <EntityScopesTest id="EntityScopes1" radius={10} color="blue" />
          </Scene>
        </Physics>
      </AnimationController>

      <Camera id={'camera'} initialState={cameraInitialState} />
      <Environment preset="sunset" />
      <OrbitControls />
    </>
  )
}

export default SceneThree
