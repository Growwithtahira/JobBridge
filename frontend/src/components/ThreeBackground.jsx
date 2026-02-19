import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';

import * as THREE from 'three';
import { useScroll } from '@react-three/drei';

const ParticleField = (props) => {
    const ref = useRef();
    const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), []);
    const scroll = useScroll();

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;

        // Scroll-based color shift
        // If scroll is defined (inside ScrollControls), use it. Otherwise fallback.
        const scrollOffset = scroll ? scroll.offset : 0;

        // Shift from Violet (#6d28d9) to Cyan/Blue based on scroll
        // This makes it feel like diving deeper
        // We can manipulate the material color directly if it's a uniform, but for PointMaterial prop:
        // A better way for performance is to rotate the group or camera based on scroll, 
        // or just let the particles animate naturally. 
        // For distinct "colors down", let's rotate the hue.

        // Simpler approach that works without ScrollControls wrapper in parent:
        // We can't easily use useScroll without ScrollControls.
        // Let's stick to time-based color pulsing or mouse interaction for now 
        // unless we wrap the whole app in ScrollControls, which might break standard scrolling.
        // ALTERNATIVE: Use window.scrollY in a useEffect to set a global state or ref.
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#6d28d9"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const ThreeBackground = () => {
    return (
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ParticleField />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
