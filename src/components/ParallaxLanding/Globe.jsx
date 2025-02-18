import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Button } from "@mui/material";
import { getCountryName } from "../../utils/countryCode";
import { fetchTopCountryCodes } from "../../api";
import VisitorChart from "./VisitorChart";

const Globe = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameId = useRef(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const countriesGroupRef = useRef(new THREE.Group());

  const [topCountryNames, setTopCountryNames] = useState([]);
  const [topCountryVisibility, setTopCountryVisibility] = useState(
    Array(5).fill(false)
  );

  const latLongToVector3 = (lat, long, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (long + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  const drawCountry = (coords, radius, countryName) => {
    const lines = new THREE.Group();
    lines.userData = { name: countryName };

    const normalMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
      depthTest: true,
      transparent: true,
      opacity: 0.8,
    });

    const highlightMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 1,
      depthTest: false,
      transparent: true,
      opacity: 1,
    });

    const drawLine = (coordinates) => {
      const points = [];
      coordinates.forEach(([long, lat]) => {
        points.push(latLongToVector3(lat, long, radius));
      });
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const normalLine = new THREE.Line(geometry, normalMaterial);
      const highlightLine = new THREE.Line(geometry, highlightMaterial);
      highlightLine.visible = false;

      const lineGroup = new THREE.Group();
      lineGroup.userData = { type: "countryLine" };
      lineGroup.add(normalLine);
      lineGroup.add(highlightLine);
      return lineGroup;
    };

    coords.forEach((coordinate) => {
      if (Array.isArray(coordinate[0][0])) {
        coordinate.forEach((ring) => {
          lines.add(drawLine(ring));
        });
      } else {
        lines.add(drawLine(coordinate));
      }
    });

    return lines;
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = sceneRef.current;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 1.5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 2;
    controls.maxDistance = 2;
    controlsRef.current = controls;

    const radius = 1;
    const sphereGeometry = new THREE.SphereGeometry(radius, 64, 64);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a1a1a,
      transparent: true,
      opacity: 0.4,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    fetch(
      "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const countryNames = [];

        data.features.forEach((feature) => {
          const countryName = feature.properties.name;
          countryNames.push(countryName);

          if (feature.geometry.type === "Polygon") {
            const countryLines = drawCountry(
              feature.geometry.coordinates,
              radius,
              countryName
            );
            countriesGroupRef.current.add(countryLines);
          } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon) => {
              const countryLines = drawCountry(polygon, radius, countryName);
              countriesGroupRef.current.add(countryLines);
            });
          }
        });

        scene.add(countriesGroupRef.current);
        setCountries(countryNames.sort());
      })
      .catch((error) => console.error("Error loading country data:", error));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      controls.dispose();
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const handleResize = () => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };

  useEffect(() => {
    const setTopPlayedCountries = async () => {
      const data = await fetchTopCountryCodes(5);
      setTopCountryNames(data.map((x) => getCountryName(x.countryCode)));
    };

    setTopPlayedCountries();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCountryClick = (idx) => {
    const selectedCountryName = topCountryNames[idx];
    setSelectedCountry(selectedCountryName);
    if (!topCountryVisibility[idx]) {
      setTopCountryVisibility((prevState) => ({
        ...prevState,
        [idx]: true,
      }));
    }

    countriesGroupRef.current.traverse((child) => {
      if (child.userData?.name) {
        child.traverse((lineGroup) => {
          if (
            lineGroup.userData?.type === "countryLine" &&
            lineGroup.children
          ) {
            const normalLine = lineGroup.children[0];
            const highlightLine = lineGroup.children[1];

            if (normalLine) normalLine.visible = true;
            if (highlightLine) highlightLine.visible = false;
          }
        });
      }
    });

    let centroid = new THREE.Vector3();
    let totalPoints = 0;

    countriesGroupRef.current.traverse((child) => {
      if (child.userData?.name === selectedCountryName) {
        child.traverse((lineGroup) => {
          if (
            lineGroup.userData?.type === "countryLine" &&
            lineGroup.children
          ) {
            const normalLine = lineGroup.children[0];
            const highlightLine = lineGroup.children[1];

            if (normalLine) normalLine.visible = false;
            if (highlightLine) highlightLine.visible = true;

            if (normalLine && normalLine.geometry) {
              const positions = normalLine.geometry.attributes.position;
              for (let i = 0; i < positions.count; i++) {
                centroid.add(
                  new THREE.Vector3().fromBufferAttribute(positions, i)
                );
                totalPoints++;
              }
            }
          }
        });
      }
    });

    if (totalPoints > 0) {
      centroid.divideScalar(totalPoints);
      centroid.normalize();

      const distance = 2;
      const targetPosition = centroid.multiplyScalar(distance);

      const lookAtMatrix = new THREE.Matrix4();
      lookAtMatrix.lookAt(
        targetPosition,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, 0)
      );
      const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
        lookAtMatrix
      );

      const startPosition = cameraRef.current.position.clone();
      const startQuaternion = cameraRef.current.quaternion.clone();
      const duration = 2500;
      const startTime = Date.now();

      const animateCamera = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeT = t * t * (3 - 2 * t);

        cameraRef.current.position.lerpVectors(
          startPosition,
          targetPosition,
          easeT
        );
        cameraRef.current.quaternion.copy(
          startQuaternion.clone().slerp(targetQuaternion, easeT)
        );

        controlsRef.current.update();

        if (t < 1) {
          requestAnimationFrame(animateCamera);
        }
      };

      animateCamera();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "visible",
      }}
    >
      <div
        ref={mountRef}
        style={{
          top: 0,
          transform: "translateY(-25%)",
          width: "150%",
          height: "150%",
          position: "absolute",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <p>Top 5 most played countries</p>
          {topCountryNames.map((val, idx) => (
            <Button
              key={idx}
              variant="outlined"
              color="gold"
              sx={{ width: "16rem", my: "5px", backgroundColor: "#1a1100" }}
              onClick={() => handleCountryClick(idx)}
            >
              {topCountryVisibility[idx] ? val : `Top #${idx + 1}`}
            </Button>
          ))}
        </div>

        <div style={{ margin: "16px" }}>
          <VisitorChart />
        </div>
      </div>
    </div>
  );
};

export default Globe;
