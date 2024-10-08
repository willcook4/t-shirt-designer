import { Canvas } from "@react-three/fiber";
import {
    AccumulativeShadows,
    useGLTF,
    OrbitControls,
    Center,
    Environment,
    RandomizedLight
} from "@react-three/drei";
import { useRef } from "react";

export const App = ({ position=[-1,0,2.5], fov = 25 }) => (
    <Canvas eventSource={document.getElementById('root')}
            eventPrefix={"client"}
            camera={{position, fov}}
            shadows
    >

        <ambientLight intensity={ 0.5 }/>

        <Environment preset={ "city" } />
        <Center>
            <Shirt/>
            <Backdrop />
        </Center>
        <OrbitControls/>
    </Canvas>
);

function Shirt(props) {
    const { nodes, materials } = useGLTF('/shirt_baked_collapsed.glb')

    return (
        <mesh
          castShadow
          geometry={nodes.T_Shirt_male.geometry}
          material={materials.lambert1}
          material-roughness={1}
          {...props}
          dispose={null}></mesh>
      )
}

function Backdrop() {
    const shadows = useRef()

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

useGLTF.preload('/shirt_baked_collapsed.glb')
