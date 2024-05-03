import React, { useState, useEffect } from 'react';
import useStore from './useStore';

export function AnimationController({ children }) {

  const { setInitialAnimationState, updateAnimationState } = useStore(state => ({
    setInitialAnimationState: state.setInitialAnimationState,
    updateAnimationState: state.updateAnimationState
  }));

  useEffect(() => {

    // Initial setup for animation states
    setInitialAnimationState({
      'emergent1.Circle': { visible: false, fadeInDuration: 0, opacity: 0.5 },
      'emergent2.Circle': { opacity: 0.5 },
    });

    const animate = (id, delay, newState) => {
      setTimeout(() => {
        updateAnimationState(id, newState);
      }, delay);
    };

    // Example animations for different spheres
    animate('emergent1.Sphere1', 1000, { scale: 2 });
    animate('emergent1.Circle', 2000, { visible: true });
    animate('emergent1.Sphere2', 2000, { scale: 1.5 });
    animate('emergent1.Sphere3', 3000, { scale: 0.8 });

    return () => {
      // Clear all timeouts if necessary
    };
  }, [updateAnimationState]);

  return <>{children}</>;
}