import {Canvas, useFrame} from "@react-three/fiber";
import {
    AccumulativeShadows,
    useGLTF,
    Center,
    Environment,
    RandomizedLight,
    Decal,
    useTexture,
} from "@react-three/drei";
import {easing} from 'maath'
import {useRef} from "react";
import {useSnapshot} from "valtio";
import {state} from './store';

export const App = ({position = [0, 0, 2.5], fov = 25}) => (
    <Canvas eventSource={document.getElementById('root')}
            eventPrefix={"client"}
            camera={{position, fov}}
            shadows
            gl={{ preserveDrawingBuffer: true }}
    >

        <ambientLight intensity={0.5} />

        <Environment preset={"city"} />

        <CameraRig>
            <Backdrop/>
            <Center>
                <Shirt/>
            </Center>
        </CameraRig>
    </Canvas>
);

function Shirt(props) {
    const snap = useSnapshot(state);

    const texture = useTexture(`/${ snap.selectedDecal }.png`);

    const {nodes, materials} = useGLTF('/shirt_baked_collapsed.glb');

    useFrame((state, delta) =>
        easing.dampC(materials.lambert1.color, snap.selectedColor, 0.25, delta)
    )

    return (
        <mesh
            castShadow
            geometry={nodes.T_Shirt_male.geometry}
            material={materials.lambert1}
            material-roughness={1}
            {...props}
            dispose={null}
        >
            <Decal
                position={[0, 0.04, 0.15]}
                rotation={[0, 0, 0]}
                scale={0.15}
                opacity={0.3} // TODO opacity doesn't appear to be working
                map={texture}
                // map-anisotropy={16}
                // TODO revisit
                /* Rather than
                const texture = useTexture('/three2.png');
                which sets the anisotrophy to 1 on the texture we can use the max of the client

                const texture = useLoader(TextureLoader, 'path/to/texture.jpg');
                const { gl } = useThree(); // Access the Three.js context

                // Set anisotropy for the texture
                texture.anisotropy = gl.capabilities.getMaxAnisotropy();
                 */
            />
        </mesh>
    )
}

function Backdrop() {
    const shadows = useRef()

    useFrame((state, delta) =>
        easing.dampC(
            shadows.current.getMesh().material.color,
            state.selectedColor,
            0.25,
            delta
        )
    )

    return (
        <AccumulativeShadows
            ref={shadows}
            temporal
            frames={60}
            alphaTest={0.85}
            scale={10}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, -0.14]}>
            <RandomizedLight
                amount={4}
                radius={9}
                intensity={0.55}
                ambient={0.25}
                position={[5, 5, -10]}
            />
            <RandomizedLight
                amount={4}
                radius={5}
                intensity={0.25}
                ambient={0.55}
                position={[-5, 5, -9]}
            />
        </AccumulativeShadows>
    )
}

function CameraRig({children}) {
    /**
     * Actually moving the scene, not the camera. Replacement to Orbit controls so that we can control
     * where/what the user can view
     */
    const group = useRef()

    useFrame((state, delta) => {
        easing.damp3(state.camera.position, [0, 0, 1.8], 0.25, delta)
        easing.dampE(
            group.current.rotation,
            // [state.pointer.y / 10, -state.pointer.x / 5, 0],
            [state.pointer.y / 3, -state.pointer.x / 2, 0],
            0.25,
            delta
        )
    })

    return <group ref={group}>{children}</group>
}

useGLTF.preload('/shirt_baked_collapsed.glb')
