import React, { useEffect } from 'react';
import * as THREE from 'three';
import useStore from '../useStore';
import withAnimationState from '../withAnimationState';
import { Circle, CustomText, DynamicDoubleArrow, FatArrow, Sphere } from './';


const defaultInnerState = (id) => ({
  [`${id}.Sphere1`]: { visible: false },
  [`${id}.Sphere2`]: { visible: false },
  [`${id}.Sphere3`]: { visible: false },
  [`${id}.Sphere4`]: { visible: false },
  [`${id}.Circle`]: { visible: false },
  [`${id}.label`]: { visible: false },
  [`${id}.label2`]: { visible: false },
  [`${id}.causation`]: { visible: false },
  [`${id}.relations1`]: { visible: false },
  [`${id}.relations2`]: { visible: false },
  [`${id}.relations3`]: { visible: false },
  [`${id}.relations4`]: { visible: false },
  [`${id}.relations5`]: { visible: false },
  [`${id}.relations6`]: { visible: false },
})

function allSphereVisible(id, visible) {
  return {
    [`${id}.Sphere1`]: { visible },
    [`${id}.Sphere2`]: { visible },
    [`${id}.Sphere3`]: { visible },
    [`${id}.Sphere4`]: { visible },
  }
}
function allRelationsVisible(id, visible) {
  return {
    [`${id}.relations1`]: { visible },
    [`${id}.relations2`]: { visible },
    [`${id}.relations3`]: { visible },
    [`${id}.relations4`]: { visible },
    [`${id}.relations5`]: { visible },
    [`${id}.relations6`]: { visible },
  }
}

function allVisible(id, visible) {
  return {
    ...allSphereVisible(id, visible),
    ...allRelationsVisible(id, visible),
    [`${id}.Circle`]: { visible },
    [`${id}.label`]: { visible },
    [`${id}.label2`]: { visible },
    [`${id}.causation`]: { visible },
  }
}


function getAnimationUpdates(id, variant) {
  switch (variant) {
    case 'oneSphere':
      return {
        ...allVisible(id, false),
        [`${id}.Sphere1`]: { visible: true }
      };
    // case 'oneSphere-details':
    //   return {
    //     [`${id}.Sphere1.label`]: { variant: 'visible', duration: 0.5 },
    //   };
    case 'twoSphere':
      return {
        ...allVisible(id, false),
        [`${id}.Sphere1`]: { visible: true },
        [`${id}.Sphere2`]: { visible: true },
        // [`${id}.Sphere1.label`]: { variant: 'hidden', duration: 0.5 },
      };
    case 'relation':
      return {
        ...allVisible(id, false),
        [`${id}.Sphere1`]: { visible: true },
        [`${id}.Sphere2`]: { visible: true },
        [`${id}.relations1`]: { visible: true },
      };
    case 'allRelations':
      return {
        ...allVisible(id, true),
        [`${id}.Circle`]: { visible: false }
      };
    // case 'accumulation-description':
    //   return {
    //     [`${id}.label2`]: { visible: true },
    //   };
    // case 'accumulation-description-end':
    //   return {
    //     [`${id}.label2`]: { visible: false },
    //   };
    default:
      // Optionally handle the default case
      return {};
  }
}


const EmergentEntity = React.forwardRef(({ id, animationState, ...props }, ref) => {

  const { updateAnimationState, batchUpdateAnimationStates } = useStore();

  const { radius, visible, offset = new THREE.Vector3(0, 0, 0) } = animationState;
  // Clone the position to avoid mutating the original data.
  const position = new THREE.Vector3().copy(animationState.position);
  position.add(offset);

  const causationAnimationState = useStore(state => state.animationStates[`${id}.causation`] || {});
  const relationsAnimationState = useStore(state => state.animationStates[`${id}.relations`] || {});

  const sphereRadius = radius / 4;
  const causationLength = radius / 2;
  const sphereOffset = radius / 3;

  // Effect to update child component's animation state based on the this variant
  useEffect(() => {
    batchUpdateAnimationStates(getAnimationUpdates(id, animationState.variant))
  }, [animationState.variant, batchUpdateAnimationStates, id]);

  // Define animation variants
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: animationState.opacity ?? 1.0 },
  };

  const spherePosition1 = new THREE.Vector3(-sphereOffset, +sphereOffset, -causationLength);
  const spherePosition2 = new THREE.Vector3(+sphereOffset, +sphereOffset, -causationLength);
  const spherePosition3 = new THREE.Vector3(-sphereOffset, -sphereOffset, -causationLength);
  const spherePosition4 = new THREE.Vector3(+sphereOffset, -sphereOffset, -causationLength);

  const fatArrowVarient = causationAnimationState.visible ? 'visible' : 'hidden';
  const causationArrows = (id, start, end) => (
    <group visible={causationAnimationState.visible}>
      <FatArrow id={`${id}.FatArrow1`} initialState={{ variant: fatArrowVarient, duration: 1, from: new THREE.Vector3(start.x - sphereOffset, start.y + sphereOffset, start.z), to: new THREE.Vector3(end.x - sphereOffset, end.y + sphereOffset, end.z) }} />
      <FatArrow id={`${id}.FatArrow2`} initialState={{ variant: fatArrowVarient, duration: 1, from: new THREE.Vector3(start.x + sphereOffset, start.y + sphereOffset, start.z), to: new THREE.Vector3(end.x + sphereOffset, end.y + sphereOffset, end.z) }} />
      <FatArrow id={`${id}.FatArrow3`} initialState={{ variant: fatArrowVarient, duration: 1, from: new THREE.Vector3(start.x - sphereOffset, start.y - sphereOffset, start.z), to: new THREE.Vector3(end.x - sphereOffset, end.y - sphereOffset, end.z) }} />
      <FatArrow id={`${id}.FatArrow4`} initialState={{ variant: fatArrowVarient, duration: 1, from: new THREE.Vector3(start.x + sphereOffset, start.y - sphereOffset, start.z), to: new THREE.Vector3(end.x + sphereOffset, end.y - sphereOffset, end.z) }} />
    </group>
  );

  // Calculate label position based on initialState position and any offset
  const labelPosition = new THREE.Vector3(0, radius * 1.2, 0);
  const label2Position = new THREE.Vector3(0, radius * .75, 0);

  return (
    // We set a mesh for this object so we can get a ref for DynamicDoubleArrow above this component
    <group ref={ref} position={position} visible={visible} userData={{ meshId: `${id}.Circle` }} >
      <CustomText
        id={`${id}.label`}
        initialState={{
          visible: false,
          position: labelPosition,
          scale: 0.5
        }}
      />
      <CustomText
        id={`${id}.label2`}
        initialState={{
          visible: false,
          position: label2Position,
          scale: 0.3
        }}
      />
      <Circle id={`${id}.Circle`} initialState={{ radius: radius }} />
      <Sphere id={`${id}.Sphere1`} initialState={{ position: spherePosition1, radius: sphereRadius }} />
      <Sphere id={`${id}.Sphere2`} initialState={{ position: spherePosition2, radius: sphereRadius }} />
      <Sphere id={`${id}.Sphere3`} initialState={{ position: spherePosition3, radius: sphereRadius }} />
      <Sphere id={`${id}.Sphere4`} initialState={{ position: spherePosition4, radius: sphereRadius }} />
      <group visible={relationsAnimationState.visible}>
        <DynamicDoubleArrow id={`${id}.relations1`} initialState={{ visible: false, fromId: `${id}.Sphere1`, toId: `${id}.Sphere2` }} />
        <DynamicDoubleArrow id={`${id}.relations2`} initialState={{ visible: false, fromId: `${id}.Sphere3`, toId: `${id}.Sphere4` }} />
        <DynamicDoubleArrow id={`${id}.relations3`} initialState={{ visible: false, fromId: `${id}.Sphere1`, toId: `${id}.Sphere3` }} />
        <DynamicDoubleArrow id={`${id}.relations4`} initialState={{ visible: false, fromId: `${id}.Sphere2`, toId: `${id}.Sphere4` }} />
        <DynamicDoubleArrow id={`${id}.relations5`} initialState={{ visible: false, fromId: `${id}.Sphere1`, toId: `${id}.Sphere4` }} />
        <DynamicDoubleArrow id={`${id}.relations6`} initialState={{ visible: false, fromId: `${id}.Sphere2`, toId: `${id}.Sphere3` }} />
      </group>
      {
        animationState.causation === "bottomup" ?
          causationArrows(`${id}.causation`, new THREE.Vector3(0, 0, -(causationLength - sphereRadius)), new THREE.Vector3(0, 0, -causationLength * 0.05)) : causationArrows(`${id}.causation`, new THREE.Vector3(0, 0, -causationLength * 0.05), new THREE.Vector3(0, 0, -(causationLength - sphereRadius)))
      }
    </group>
  );
});

// Automatically wrap EmergentEntity with the HOC before export
export default withAnimationState(EmergentEntity);