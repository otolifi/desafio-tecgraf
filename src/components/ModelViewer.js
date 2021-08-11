import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Container, ProgressBar, Form } from 'react-bootstrap';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import http from '../http-common';
import Stats from 'three/examples/jsm/libs/stats.module'
import Draggable from 'react-draggable';

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

function ModelViewer() {
    const mountRef = useRef(null);

    var scene = useRef();
    var camera, renderer, controls, stats;
    const raycaster = new THREE.Raycaster();

    //const mouse = new THREE.Vector2();
    const mouse = useRef(new THREE.Vector2());
    var intersects = useRef([]);
    var selectable = useRef([]);
    const selected = useRef([]);

    var newModelState = [];
    var models = [];
    var colors = [];

    const [group, setGroup] = useState([
        { name: "Grupo A", value: 4},
        { name: "Grupo B", value: 3},
        { name: "Grupo C", value: 3},
        { name: "Grupo D", value: 2}]
      );
    
    const [grupo, setGrupo] = useState([]);
    
    const [progress, setProgress] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [viewPie, setViewPie] = useState(true);
    const [viewBar, setViewBar] = useState(true);
    const [viewModel, setViewModel] = useState([]);

      const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];


  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${group[index]["name"]}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  const getAll = () => {
    return http.get("/", {
    })
    .then(function (response) {
        // handle success

        console.log(response.data)

        models = response.data.models;
        colors = response.data.colors;

        init();

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
        console.log('Fully loaded')
      });
  };

function loadGeometry(path, color, group, numberOfModels, modelIndex) {
    const loader = new PLYLoader();
    loader.load(
        path,
        function (geometry) {
            geometry.computeVertexNormals()
            if (geometry) {
                var mat = new THREE.MeshPhongMaterial();
                
                mat.color.setHex( color );
                const mesh = new THREE.Mesh(geometry, mat)
                scene.current.add(mesh);
                mesh.userData['grupo'] = 'Grupo ' + group;
                let groupLetter = 'A';
                if (group < 5) {
                    groupLetter = 'A';
                } else if (group > 4 && group < 10) {
                    groupLetter = 'B';
                } else if (group > 9 && group < 16) {
                    groupLetter = 'C';
                } else {
                    groupLetter = 'D';
                }
                mesh.userData['group_letter'] = 'Grupo ' + groupLetter;

                setProgress(Math.ceil(100 * (modelIndex / numberOfModels)));

                selectable.current.push(mesh);

            }
            
        },
        (xhr) => {
            //console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
}

    function init() {
        scene.current = new THREE.Scene();
        scene.current.background = new THREE.Color(0xffffff);

        let light = new THREE.AmbientLight({color: 0xffffff, intensity: 1});
        scene.current.add(light);

        camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth/mountRef.current.clientHeight, 0.1, 1000000);
        renderer = new THREE.WebGLRenderer({antialias: false});
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild( renderer.domElement );

        var numberOfModels = 0;
        
        for (var x in models) {
            for (var y in models[x]) {
                numberOfModels++;
            } 
        }

        let k = 1;
        for (var x in models) {
            newModelState.push({
                name: "Grupo " + k,
                visible: true
            });
            let mView = viewModel;
            mView.push(true);
            setViewModel(mView);
            k++;
        }

        setGrupo(newModelState);

        setLoading(true);

        let i = 1;
        let j = 1;
        for (var x in models) {
            var color = "0x"+Math.floor(Math.random()*16777215).toString(16);
            color = colors[x];
            for (var y in models[x]) {
                loadGeometry(models[x][y], color, i, numberOfModels, j);
                j++;
            }
            i++;
        }
        camera.position.z = 500000;
        camera.position.y = 150000;

        window.addEventListener( 'resize', onWindowResize, false );

        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        stats = Stats()
        document.body.appendChild(stats.dom)

        animate();
        }

    function onWindowResize() {
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( mountRef.current.clientWidth, mountRef.current.clientHeight );
        }
    
    function onMouseMove( event ) {

        event.preventDefault();
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
        }
    
    function clearEmissive() {
        for (var x in selectable.current) {
            selectable.current[x].material.emissive.set(0x000000);
        }
        selected.current = [];
    }

    function animate() {

        raycaster.setFromCamera( mouse.current, camera );
        intersects.current = raycaster.intersectObjects( selectable.current );//selectable.current
        //controls.update();
    
        stats.update()
        renderer.render(scene.current, camera);
        //renderer.setAnimationLoop(animate);
        requestAnimationFrame(animate);
    }


    function togglePieChart() {
        setViewPie(!viewPie);
    }

    function toggleBarChart() {
        setViewBar(!viewBar);
    }

    function toggleGeometry(e) {
        for (var x in scene.current.children) {
            if (e.target.id == scene.current.children[x].userData['grupo']) {
                if (scene.current.children[x].visible) {
                    scene.current.children[x].visible = false;
                } else {
                    scene.current.children[x].visible = true;
                }
                setViewModel(scene.current.children[x].visible);
            }
        }
    }

    function calculateGraphs() {
        let count = [0, 0, 0, 0];
        if (selected.current.length > 0) {
            for (var x in selected.current) {
                console.log(x);
                console.log(selected.current[x].userData['group_letter'])
                switch (selected.current[x].userData['group_letter']) {
                    case "Grupo A":
                        count[0]++;
                        break;
                    case "Grupo B":
                        count[1]++;
                        break;
                    case "Grupo C":
                        count[2]++;
                        break;
                    case "Grupo D":
                        count[3]++;
                        break;
                    default:
                        break;
            }
            }
        }
        
        var grp_data = [
            {name: "Grupo A", value: count[0]},
            {name: "Grupo B", value: count[1]},
            {name: "Grupo C", value: count[2]},
            {name: "Grupo D", value: count[3]},
        ];
        setGroup(grp_data);
        console.log(group);
    }

    function handleClick() {

        if (intersects.current.length > 0) {
            intersects.current[0].object.material.emissive.set(0x00ff00);
            selected.current.push(intersects.current[0].object);
        } else {
            clearEmissive();
        }

        calculateGraphs();
    }

    useEffect(() => {
        getAll();
        document.title = "Desafio - Otoniel de Lima Filho";
    }, []
    )

    useLayoutEffect(() => {
        setGroup(group)
    }, [group]);

    useLayoutEffect(() => {
        setGrupo(grupo);
    }, [grupo]);

    useLayoutEffect(() => {
        setViewModel(viewModel);
    }, [viewModel]);

    useLayoutEffect(() => {
        setProgress(progress)
        if (progress > 99) {
            setLoading(false);
        }
    }, [progress]);


    return (
        <Container fluid className="m-0 p-0">
            <ProgressBar id='progress-bar' animated now={progress} style={{display: isLoading ? null : 'none' }}></ProgressBar>
            <div id="canvas" className="m-0 p-0" ref={mountRef} onMouseMove={onMouseMove} onClick={handleClick} style={{width: "100%", height: "100%"}}></div>
            <Draggable>
                <div className='graph position-absolute top-0 start-10' style={{display: viewPie ? null : 'none' }}>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={group}
                            cx={200}
                            cy={150}
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {group.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </div>
            </Draggable>
            <Draggable>
                <div className='graph position-absolute bottom-0 right-0' style={{display: viewBar ? null : 'none' }}>
                <BarChart
          width={330}
          height={250}
          data={group}
          margin={{
            top: 25,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
 
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
                </div>
            </Draggable>
            <div className='options position-absolute top-0 end-0'>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Label>
                        <h5>Visualizar Gráficos</h5>
                    </Form.Label>
                    <Form.Check type="checkbox" label="Pizza" onClick={togglePieChart} checked={viewPie}/>
                    <Form.Check type="checkbox" label="Barra" onClick={toggleBarChart} checked={viewBar}/>
                    <Form.Label>
                        <h5>Visualizar Estruturas</h5>
                    </Form.Label>
                    {grupo.map((x, i) => 
                        <Form.Check type="checkbox" 
                                    label={x.name} 
                                    id={x.name}
                                    disabled={isLoading ? true : false}
                                    checked={viewModel[i]}
                                    onClick={(e) => {toggleGeometry(e);}}/>
                    )}
                </Form.Group>
            </div>
        </Container>
        )
}

export default ModelViewer;