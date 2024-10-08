import { Canvas } from "@react-three/fiber";
import {
    useGLTF,
    OrbitControls,
    Center,
    Environment
} from "@react-three/drei";
import { useRef } from "react";

export const App = ({ position=[-1,0,2.5], fov = 25 }) => (
    <Canvas eventSource={document.getElementById('root')}
            eventPrefix={"client"}
            camera={{position, fov}}>

        <ambientLight intensity={ 0.5 }/>

        <Environment preset={ "city" } />
        <Center>
            <Shirt/>
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

useGLTF.preload('/shirt_baked_collapsed.glb')
