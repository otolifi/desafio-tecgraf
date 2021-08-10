import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Button, Container, Row, Col, Accordion, Card, InputGroup, FormControl, Table, ProgressBar, Form } from 'react-bootstrap';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import http from '../http-common';
import Stats from 'three/examples/jsm/libs/stats.module'
import Draggable from 'react-draggable';

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

function ModelViewer() {
    const mountRef = useRef(null);
    var scene = useRef();
    var camera, renderer, controls, axesHelper, stats;
    var newModelState = [];

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
      /*const COLORS = ["#FF13D1", "#00FF00", "#FFA5A5", "#385067", "#00FFFF", 
                      "#FF00FF", "#55626D", "#FFF4A5" ,"#D6D6D6", "#0FFF00", 
                      "#C2FF13", "#FF0000", "#0000FF", "#13F1FF", "#FF8C00", 
                      "#80482C", "#8C8C8C", "#FFF000", "#861D9B", "#1C055E", "#000000"]*/

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
    
    


    function init() {
        //THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);
        scene.current = new THREE.Scene();
        scene.current.background = new THREE.Color(0xffffff);

        var geometry = new THREE.BoxGeometry( 3, 3, 1 );
        
        let light = new THREE.AmbientLight({color: 0xffffff, intensity: 1});
        scene.current.add(light);
        let directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        scene.current.add( directionalLight );
        let pointLight = new THREE.PointLight(0xffffff, 2, 4);
        scene.current.add(pointLight);

        camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth/mountRef.current.clientHeight, 0.1, 1000000);
        renderer = new THREE.WebGLRenderer({antialias: false});
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild( renderer.domElement );

        const models1 = ['./ply/ppsection1/part_b/g0.ply', './ply/ppsection1/part_e/g0.ply', './ply/ppsection1/part_d/g0.ply', './ply/ppsection1/part_c/g0.ply', './ply/ppsection1/part_f/g0.ply', './ply/ppsection1/part_a/g0.ply', './ply/ppsection1/part_h/g0.ply', './ply/ppsection1/part_i/g0.ply']

        const models2 = ['./ply/ppsection2/part_b/g92.ply', './ply/ppsection2/part_b/g86.ply', './ply/ppsection2/part_b/g51.ply', './ply/ppsection2/part_b/g45.ply', './ply/ppsection2/part_b/g79.ply', './ply/ppsection2/part_b/g145.ply', './ply/ppsection2/part_b/g151.ply', './ply/ppsection2/part_b/g6.ply', './ply/ppsection2/part_b/g7.ply', './ply/ppsection2/part_b/g150.ply', './ply/ppsection2/part_b/g144.ply', './ply/ppsection2/part_b/g78.ply', './ply/ppsection2/part_b/g44.ply', './ply/ppsection2/part_b/g50.ply', './ply/ppsection2/part_b/g87.ply', './ply/ppsection2/part_b/g93.ply', './ply/ppsection2/part_b/g85.ply', './ply/ppsection2/part_b/g91.ply', './ply/ppsection2/part_b/g46.ply', './ply/ppsection2/part_b/g52.ply', './ply/ppsection2/part_b/g152.ply', './ply/ppsection2/part_b/g146.ply', './ply/ppsection2/part_b/g5.ply', './ply/ppsection2/part_b/g4.ply', './ply/ppsection2/part_b/g147.ply', './ply/ppsection2/part_b/g153.ply', './ply/ppsection2/part_b/g53.ply', './ply/ppsection2/part_b/g47.ply', './ply/ppsection2/part_b/g90.ply', './ply/ppsection2/part_b/g84.ply', './ply/ppsection2/part_b/g80.ply', './ply/ppsection2/part_b/g94.ply', './ply/ppsection2/part_b/g43.ply', './ply/ppsection2/part_b/g57.ply', './ply/ppsection2/part_b/g143.ply', './ply/ppsection2/part_b/g0.ply', './ply/ppsection2/part_b/g1.ply', './ply/ppsection2/part_b/g142.ply', './ply/ppsection2/part_b/g56.ply', './ply/ppsection2/part_b/g42.ply', './ply/ppsection2/part_b/g95.ply', './ply/ppsection2/part_b/g81.ply', './ply/ppsection2/part_b/g97.ply', './ply/ppsection2/part_b/g83.ply', './ply/ppsection2/part_b/g68.ply', './ply/ppsection2/part_b/g54.ply', './ply/ppsection2/part_b/g40.ply', './ply/ppsection2/part_b/g140.ply', './ply/ppsection2/part_b/g3.ply', './ply/ppsection2/part_b/g2.ply', './ply/ppsection2/part_b/g141.ply', './ply/ppsection2/part_b/g41.ply', './ply/ppsection2/part_b/g55.ply', './ply/ppsection2/part_b/g69.ply', './ply/ppsection2/part_b/g82.ply', './ply/ppsection2/part_b/g96.ply', './ply/ppsection2/part_b/g32.ply', './ply/ppsection2/part_b/g26.ply', './ply/ppsection2/part_b/g126.ply', './ply/ppsection2/part_b/g132.ply', './ply/ppsection2/part_b/g133.ply', './ply/ppsection2/part_b/g127.ply', './ply/ppsection2/part_b/g27.ply', './ply/ppsection2/part_b/g33.ply', './ply/ppsection2/part_b/g25.ply', './ply/ppsection2/part_b/g31.ply', './ply/ppsection2/part_b/g19.ply', './ply/ppsection2/part_b/g119.ply', './ply/ppsection2/part_b/g131.ply', './ply/ppsection2/part_b/g125.ply', './ply/ppsection2/part_b/g124.ply', './ply/ppsection2/part_b/g130.ply', './ply/ppsection2/part_b/g118.ply', './ply/ppsection2/part_b/g18.ply', './ply/ppsection2/part_b/g30.ply', './ply/ppsection2/part_b/g24.ply', './ply/ppsection2/part_b/g20.ply', './ply/ppsection2/part_b/g34.ply', './ply/ppsection2/part_b/g134.ply', './ply/ppsection2/part_b/g120.ply', './ply/ppsection2/part_b/g108.ply', './ply/ppsection2/part_b/g109.ply', './ply/ppsection2/part_b/g121.ply', './ply/ppsection2/part_b/g135.ply', './ply/ppsection2/part_b/g35.ply', './ply/ppsection2/part_b/g21.ply', './ply/ppsection2/part_b/g37.ply', './ply/ppsection2/part_b/g23.ply', './ply/ppsection2/part_b/g123.ply', './ply/ppsection2/part_b/g137.ply', './ply/ppsection2/part_b/g136.ply', './ply/ppsection2/part_b/g122.ply', './ply/ppsection2/part_b/g22.ply', './ply/ppsection2/part_b/g36.ply', './ply/ppsection2/part_b/g13.ply', './ply/ppsection2/part_b/g107.ply', './ply/ppsection2/part_b/g113.ply', './ply/ppsection2/part_b/g112.ply', './ply/ppsection2/part_b/g106.ply', './ply/ppsection2/part_b/g12.ply', './ply/ppsection2/part_b/g10.ply', './ply/ppsection2/part_b/g38.ply', './ply/ppsection2/part_b/g138.ply', './ply/ppsection2/part_b/g110.ply', './ply/ppsection2/part_b/g104.ply', './ply/ppsection2/part_b/g105.ply', './ply/ppsection2/part_b/g111.ply', './ply/ppsection2/part_b/g139.ply', './ply/ppsection2/part_b/g39.ply', './ply/ppsection2/part_b/g11.ply', './ply/ppsection2/part_b/g29.ply', './ply/ppsection2/part_b/g15.ply', './ply/ppsection2/part_b/g115.ply', './ply/ppsection2/part_b/g101.ply', './ply/ppsection2/part_b/g129.ply', './ply/ppsection2/part_b/g128.ply', './ply/ppsection2/part_b/g100.ply', './ply/ppsection2/part_b/g114.ply', './ply/ppsection2/part_b/g14.ply', './ply/ppsection2/part_b/g28.ply', './ply/ppsection2/part_b/g16.ply', './ply/ppsection2/part_b/g102.ply', './ply/ppsection2/part_b/g116.ply', './ply/ppsection2/part_b/g117.ply', './ply/ppsection2/part_b/g103.ply', './ply/ppsection2/part_b/g17.ply', './ply/ppsection2/part_b/g70.ply', './ply/ppsection2/part_b/g64.ply', './ply/ppsection2/part_b/g58.ply', './ply/ppsection2/part_b/g59.ply', './ply/ppsection2/part_b/g65.ply', './ply/ppsection2/part_b/g71.ply', './ply/ppsection2/part_b/g98.ply', './ply/ppsection2/part_b/g67.ply', './ply/ppsection2/part_b/g73.ply', './ply/ppsection2/part_b/g72.ply', './ply/ppsection2/part_b/g66.ply', './ply/ppsection2/part_b/g99.ply', './ply/ppsection2/part_b/g89.ply', './ply/ppsection2/part_b/g62.ply', './ply/ppsection2/part_b/g76.ply', './ply/ppsection2/part_b/g9.ply', './ply/ppsection2/part_b/g8.ply', './ply/ppsection2/part_b/g77.ply', './ply/ppsection2/part_b/g63.ply', './ply/ppsection2/part_b/g88.ply', './ply/ppsection2/part_b/g49.ply', './ply/ppsection2/part_b/g75.ply', './ply/ppsection2/part_b/g61.ply', './ply/ppsection2/part_b/g149.ply', './ply/ppsection2/part_b/g148.ply', './ply/ppsection2/part_b/g60.ply', './ply/ppsection2/part_b/g74.ply', './ply/ppsection2/part_b/g48.ply', './ply/ppsection2/part_e/g0.ply', './ply/ppsection2/part_e/g1.ply', './ply/ppsection2/part_d/g92.ply', './ply/ppsection2/part_d/g86.ply', './ply/ppsection2/part_d/g51.ply', './ply/ppsection2/part_d/g45.ply', './ply/ppsection2/part_d/g79.ply', './ply/ppsection2/part_d/g6.ply', './ply/ppsection2/part_d/g7.ply', './ply/ppsection2/part_d/g78.ply', './ply/ppsection2/part_d/g44.ply', './ply/ppsection2/part_d/g50.ply', './ply/ppsection2/part_d/g87.ply', './ply/ppsection2/part_d/g93.ply', './ply/ppsection2/part_d/g85.ply', './ply/ppsection2/part_d/g91.ply', './ply/ppsection2/part_d/g46.ply', './ply/ppsection2/part_d/g52.ply', './ply/ppsection2/part_d/g5.ply', './ply/ppsection2/part_d/g4.ply', './ply/ppsection2/part_d/g53.ply', './ply/ppsection2/part_d/g47.ply', './ply/ppsection2/part_d/g90.ply', './ply/ppsection2/part_d/g84.ply', './ply/ppsection2/part_d/g80.ply', './ply/ppsection2/part_d/g94.ply', './ply/ppsection2/part_d/g43.ply', './ply/ppsection2/part_d/g57.ply', './ply/ppsection2/part_d/g0.ply', './ply/ppsection2/part_d/g1.ply', './ply/ppsection2/part_d/g56.ply', './ply/ppsection2/part_d/g42.ply', './ply/ppsection2/part_d/g95.ply', './ply/ppsection2/part_d/g81.ply', './ply/ppsection2/part_d/g97.ply', './ply/ppsection2/part_d/g83.ply', './ply/ppsection2/part_d/g68.ply', './ply/ppsection2/part_d/g54.ply', './ply/ppsection2/part_d/g40.ply', './ply/ppsection2/part_d/g3.ply', './ply/ppsection2/part_d/g2.ply', './ply/ppsection2/part_d/g41.ply', './ply/ppsection2/part_d/g55.ply', './ply/ppsection2/part_d/g69.ply', './ply/ppsection2/part_d/g82.ply', './ply/ppsection2/part_d/g96.ply', './ply/ppsection2/part_d/g32.ply', './ply/ppsection2/part_d/g26.ply', './ply/ppsection2/part_d/g126.ply', './ply/ppsection2/part_d/g127.ply', './ply/ppsection2/part_d/g27.ply', './ply/ppsection2/part_d/g33.ply', './ply/ppsection2/part_d/g25.ply', './ply/ppsection2/part_d/g31.ply', './ply/ppsection2/part_d/g19.ply', './ply/ppsection2/part_d/g119.ply', './ply/ppsection2/part_d/g125.ply', './ply/ppsection2/part_d/g124.ply', './ply/ppsection2/part_d/g118.ply', './ply/ppsection2/part_d/g18.ply', './ply/ppsection2/part_d/g30.ply', './ply/ppsection2/part_d/g24.ply', './ply/ppsection2/part_d/g20.ply', './ply/ppsection2/part_d/g34.ply', './ply/ppsection2/part_d/g120.ply', './ply/ppsection2/part_d/g108.ply', './ply/ppsection2/part_d/g109.ply', './ply/ppsection2/part_d/g121.ply', './ply/ppsection2/part_d/g35.ply', './ply/ppsection2/part_d/g21.ply', './ply/ppsection2/part_d/g37.ply', './ply/ppsection2/part_d/g23.ply', './ply/ppsection2/part_d/g123.ply', './ply/ppsection2/part_d/g122.ply', './ply/ppsection2/part_d/g22.ply', './ply/ppsection2/part_d/g36.ply', './ply/ppsection2/part_d/g13.ply', './ply/ppsection2/part_d/g107.ply', './ply/ppsection2/part_d/g113.ply', './ply/ppsection2/part_d/g112.ply', './ply/ppsection2/part_d/g106.ply', './ply/ppsection2/part_d/g12.ply', './ply/ppsection2/part_d/g10.ply', './ply/ppsection2/part_d/g38.ply', './ply/ppsection2/part_d/g110.ply', './ply/ppsection2/part_d/g104.ply', './ply/ppsection2/part_d/g105.ply', './ply/ppsection2/part_d/g111.ply', './ply/ppsection2/part_d/g39.ply', './ply/ppsection2/part_d/g11.ply', './ply/ppsection2/part_d/g29.ply', './ply/ppsection2/part_d/g15.ply', './ply/ppsection2/part_d/g115.ply', './ply/ppsection2/part_d/g101.ply', './ply/ppsection2/part_d/g100.ply', './ply/ppsection2/part_d/g114.ply', './ply/ppsection2/part_d/g14.ply', './ply/ppsection2/part_d/g28.ply', './ply/ppsection2/part_d/g16.ply', './ply/ppsection2/part_d/g102.ply', './ply/ppsection2/part_d/g116.ply', './ply/ppsection2/part_d/g117.ply', './ply/ppsection2/part_d/g103.ply', './ply/ppsection2/part_d/g17.ply', './ply/ppsection2/part_d/g70.ply', './ply/ppsection2/part_d/g64.ply', './ply/ppsection2/part_d/g58.ply', './ply/ppsection2/part_d/g59.ply', './ply/ppsection2/part_d/g65.ply', './ply/ppsection2/part_d/g71.ply', './ply/ppsection2/part_d/g98.ply', './ply/ppsection2/part_d/g67.ply', './ply/ppsection2/part_d/g73.ply', './ply/ppsection2/part_d/g72.ply', './ply/ppsection2/part_d/g66.ply', './ply/ppsection2/part_d/g99.ply', './ply/ppsection2/part_d/g89.ply', './ply/ppsection2/part_d/g62.ply', './ply/ppsection2/part_d/g76.ply', './ply/ppsection2/part_d/g9.ply', './ply/ppsection2/part_d/g8.ply', './ply/ppsection2/part_d/g77.ply', './ply/ppsection2/part_d/g63.ply', './ply/ppsection2/part_d/g88.ply', './ply/ppsection2/part_d/g49.ply', './ply/ppsection2/part_d/g75.ply', './ply/ppsection2/part_d/g61.ply', './ply/ppsection2/part_d/g60.ply', './ply/ppsection2/part_d/g74.ply', './ply/ppsection2/part_d/g48.ply', './ply/ppsection2/part_c/g6.ply', './ply/ppsection2/part_c/g7.ply', './ply/ppsection2/part_c/g5.ply', './ply/ppsection2/part_c/g4.ply', './ply/ppsection2/part_c/g0.ply', './ply/ppsection2/part_c/g1.ply', './ply/ppsection2/part_c/g3.ply', './ply/ppsection2/part_c/g2.ply', './ply/ppsection2/part_c/g9.ply', './ply/ppsection2/part_c/g8.ply', './ply/ppsection2/part_f/g0.ply', './ply/ppsection2/part_f/g1.ply', './ply/ppsection2/part_a/g0.ply', './ply/ppsection2/part_a/g1.ply', './ply/ppsection2/part_g/g0.ply', './ply/ppsection2/part_g/g1.ply']

        const models3 = ['./ply/ppsection3/part_b/g0.ply', './ply/ppsection3/part_b/g1.ply', './ply/ppsection3/part_b/g3.ply', './ply/ppsection3/part_b/g2.ply', './ply/ppsection3/part_a/g6.ply', './ply/ppsection3/part_a/g7.ply', './ply/ppsection3/part_a/g5.ply', './ply/ppsection3/part_a/g4.ply', './ply/ppsection3/part_a/g0.ply', './ply/ppsection3/part_a/g1.ply', './ply/ppsection3/part_a/g3.ply', './ply/ppsection3/part_a/g2.ply', './ply/ppsection3/part_a/g10.ply', './ply/ppsection3/part_a/g11.ply', './ply/ppsection3/part_a/g9.ply', './ply/ppsection3/part_a/g8.ply']

        const models4 = ['./ply/ppsection4/part_b/g0.ply', './ply/ppsection4/part_b/g1.ply', './ply/ppsection4/part_a/g0.ply', './ply/ppsection4/part_a/g1.ply', './ply/ppsection4/part_a/g2.ply']

        const models5 = ['./ply/ppsection5/part_b/g0.ply', './ply/ppsection5/part_b/g1.ply', './ply/ppsection5/part_c/g0.ply', './ply/ppsection5/part_c/g1.ply', './ply/ppsection5/part_a/g6.ply', './ply/ppsection5/part_a/g7.ply', './ply/ppsection5/part_a/g5.ply', './ply/ppsection5/part_a/g4.ply', './ply/ppsection5/part_a/g0.ply', './ply/ppsection5/part_a/g1.ply', './ply/ppsection5/part_a/g3.ply', './ply/ppsection5/part_a/g2.ply', './ply/ppsection5/part_a/g32.ply', './ply/ppsection5/part_a/g26.ply', './ply/ppsection5/part_a/g27.ply', './ply/ppsection5/part_a/g33.ply', './ply/ppsection5/part_a/g25.ply', './ply/ppsection5/part_a/g31.ply', './ply/ppsection5/part_a/g19.ply', './ply/ppsection5/part_a/g18.ply', './ply/ppsection5/part_a/g30.ply', './ply/ppsection5/part_a/g24.ply', './ply/ppsection5/part_a/g20.ply', './ply/ppsection5/part_a/g34.ply', './ply/ppsection5/part_a/g35.ply', './ply/ppsection5/part_a/g21.ply', './ply/ppsection5/part_a/g23.ply', './ply/ppsection5/part_a/g22.ply', './ply/ppsection5/part_a/g13.ply', './ply/ppsection5/part_a/g12.ply', './ply/ppsection5/part_a/g10.ply', './ply/ppsection5/part_a/g11.ply', './ply/ppsection5/part_a/g29.ply', './ply/ppsection5/part_a/g15.ply', './ply/ppsection5/part_a/g14.ply', './ply/ppsection5/part_a/g28.ply', './ply/ppsection5/part_a/g16.ply', './ply/ppsection5/part_a/g17.ply', './ply/ppsection5/part_a/g9.ply', './ply/ppsection5/part_a/g8.ply']

        const models6 = ['./ply/ppsection6/part_b/g6.ply', './ply/ppsection6/part_b/g7.ply', './ply/ppsection6/part_b/g5.ply', './ply/ppsection6/part_b/g4.ply', './ply/ppsection6/part_b/g0.ply', './ply/ppsection6/part_b/g1.ply', './ply/ppsection6/part_b/g3.ply', './ply/ppsection6/part_b/g2.ply', './ply/ppsection6/part_b/g19.ply', './ply/ppsection6/part_b/g18.ply', './ply/ppsection6/part_b/g20.ply', './ply/ppsection6/part_b/g21.ply', './ply/ppsection6/part_b/g22.ply', './ply/ppsection6/part_b/g13.ply', './ply/ppsection6/part_b/g12.ply', './ply/ppsection6/part_b/g10.ply', './ply/ppsection6/part_b/g11.ply', './ply/ppsection6/part_b/g15.ply', './ply/ppsection6/part_b/g14.ply', './ply/ppsection6/part_b/g16.ply', './ply/ppsection6/part_b/g17.ply', './ply/ppsection6/part_b/g9.ply', './ply/ppsection6/part_b/g8.ply', './ply/ppsection6/part_a/g6.ply', './ply/ppsection6/part_a/g7.ply', './ply/ppsection6/part_a/g5.ply', './ply/ppsection6/part_a/g4.ply', './ply/ppsection6/part_a/g0.ply', './ply/ppsection6/part_a/g1.ply', './ply/ppsection6/part_a/g3.ply', './ply/ppsection6/part_a/g2.ply', './ply/ppsection6/part_a/g12.ply', './ply/ppsection6/part_a/g10.ply', './ply/ppsection6/part_a/g11.ply', './ply/ppsection6/part_a/g9.ply', './ply/ppsection6/part_a/g8.ply']

        const models7 = ['./ply/ppsection7/part_b/g0.ply', './ply/ppsection7/part_c/g0.ply', './ply/ppsection7/part_a/g0.ply', './ply/ppsection7/part_a/g1.ply', './ply/ppsection7/part_a/g2.ply']

        const models8 = ['./ply/ppsection8/part_b/g6.ply', './ply/ppsection8/part_b/g7.ply', './ply/ppsection8/part_b/g5.ply', './ply/ppsection8/part_b/g4.ply', './ply/ppsection8/part_b/g0.ply', './ply/ppsection8/part_b/g1.ply', './ply/ppsection8/part_b/g3.ply', './ply/ppsection8/part_b/g2.ply', './ply/ppsection8/part_b/g8.ply', './ply/ppsection8/part_a/g6.ply', './ply/ppsection8/part_a/g5.ply', './ply/ppsection8/part_a/g4.ply', './ply/ppsection8/part_a/g0.ply', './ply/ppsection8/part_a/g1.ply', './ply/ppsection8/part_a/g3.ply', './ply/ppsection8/part_a/g2.ply']

        const models9 = ['./ply/ppsection9/part_a/g6.ply', './ply/ppsection9/part_a/g7.ply', './ply/ppsection9/part_a/g5.ply', './ply/ppsection9/part_a/g4.ply', './ply/ppsection9/part_a/g0.ply', './ply/ppsection9/part_a/g1.ply', './ply/ppsection9/part_a/g3.ply', './ply/ppsection9/part_a/g2.ply', './ply/ppsection9/part_a/g13.ply', './ply/ppsection9/part_a/g12.ply', './ply/ppsection9/part_a/g10.ply', './ply/ppsection9/part_a/g11.ply', './ply/ppsection9/part_a/g15.ply', './ply/ppsection9/part_a/g14.ply', './ply/ppsection9/part_a/g16.ply', './ply/ppsection9/part_a/g17.ply', './ply/ppsection9/part_a/g9.ply', './ply/ppsection9/part_a/g8.ply']

        const models10 = ['./ply/ppsection10/part_b/g0.ply', './ply/ppsection10/part_b/g1.ply', './ply/ppsection10/part_b/g3.ply', './ply/ppsection10/part_b/g2.ply', './ply/ppsection10/part_e/g0.ply', './ply/ppsection10/part_e/g1.ply', './ply/ppsection10/part_d/g5.ply', './ply/ppsection10/part_d/g4.ply', './ply/ppsection10/part_d/g0.ply', './ply/ppsection10/part_d/g1.ply', './ply/ppsection10/part_d/g3.ply', './ply/ppsection10/part_d/g2.ply', './ply/ppsection10/part_c/g6.ply', './ply/ppsection10/part_c/g7.ply', './ply/ppsection10/part_c/g5.ply', './ply/ppsection10/part_c/g4.ply', './ply/ppsection10/part_c/g0.ply', './ply/ppsection10/part_c/g1.ply', './ply/ppsection10/part_c/g3.ply', './ply/ppsection10/part_c/g2.ply', './ply/ppsection10/part_f/g6.ply', './ply/ppsection10/part_f/g5.ply', './ply/ppsection10/part_f/g4.ply', './ply/ppsection10/part_f/g0.ply', './ply/ppsection10/part_f/g1.ply', './ply/ppsection10/part_f/g3.ply', './ply/ppsection10/part_f/g2.ply', './ply/ppsection10/part_a/g0.ply', './ply/ppsection10/part_a/g1.ply', './ply/ppsection10/part_a/g3.ply', './ply/ppsection10/part_a/g2.ply']

        const models11 = ['./ply/ppsection11/part_d/g0.ply', './ply/ppsection11/part_d/g1.ply', './ply/ppsection11/part_d/g2.ply', './ply/ppsection11/part_c/g0.ply', './ply/ppsection11/part_c/g1.ply', './ply/ppsection11/part_a/g0.ply']

        const models12 = ['./ply/ppsection12/part_p/g51.ply', './ply/ppsection12/part_p/g45.ply', './ply/ppsection12/part_p/g6.ply', './ply/ppsection12/part_p/g7.ply', './ply/ppsection12/part_p/g44.ply', './ply/ppsection12/part_p/g50.ply', './ply/ppsection12/part_p/g46.ply', './ply/ppsection12/part_p/g52.ply', './ply/ppsection12/part_p/g5.ply', './ply/ppsection12/part_p/g4.ply', './ply/ppsection12/part_p/g53.ply', './ply/ppsection12/part_p/g47.ply', './ply/ppsection12/part_p/g43.ply', './ply/ppsection12/part_p/g57.ply', './ply/ppsection12/part_p/g0.ply', './ply/ppsection12/part_p/g1.ply', './ply/ppsection12/part_p/g56.ply', './ply/ppsection12/part_p/g42.ply', './ply/ppsection12/part_p/g68.ply', './ply/ppsection12/part_p/g54.ply', './ply/ppsection12/part_p/g40.ply', './ply/ppsection12/part_p/g3.ply', './ply/ppsection12/part_p/g2.ply', './ply/ppsection12/part_p/g41.ply', './ply/ppsection12/part_p/g55.ply', './ply/ppsection12/part_p/g69.ply', './ply/ppsection12/part_p/g32.ply', './ply/ppsection12/part_p/g26.ply', './ply/ppsection12/part_p/g27.ply', './ply/ppsection12/part_p/g33.ply', './ply/ppsection12/part_p/g25.ply', './ply/ppsection12/part_p/g31.ply', './ply/ppsection12/part_p/g19.ply', './ply/ppsection12/part_p/g18.ply', './ply/ppsection12/part_p/g30.ply', './ply/ppsection12/part_p/g24.ply', './ply/ppsection12/part_p/g20.ply', './ply/ppsection12/part_p/g34.ply', './ply/ppsection12/part_p/g35.ply', './ply/ppsection12/part_p/g21.ply', './ply/ppsection12/part_p/g37.ply', './ply/ppsection12/part_p/g23.ply', './ply/ppsection12/part_p/g22.ply', './ply/ppsection12/part_p/g36.ply', './ply/ppsection12/part_p/g13.ply', './ply/ppsection12/part_p/g12.ply', './ply/ppsection12/part_p/g10.ply', './ply/ppsection12/part_p/g38.ply', './ply/ppsection12/part_p/g39.ply', './ply/ppsection12/part_p/g11.ply', './ply/ppsection12/part_p/g29.ply', './ply/ppsection12/part_p/g15.ply', './ply/ppsection12/part_p/g14.ply', './ply/ppsection12/part_p/g28.ply', './ply/ppsection12/part_p/g16.ply', './ply/ppsection12/part_p/g17.ply', './ply/ppsection12/part_p/g70.ply', './ply/ppsection12/part_p/g64.ply', './ply/ppsection12/part_p/g58.ply', './ply/ppsection12/part_p/g59.ply', './ply/ppsection12/part_p/g65.ply', './ply/ppsection12/part_p/g71.ply', './ply/ppsection12/part_p/g67.ply', './ply/ppsection12/part_p/g73.ply', './ply/ppsection12/part_p/g72.ply', './ply/ppsection12/part_p/g66.ply', './ply/ppsection12/part_p/g62.ply', './ply/ppsection12/part_p/g9.ply', './ply/ppsection12/part_p/g8.ply', './ply/ppsection12/part_p/g63.ply', './ply/ppsection12/part_p/g49.ply', './ply/ppsection12/part_p/g75.ply', './ply/ppsection12/part_p/g61.ply', './ply/ppsection12/part_p/g60.ply', './ply/ppsection12/part_p/g74.ply', './ply/ppsection12/part_p/g48.ply', './ply/ppsection12/part_b/g6.ply', './ply/ppsection12/part_b/g7.ply', './ply/ppsection12/part_b/g5.ply', './ply/ppsection12/part_b/g4.ply', './ply/ppsection12/part_b/g0.ply', './ply/ppsection12/part_b/g1.ply', './ply/ppsection12/part_b/g3.ply', './ply/ppsection12/part_b/g2.ply', './ply/ppsection12/part_b/g32.ply', './ply/ppsection12/part_b/g26.ply', './ply/ppsection12/part_b/g27.ply', './ply/ppsection12/part_b/g33.ply', './ply/ppsection12/part_b/g25.ply', './ply/ppsection12/part_b/g31.ply', './ply/ppsection12/part_b/g19.ply', './ply/ppsection12/part_b/g18.ply', './ply/ppsection12/part_b/g30.ply', './ply/ppsection12/part_b/g24.ply', './ply/ppsection12/part_b/g20.ply', './ply/ppsection12/part_b/g34.ply', './ply/ppsection12/part_b/g35.ply', './ply/ppsection12/part_b/g21.ply', './ply/ppsection12/part_b/g37.ply', './ply/ppsection12/part_b/g23.ply', './ply/ppsection12/part_b/g22.ply', './ply/ppsection12/part_b/g36.ply', './ply/ppsection12/part_b/g13.ply', './ply/ppsection12/part_b/g12.ply', './ply/ppsection12/part_b/g10.ply', './ply/ppsection12/part_b/g38.ply', './ply/ppsection12/part_b/g11.ply', './ply/ppsection12/part_b/g29.ply', './ply/ppsection12/part_b/g15.ply', './ply/ppsection12/part_b/g14.ply', './ply/ppsection12/part_b/g28.ply', './ply/ppsection12/part_b/g16.ply', './ply/ppsection12/part_b/g17.ply', './ply/ppsection12/part_b/g9.ply', './ply/ppsection12/part_b/g8.ply', './ply/ppsection12/part_e/g92.ply', './ply/ppsection12/part_e/g86.ply', './ply/ppsection12/part_e/g51.ply', './ply/ppsection12/part_e/g45.ply', './ply/ppsection12/part_e/g79.ply', './ply/ppsection12/part_e/g6.ply', './ply/ppsection12/part_e/g7.ply', './ply/ppsection12/part_e/g78.ply', './ply/ppsection12/part_e/g44.ply', './ply/ppsection12/part_e/g50.ply', './ply/ppsection12/part_e/g87.ply', './ply/ppsection12/part_e/g85.ply', './ply/ppsection12/part_e/g91.ply', './ply/ppsection12/part_e/g46.ply', './ply/ppsection12/part_e/g52.ply', './ply/ppsection12/part_e/g5.ply', './ply/ppsection12/part_e/g4.ply', './ply/ppsection12/part_e/g53.ply', './ply/ppsection12/part_e/g47.ply', './ply/ppsection12/part_e/g90.ply', './ply/ppsection12/part_e/g84.ply', './ply/ppsection12/part_e/g80.ply', './ply/ppsection12/part_e/g43.ply', './ply/ppsection12/part_e/g57.ply', './ply/ppsection12/part_e/g0.ply', './ply/ppsection12/part_e/g1.ply', './ply/ppsection12/part_e/g56.ply', './ply/ppsection12/part_e/g42.ply', './ply/ppsection12/part_e/g81.ply', './ply/ppsection12/part_e/g83.ply', './ply/ppsection12/part_e/g68.ply', './ply/ppsection12/part_e/g54.ply', './ply/ppsection12/part_e/g40.ply', './ply/ppsection12/part_e/g3.ply', './ply/ppsection12/part_e/g2.ply', './ply/ppsection12/part_e/g41.ply', './ply/ppsection12/part_e/g55.ply', './ply/ppsection12/part_e/g69.ply', './ply/ppsection12/part_e/g82.ply', './ply/ppsection12/part_e/g32.ply', './ply/ppsection12/part_e/g26.ply', './ply/ppsection12/part_e/g27.ply', './ply/ppsection12/part_e/g33.ply', './ply/ppsection12/part_e/g25.ply', './ply/ppsection12/part_e/g31.ply', './ply/ppsection12/part_e/g19.ply', './ply/ppsection12/part_e/g18.ply', './ply/ppsection12/part_e/g30.ply', './ply/ppsection12/part_e/g24.ply', './ply/ppsection12/part_e/g20.ply', './ply/ppsection12/part_e/g34.ply', './ply/ppsection12/part_e/g35.ply', './ply/ppsection12/part_e/g21.ply', './ply/ppsection12/part_e/g37.ply', './ply/ppsection12/part_e/g23.ply', './ply/ppsection12/part_e/g22.ply', './ply/ppsection12/part_e/g36.ply', './ply/ppsection12/part_e/g13.ply', './ply/ppsection12/part_e/g12.ply', './ply/ppsection12/part_e/g10.ply', './ply/ppsection12/part_e/g38.ply', './ply/ppsection12/part_e/g39.ply', './ply/ppsection12/part_e/g11.ply', './ply/ppsection12/part_e/g29.ply', './ply/ppsection12/part_e/g15.ply', './ply/ppsection12/part_e/g14.ply', './ply/ppsection12/part_e/g28.ply', './ply/ppsection12/part_e/g16.ply', './ply/ppsection12/part_e/g17.ply', './ply/ppsection12/part_e/g70.ply', './ply/ppsection12/part_e/g64.ply', './ply/ppsection12/part_e/g58.ply', './ply/ppsection12/part_e/g59.ply', './ply/ppsection12/part_e/g65.ply', './ply/ppsection12/part_e/g71.ply', './ply/ppsection12/part_e/g67.ply', './ply/ppsection12/part_e/g73.ply', './ply/ppsection12/part_e/g72.ply', './ply/ppsection12/part_e/g66.ply', './ply/ppsection12/part_e/g89.ply', './ply/ppsection12/part_e/g62.ply', './ply/ppsection12/part_e/g76.ply', './ply/ppsection12/part_e/g9.ply', './ply/ppsection12/part_e/g8.ply', './ply/ppsection12/part_e/g77.ply', './ply/ppsection12/part_e/g63.ply', './ply/ppsection12/part_e/g88.ply', './ply/ppsection12/part_e/g49.ply', './ply/ppsection12/part_e/g75.ply', './ply/ppsection12/part_e/g61.ply', './ply/ppsection12/part_e/g60.ply', './ply/ppsection12/part_e/g74.ply', './ply/ppsection12/part_e/g48.ply', './ply/ppsection12/part_l/g6.ply', './ply/ppsection12/part_l/g7.ply', './ply/ppsection12/part_l/g5.ply', './ply/ppsection12/part_l/g4.ply', './ply/ppsection12/part_l/g0.ply', './ply/ppsection12/part_l/g1.ply', './ply/ppsection12/part_l/g3.ply', './ply/ppsection12/part_l/g2.ply', './ply/ppsection12/part_l/g10.ply', './ply/ppsection12/part_l/g9.ply', './ply/ppsection12/part_l/g8.ply', './ply/ppsection12/part_k/g0.ply', './ply/ppsection12/part_k/g1.ply', './ply/ppsection12/part_q/g6.ply', './ply/ppsection12/part_q/g7.ply', './ply/ppsection12/part_q/g5.ply', './ply/ppsection12/part_q/g4.ply', './ply/ppsection12/part_q/g0.ply', './ply/ppsection12/part_q/g1.ply', './ply/ppsection12/part_q/g3.ply', './ply/ppsection12/part_q/g2.ply', './ply/ppsection12/part_q/g19.ply', './ply/ppsection12/part_q/g18.ply', './ply/ppsection12/part_q/g13.ply', './ply/ppsection12/part_q/g12.ply', './ply/ppsection12/part_q/g10.ply', './ply/ppsection12/part_q/g11.ply', './ply/ppsection12/part_q/g15.ply', './ply/ppsection12/part_q/g14.ply', './ply/ppsection12/part_q/g16.ply', './ply/ppsection12/part_q/g17.ply', './ply/ppsection12/part_q/g9.ply', './ply/ppsection12/part_q/g8.ply', './ply/ppsection12/part_j/g0.ply', './ply/ppsection12/part_m/g6.ply', './ply/ppsection12/part_m/g7.ply', './ply/ppsection12/part_m/g5.ply', './ply/ppsection12/part_m/g4.ply', './ply/ppsection12/part_m/g0.ply', './ply/ppsection12/part_m/g1.ply', './ply/ppsection12/part_m/g3.ply', './ply/ppsection12/part_m/g2.ply', './ply/ppsection12/part_m/g13.ply', './ply/ppsection12/part_m/g12.ply', './ply/ppsection12/part_m/g10.ply', './ply/ppsection12/part_m/g11.ply', './ply/ppsection12/part_m/g15.ply', './ply/ppsection12/part_m/g14.ply', './ply/ppsection12/part_m/g9.ply', './ply/ppsection12/part_m/g8.ply', './ply/ppsection12/part_d/g6.ply', './ply/ppsection12/part_d/g7.ply', './ply/ppsection12/part_d/g5.ply', './ply/ppsection12/part_d/g4.ply', './ply/ppsection12/part_d/g0.ply', './ply/ppsection12/part_d/g1.ply', './ply/ppsection12/part_d/g3.ply', './ply/ppsection12/part_d/g2.ply', './ply/ppsection12/part_d/g26.ply', './ply/ppsection12/part_d/g27.ply', './ply/ppsection12/part_d/g25.ply', './ply/ppsection12/part_d/g19.ply', './ply/ppsection12/part_d/g18.ply', './ply/ppsection12/part_d/g30.ply', './ply/ppsection12/part_d/g24.ply', './ply/ppsection12/part_d/g20.ply', './ply/ppsection12/part_d/g21.ply', './ply/ppsection12/part_d/g23.ply', './ply/ppsection12/part_d/g22.ply', './ply/ppsection12/part_d/g13.ply', './ply/ppsection12/part_d/g12.ply', './ply/ppsection12/part_d/g10.ply', './ply/ppsection12/part_d/g11.ply', './ply/ppsection12/part_d/g29.ply', './ply/ppsection12/part_d/g15.ply', './ply/ppsection12/part_d/g14.ply', './ply/ppsection12/part_d/g28.ply', './ply/ppsection12/part_d/g16.ply', './ply/ppsection12/part_d/g17.ply', './ply/ppsection12/part_d/g9.ply', './ply/ppsection12/part_d/g8.ply', './ply/ppsection12/part_c/g6.ply', './ply/ppsection12/part_c/g7.ply', './ply/ppsection12/part_c/g5.ply', './ply/ppsection12/part_c/g4.ply', './ply/ppsection12/part_c/g0.ply', './ply/ppsection12/part_c/g1.ply', './ply/ppsection12/part_c/g3.ply', './ply/ppsection12/part_c/g2.ply', './ply/ppsection12/part_f/g6.ply', './ply/ppsection12/part_f/g7.ply', './ply/ppsection12/part_f/g5.ply', './ply/ppsection12/part_f/g4.ply', './ply/ppsection12/part_f/g0.ply', './ply/ppsection12/part_f/g1.ply', './ply/ppsection12/part_f/g3.ply', './ply/ppsection12/part_f/g2.ply', './ply/ppsection12/part_f/g12.ply', './ply/ppsection12/part_f/g10.ply', './ply/ppsection12/part_f/g11.ply', './ply/ppsection12/part_f/g9.ply', './ply/ppsection12/part_f/g8.ply', './ply/ppsection12/part_a/g5.ply', './ply/ppsection12/part_a/g4.ply', './ply/ppsection12/part_a/g0.ply', './ply/ppsection12/part_a/g1.ply', './ply/ppsection12/part_a/g3.ply', './ply/ppsection12/part_a/g2.ply', './ply/ppsection12/part_h/g0.ply', './ply/ppsection12/part_h/g1.ply', './ply/ppsection12/part_o/g6.ply', './ply/ppsection12/part_o/g7.ply', './ply/ppsection12/part_o/g5.ply', './ply/ppsection12/part_o/g4.ply', './ply/ppsection12/part_o/g0.ply', './ply/ppsection12/part_o/g1.ply', './ply/ppsection12/part_o/g3.ply', './ply/ppsection12/part_o/g2.ply', './ply/ppsection12/part_o/g19.ply', './ply/ppsection12/part_o/g18.ply', './ply/ppsection12/part_o/g20.ply', './ply/ppsection12/part_o/g21.ply', './ply/ppsection12/part_o/g13.ply', './ply/ppsection12/part_o/g12.ply', './ply/ppsection12/part_o/g10.ply', './ply/ppsection12/part_o/g11.ply', './ply/ppsection12/part_o/g15.ply', './ply/ppsection12/part_o/g14.ply', './ply/ppsection12/part_o/g16.ply', './ply/ppsection12/part_o/g17.ply', './ply/ppsection12/part_o/g9.ply', './ply/ppsection12/part_o/g8.ply', './ply/ppsection12/part_n/g0.ply', './ply/ppsection12/part_n/g1.ply', './ply/ppsection12/part_i/g0.ply', './ply/ppsection12/part_i/g1.ply', './ply/ppsection12/part_i/g2.ply', './ply/ppsection12/part_g/g6.ply', './ply/ppsection12/part_g/g7.ply', './ply/ppsection12/part_g/g5.ply', './ply/ppsection12/part_g/g4.ply', './ply/ppsection12/part_g/g0.ply', './ply/ppsection12/part_g/g1.ply', './ply/ppsection12/part_g/g3.ply', './ply/ppsection12/part_g/g2.ply', './ply/ppsection12/part_g/g25.ply', './ply/ppsection12/part_g/g19.ply', './ply/ppsection12/part_g/g18.ply', './ply/ppsection12/part_g/g24.ply', './ply/ppsection12/part_g/g20.ply', './ply/ppsection12/part_g/g21.ply', './ply/ppsection12/part_g/g23.ply', './ply/ppsection12/part_g/g22.ply', './ply/ppsection12/part_g/g13.ply', './ply/ppsection12/part_g/g12.ply', './ply/ppsection12/part_g/g10.ply', './ply/ppsection12/part_g/g11.ply', './ply/ppsection12/part_g/g15.ply', './ply/ppsection12/part_g/g14.ply', './ply/ppsection12/part_g/g16.ply', './ply/ppsection12/part_g/g17.ply', './ply/ppsection12/part_g/g9.ply', './ply/ppsection12/part_g/g8.ply']

        const models13 = ['./ply/ppsection13/part_b/g86.ply', './ply/ppsection13/part_b/g51.ply', './ply/ppsection13/part_b/g45.ply', './ply/ppsection13/part_b/g79.ply', './ply/ppsection13/part_b/g6.ply', './ply/ppsection13/part_b/g7.ply', './ply/ppsection13/part_b/g78.ply', './ply/ppsection13/part_b/g44.ply', './ply/ppsection13/part_b/g50.ply', './ply/ppsection13/part_b/g87.ply', './ply/ppsection13/part_b/g85.ply', './ply/ppsection13/part_b/g91.ply', './ply/ppsection13/part_b/g46.ply', './ply/ppsection13/part_b/g52.ply', './ply/ppsection13/part_b/g5.ply', './ply/ppsection13/part_b/g4.ply', './ply/ppsection13/part_b/g53.ply', './ply/ppsection13/part_b/g47.ply', './ply/ppsection13/part_b/g90.ply', './ply/ppsection13/part_b/g84.ply', './ply/ppsection13/part_b/g80.ply', './ply/ppsection13/part_b/g43.ply', './ply/ppsection13/part_b/g57.ply', './ply/ppsection13/part_b/g0.ply', './ply/ppsection13/part_b/g1.ply', './ply/ppsection13/part_b/g56.ply', './ply/ppsection13/part_b/g42.ply', './ply/ppsection13/part_b/g81.ply', './ply/ppsection13/part_b/g83.ply', './ply/ppsection13/part_b/g68.ply', './ply/ppsection13/part_b/g54.ply', './ply/ppsection13/part_b/g40.ply', './ply/ppsection13/part_b/g3.ply', './ply/ppsection13/part_b/g2.ply', './ply/ppsection13/part_b/g41.ply', './ply/ppsection13/part_b/g55.ply', './ply/ppsection13/part_b/g69.ply', './ply/ppsection13/part_b/g82.ply', './ply/ppsection13/part_b/g32.ply', './ply/ppsection13/part_b/g26.ply', './ply/ppsection13/part_b/g27.ply', './ply/ppsection13/part_b/g33.ply', './ply/ppsection13/part_b/g25.ply', './ply/ppsection13/part_b/g31.ply', './ply/ppsection13/part_b/g19.ply', './ply/ppsection13/part_b/g18.ply', './ply/ppsection13/part_b/g30.ply', './ply/ppsection13/part_b/g24.ply', './ply/ppsection13/part_b/g20.ply', './ply/ppsection13/part_b/g34.ply', './ply/ppsection13/part_b/g35.ply', './ply/ppsection13/part_b/g21.ply', './ply/ppsection13/part_b/g37.ply', './ply/ppsection13/part_b/g23.ply', './ply/ppsection13/part_b/g22.ply', './ply/ppsection13/part_b/g36.ply', './ply/ppsection13/part_b/g13.ply', './ply/ppsection13/part_b/g12.ply', './ply/ppsection13/part_b/g10.ply', './ply/ppsection13/part_b/g38.ply', './ply/ppsection13/part_b/g39.ply', './ply/ppsection13/part_b/g11.ply', './ply/ppsection13/part_b/g29.ply', './ply/ppsection13/part_b/g15.ply', './ply/ppsection13/part_b/g14.ply', './ply/ppsection13/part_b/g28.ply', './ply/ppsection13/part_b/g16.ply', './ply/ppsection13/part_b/g17.ply', './ply/ppsection13/part_b/g70.ply', './ply/ppsection13/part_b/g64.ply', './ply/ppsection13/part_b/g58.ply', './ply/ppsection13/part_b/g59.ply', './ply/ppsection13/part_b/g65.ply', './ply/ppsection13/part_b/g71.ply', './ply/ppsection13/part_b/g67.ply', './ply/ppsection13/part_b/g73.ply', './ply/ppsection13/part_b/g72.ply', './ply/ppsection13/part_b/g66.ply', './ply/ppsection13/part_b/g89.ply', './ply/ppsection13/part_b/g62.ply', './ply/ppsection13/part_b/g76.ply', './ply/ppsection13/part_b/g9.ply', './ply/ppsection13/part_b/g8.ply', './ply/ppsection13/part_b/g77.ply', './ply/ppsection13/part_b/g63.ply', './ply/ppsection13/part_b/g88.ply', './ply/ppsection13/part_b/g49.ply', './ply/ppsection13/part_b/g75.ply', './ply/ppsection13/part_b/g61.ply', './ply/ppsection13/part_b/g60.ply', './ply/ppsection13/part_b/g74.ply', './ply/ppsection13/part_b/g48.ply', './ply/ppsection13/part_a/g5.ply', './ply/ppsection13/part_a/g4.ply', './ply/ppsection13/part_a/g0.ply', './ply/ppsection13/part_a/g1.ply', './ply/ppsection13/part_a/g3.ply', './ply/ppsection13/part_a/g2.ply']

        const models14 = ['./ply/ppsection14/part_a/g6.ply', './ply/ppsection14/part_a/g7.ply', './ply/ppsection14/part_a/g5.ply', './ply/ppsection14/part_a/g4.ply', './ply/ppsection14/part_a/g0.ply', './ply/ppsection14/part_a/g1.ply', './ply/ppsection14/part_a/g3.ply', './ply/ppsection14/part_a/g2.ply', './ply/ppsection14/part_a/g9.ply', './ply/ppsection14/part_a/g8.ply']

        const models15 = ['./ply/ppsection15/part_b/g6.ply', './ply/ppsection15/part_b/g7.ply', './ply/ppsection15/part_b/g5.ply', './ply/ppsection15/part_b/g4.ply', './ply/ppsection15/part_b/g0.ply', './ply/ppsection15/part_b/g1.ply', './ply/ppsection15/part_b/g40.ply', './ply/ppsection15/part_b/g3.ply', './ply/ppsection15/part_b/g2.ply', './ply/ppsection15/part_b/g41.ply', './ply/ppsection15/part_b/g32.ply', './ply/ppsection15/part_b/g26.ply', './ply/ppsection15/part_b/g27.ply', './ply/ppsection15/part_b/g33.ply', './ply/ppsection15/part_b/g25.ply', './ply/ppsection15/part_b/g31.ply', './ply/ppsection15/part_b/g19.ply', './ply/ppsection15/part_b/g18.ply', './ply/ppsection15/part_b/g30.ply', './ply/ppsection15/part_b/g24.ply', './ply/ppsection15/part_b/g20.ply', './ply/ppsection15/part_b/g34.ply', './ply/ppsection15/part_b/g35.ply', './ply/ppsection15/part_b/g21.ply', './ply/ppsection15/part_b/g37.ply', './ply/ppsection15/part_b/g23.ply', './ply/ppsection15/part_b/g22.ply', './ply/ppsection15/part_b/g36.ply', './ply/ppsection15/part_b/g13.ply', './ply/ppsection15/part_b/g12.ply', './ply/ppsection15/part_b/g10.ply', './ply/ppsection15/part_b/g38.ply', './ply/ppsection15/part_b/g39.ply', './ply/ppsection15/part_b/g11.ply', './ply/ppsection15/part_b/g29.ply', './ply/ppsection15/part_b/g15.ply', './ply/ppsection15/part_b/g14.ply', './ply/ppsection15/part_b/g28.ply', './ply/ppsection15/part_b/g16.ply', './ply/ppsection15/part_b/g17.ply', './ply/ppsection15/part_b/g9.ply', './ply/ppsection15/part_b/g8.ply', './ply/ppsection15/part_d/g0.ply', './ply/ppsection15/part_c/g0.ply', './ply/ppsection15/part_a/g6.ply', './ply/ppsection15/part_a/g7.ply', './ply/ppsection15/part_a/g5.ply', './ply/ppsection15/part_a/g4.ply', './ply/ppsection15/part_a/g0.ply', './ply/ppsection15/part_a/g1.ply', './ply/ppsection15/part_a/g3.ply', './ply/ppsection15/part_a/g2.ply', './ply/ppsection15/part_a/g25.ply', './ply/ppsection15/part_a/g19.ply', './ply/ppsection15/part_a/g18.ply', './ply/ppsection15/part_a/g24.ply', './ply/ppsection15/part_a/g20.ply', './ply/ppsection15/part_a/g21.ply', './ply/ppsection15/part_a/g23.ply', './ply/ppsection15/part_a/g22.ply', './ply/ppsection15/part_a/g13.ply', './ply/ppsection15/part_a/g12.ply', './ply/ppsection15/part_a/g10.ply', './ply/ppsection15/part_a/g11.ply', './ply/ppsection15/part_a/g15.ply', './ply/ppsection15/part_a/g14.ply', './ply/ppsection15/part_a/g16.ply', './ply/ppsection15/part_a/g17.ply', './ply/ppsection15/part_a/g9.ply', './ply/ppsection15/part_a/g8.ply']

        const models16 = ['./ply/ppsection16/part_b/g0.ply', './ply/ppsection16/part_b/g1.ply', './ply/ppsection16/part_b/g3.ply', './ply/ppsection16/part_b/g2.ply', './ply/ppsection16/part_e/g0.ply', './ply/ppsection16/part_d/g0.ply', './ply/ppsection16/part_d/g1.ply', './ply/ppsection16/part_d/g3.ply', './ply/ppsection16/part_d/g2.ply', './ply/ppsection16/part_c/g5.ply', './ply/ppsection16/part_c/g4.ply', './ply/ppsection16/part_c/g0.ply', './ply/ppsection16/part_c/g1.ply', './ply/ppsection16/part_c/g3.ply', './ply/ppsection16/part_c/g2.ply', './ply/ppsection16/part_f/g5.ply', './ply/ppsection16/part_f/g4.ply', './ply/ppsection16/part_f/g0.ply', './ply/ppsection16/part_f/g1.ply', './ply/ppsection16/part_f/g3.ply', './ply/ppsection16/part_f/g2.ply', './ply/ppsection16/part_a/g0.ply', './ply/ppsection16/part_a/g1.ply', './ply/ppsection16/part_g/g0.ply', './ply/ppsection16/part_g/g1.ply', './ply/ppsection16/part_g/g2.ply']

        const models17 = ['./ply/ppsection17/part_b/g4.ply', './ply/ppsection17/part_b/g0.ply', './ply/ppsection17/part_b/g1.ply', './ply/ppsection17/part_b/g3.ply', './ply/ppsection17/part_b/g2.ply', './ply/ppsection17/part_d/g6.ply', './ply/ppsection17/part_d/g5.ply', './ply/ppsection17/part_d/g4.ply', './ply/ppsection17/part_d/g0.ply', './ply/ppsection17/part_d/g1.ply', './ply/ppsection17/part_d/g3.ply', './ply/ppsection17/part_d/g2.ply', './ply/ppsection17/part_c/g6.ply', './ply/ppsection17/part_c/g5.ply', './ply/ppsection17/part_c/g4.ply', './ply/ppsection17/part_c/g0.ply', './ply/ppsection17/part_c/g1.ply', './ply/ppsection17/part_c/g3.ply', './ply/ppsection17/part_c/g2.ply', './ply/ppsection17/part_a/g0.ply', './ply/ppsection17/part_a/g1.ply', './ply/ppsection17/part_a/g3.ply', './ply/ppsection17/part_a/g2.ply']

        const models18 = ['./ply/ppsection18/part_a/g51.ply', './ply/ppsection18/part_a/g45.ply', './ply/ppsection18/part_a/g6.ply', './ply/ppsection18/part_a/g7.ply', './ply/ppsection18/part_a/g44.ply', './ply/ppsection18/part_a/g50.ply', './ply/ppsection18/part_a/g46.ply', './ply/ppsection18/part_a/g52.ply', './ply/ppsection18/part_a/g5.ply', './ply/ppsection18/part_a/g4.ply', './ply/ppsection18/part_a/g53.ply', './ply/ppsection18/part_a/g47.ply', './ply/ppsection18/part_a/g43.ply', './ply/ppsection18/part_a/g57.ply', './ply/ppsection18/part_a/g0.ply', './ply/ppsection18/part_a/g1.ply', './ply/ppsection18/part_a/g56.ply', './ply/ppsection18/part_a/g42.ply', './ply/ppsection18/part_a/g54.ply', './ply/ppsection18/part_a/g40.ply', './ply/ppsection18/part_a/g3.ply', './ply/ppsection18/part_a/g2.ply', './ply/ppsection18/part_a/g41.ply', './ply/ppsection18/part_a/g55.ply', './ply/ppsection18/part_a/g32.ply', './ply/ppsection18/part_a/g26.ply', './ply/ppsection18/part_a/g27.ply', './ply/ppsection18/part_a/g33.ply', './ply/ppsection18/part_a/g25.ply', './ply/ppsection18/part_a/g31.ply', './ply/ppsection18/part_a/g19.ply', './ply/ppsection18/part_a/g18.ply', './ply/ppsection18/part_a/g30.ply', './ply/ppsection18/part_a/g24.ply', './ply/ppsection18/part_a/g20.ply', './ply/ppsection18/part_a/g34.ply', './ply/ppsection18/part_a/g35.ply', './ply/ppsection18/part_a/g21.ply', './ply/ppsection18/part_a/g37.ply', './ply/ppsection18/part_a/g23.ply', './ply/ppsection18/part_a/g22.ply', './ply/ppsection18/part_a/g36.ply', './ply/ppsection18/part_a/g13.ply', './ply/ppsection18/part_a/g12.ply', './ply/ppsection18/part_a/g10.ply', './ply/ppsection18/part_a/g38.ply', './ply/ppsection18/part_a/g39.ply', './ply/ppsection18/part_a/g11.ply', './ply/ppsection18/part_a/g29.ply', './ply/ppsection18/part_a/g15.ply', './ply/ppsection18/part_a/g14.ply', './ply/ppsection18/part_a/g28.ply', './ply/ppsection18/part_a/g16.ply', './ply/ppsection18/part_a/g17.ply', './ply/ppsection18/part_a/g64.ply', './ply/ppsection18/part_a/g58.ply', './ply/ppsection18/part_a/g59.ply', './ply/ppsection18/part_a/g65.ply', './ply/ppsection18/part_a/g67.ply', './ply/ppsection18/part_a/g66.ply', './ply/ppsection18/part_a/g62.ply', './ply/ppsection18/part_a/g9.ply', './ply/ppsection18/part_a/g8.ply', './ply/ppsection18/part_a/g63.ply', './ply/ppsection18/part_a/g49.ply', './ply/ppsection18/part_a/g61.ply', './ply/ppsection18/part_a/g60.ply', './ply/ppsection18/part_a/g48.ply']

        const models19 = ['./ply/ppsection19/part_b/g0.ply', './ply/ppsection19/part_d/g0.ply', './ply/ppsection19/part_c/g0.ply', './ply/ppsection19/part_a/g6.ply', './ply/ppsection19/part_a/g7.ply', './ply/ppsection19/part_a/g5.ply', './ply/ppsection19/part_a/g4.ply', './ply/ppsection19/part_a/g0.ply', './ply/ppsection19/part_a/g1.ply', './ply/ppsection19/part_a/g3.ply', './ply/ppsection19/part_a/g2.ply', './ply/ppsection19/part_a/g10.ply', './ply/ppsection19/part_a/g11.ply', './ply/ppsection19/part_a/g9.ply', './ply/ppsection19/part_a/g8.ply']

        const models20 = ['./ply/ppsection20/part_b/g0.ply', './ply/ppsection20/part_d/g6.ply', './ply/ppsection20/part_d/g5.ply', './ply/ppsection20/part_d/g4.ply', './ply/ppsection20/part_d/g0.ply', './ply/ppsection20/part_d/g1.ply', './ply/ppsection20/part_d/g3.ply', './ply/ppsection20/part_d/g2.ply', './ply/ppsection20/part_c/g5.ply', './ply/ppsection20/part_c/g4.ply', './ply/ppsection20/part_c/g0.ply', './ply/ppsection20/part_c/g1.ply', './ply/ppsection20/part_c/g3.ply', './ply/ppsection20/part_c/g2.ply', './ply/ppsection20/part_a/g0.ply']

        const models21 = ['./ply/ppsection21/part_a/g5.ply', './ply/ppsection21/part_a/g4.ply', './ply/ppsection21/part_a/g0.ply', './ply/ppsection21/part_a/g1.ply', './ply/ppsection21/part_a/g3.ply', './ply/ppsection21/part_a/g2.ply']

        
        



        function loadGeometry(path, color, group, numberOfModels, modelIndex) {
            const loader = new PLYLoader();
            loader.load(
                path,
                function (geometry) {
                    geometry.computeVertexNormals()
                    if (geometry) {
                        var mat = new THREE.MeshPhongMaterial(color);
                        
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

        var numberOfModels = 0;

        

        var models = [models1, models2, models3, models4, models5, models6, models7,
                      models8, models9, models10, models11, models12, models13, models14, models15, models16, models17, models18, models19, models20, models21]
        
        
        for (var x in models) {
            for (var y in models[x]) {
                numberOfModels++;
            } 
        }


        var colors = [0xFF13D1, 0x00FF00, 0xFFA5A5, 0x385067, 0x00FFFF, 0xFF00FF, 0x55626D, 0xFFF4A5 ,0xD6D6D6, 0x0FFF00, 0xC2FF13, 0xFF0000, 0x0000FF, 0x13F1FF, 0xFF8C00, 0x80482C, 0x8C8C8C, 0xFFF000, 0x861D9B, 0x1C055E, 0x000000];
        

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

        console.log(newModelState);
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

    function animate() {
        
        //raycaster.setFromCamera( mouse, camera );
        //intersects = raycaster.intersectObjects( selectable );
        //controls.update();
        stats.update()
        renderer.render(scene.current, camera);
        renderer.setAnimationLoop(animate);
    }


    function togglePieChart() {
        setViewPie(!viewPie);
    }

    function toggleBarChart() {
        setViewBar(!viewBar);
    }

    function toggleGeometry(e) {
        console.log(e.target.id);
        for (var x in scene.current.children) {
            if (e.target.id == scene.current.children[x].userData['grupo']) {
                if (scene.current.children[x].visible) {
                    scene.current.children[x].visible = false;
                } else {
                    scene.current.children[x].visible = true;
                }
                //e.target.checked = scene.current.children[x].visible;
                setViewModel(scene.current.children[x].visible);

            }
        }


    }

    function handleClick() {
        var data = [];
        for (var x in group) {
            data.push(group[x]);
        }
        
        for (var x in data) {
            var chars = 'ABCD';
            var groupChar = 'Grupo ' + chars.charAt(Math.floor(Math.random() * chars.length));


            if (data[x].name === groupChar) {
                data[x].value += 1;
            }
        }
        setGroup(data);
        console.log(scene.current.children);
    }

    function pickChecked(z) {
        var checked = true;
        for (var x in grupo) {
            if (grupo[x].name == z) {
                checked = grupo[x].visible;
                console.log(z);
                console.log(checked);
            }
        }
        return checked;
    }


    useEffect(() => {
        init();
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
            <div id="canvas" className="m-0 p-0" ref={mountRef} onClick={handleClick} style={{width: "100%", height: "100%"}}></div>
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
                                    checked={viewModel[i]}
                                    onClick={(e) => {toggleGeometry(e);}}/>
                    )}
                </Form.Group>
            </div>
        </Container>
        )
}

export default ModelViewer;

/**
 * 
 * FILTRO DE VISUALIZAÇÃO - DIV COM INFO DO GRUPO ESTRUTURA
 * API
 * SELEÇÃO COM COR
 * 
 */