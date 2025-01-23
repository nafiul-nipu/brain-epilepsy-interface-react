import { Col } from "react-bootstrap";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  Hud,
  OrbitControls,
  PerspectiveCamera,
  Stats,
  View,
  Text,
} from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import dataRegisty from "../../data/dataRegistry.json";
import { BrainLesionLoad } from "./BrainLesionLoad";
import { ElectrodeLoad } from "./ElectrodeLoad";
import { Card, Slider, Button, Dropdown, Menu } from "antd";
import * as THREE from "three";
import { CreateLineCurve } from "./CreateLineCurve";
import { NetworkView } from "./NetworkView";
import { DownOutlined, ControlOutlined } from "@ant-design/icons";

// const width = (window.innerWidth / 2) - 10;
// const height = window.innerHeight / 2.3 - 10;
const width = window.innerWidth / 1.71;
const height = window.innerHeight / 2;

const CustomAxesHelper = () => {
  const { camera, scene } = useThree();
  const axesHelperRef = useRef();
  const labelsRef = useRef({ x: null, y: null, z: null });
  const arrowsRef = useRef({ x: null, y: null, z: null });

  const createLabel = (text, position, color) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "50px Arial";
    context.fillStyle = color;
    context.fillText(text, 10, 50);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.scale.set(0.5, 0.25, 1);
    scene.add(sprite);

    return sprite;
  };

  const createArrow = (direction, position, color) => {
    const arrowDir = direction.normalize();
    const arrowLength = 5;
    const arrowColor = new THREE.Color(color);
    const arrowHeadLength = 1.2;
    const arrowHeadWidth = 0.5;
    const arrow = new THREE.ArrowHelper(
      arrowDir,
      position,
      arrowLength,
      arrowColor,
      arrowHeadLength,
      arrowHeadWidth
    );
    scene.add(arrow);
    return arrow;
  };

  useEffect(() => {
    const axesHelper = new THREE.AxesHelper(5);
    axesHelperRef.current = axesHelper;

    let colors = axesHelper.geometry.attributes.color;
    colors.setXYZ(0, 1, 0, 0); // Red
    colors.setXYZ(1, 1, 0, 0); // Red
    colors.setXYZ(2, 0.29, 0.365, 0.137); // Green
    colors.setXYZ(3, 0.29, 0.365, 0.137); // Green
    colors.setXYZ(4, 0, 0.49, 1); // Blue
    colors.setXYZ(5, 0, 0.49, 1); // Blue

    scene.add(axesHelper);

    labelsRef.current.x = createLabel("X", new THREE.Vector3(5.5, 0, 0), "red");
    labelsRef.current.y = createLabel(
      "Y",
      new THREE.Vector3(0, 5.5, 0),
      "green"
    );
    labelsRef.current.z = createLabel(
      "Z",
      new THREE.Vector3(0, 0, 5.5),
      "#007FFF"
    );

    arrowsRef.current.x = createArrow(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      "red"
    );
    arrowsRef.current.y = createArrow(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      "green"
    );
    arrowsRef.current.z = createArrow(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      "#007FFF"
    );

    return () => {
      scene.remove(axesHelper);

      Object.keys(labelsRef.current).forEach((key) => {
        const label = labelsRef.current[key];
        if (label) scene.remove(label);
      });

      Object.keys(arrowsRef.current).forEach((key) => {
        const arrow = arrowsRef.current[key];
        if (arrow) scene.remove(arrow);
      });
    };
  }, [scene]);

  useFrame(() => {
    if (!axesHelperRef.current) return;

    const desiredPosition = new THREE.Vector3(0.9, -0.8, 0.5);
    const position = desiredPosition.unproject(camera);
    axesHelperRef.current.position.copy(position);
    axesHelperRef.current.scale.set(0.1, 0.1, 0.1);

    labelsRef.current.x.position.set(position.x + 0.4, position.y, position.z);
    labelsRef.current.y.position.set(position.x, position.y + 0.4, position.z);
    labelsRef.current.z.position.set(position.x, position.y, position.z + 0.4);

    Object.values(arrowsRef.current).forEach((arrow) => {
      if (arrow) {
        arrow.position.copy(position);
        arrow.scale.set(0.1, 0.1, 0.1);
      }
    });
  });

  return null;
};

export const BrainViewer = ({
  patientInformation,
  electrodeData,
  sample,
  community,
  time,
  events,
  allnetworks,
  eegInBrain,
  sliderObj,
  buttonValue,
  visualPanel,
  topPercent,
  selectedRoi,
  eegList,
  sampleDomain,
  setEegInBrain,
  patchRegionToggle,
  network_per_minute,
  propagatoinButtonValue,
  setPropagationSlider,
}) => {
  // console.log(topPercent)

  // console.log(Object.keys(allnetworks))
  // console.log(Object.keys(community))

  const [leftBrainOpacity, setLeftBrainOpacity] = useState(1);
  const [rightBrainOpacity, setRightBrainOpacity] = useState(1);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const containerRef = useRef();
  const electrodeOrbitControlsRef = useRef(null);
  const brainOrbitControlsRef = useRef(null);
  const orbitControlsRefs = useRef([]);
  const views = [useRef(), useRef(), useRef()];
  // console.log(sampleData)
  // console.log(electrodeData)
  const changeLeftBrainOpacity = (value) => {
    setLeftBrainOpacity(value);
  };

  const changeRightBrainOpacity = (value) => {
    setRightBrainOpacity(value);
  };

  const panelVisible = () => {
    setIsCardVisible(!isCardVisible);
  };
  // reset orbit controls for brain and electrode when visual panel is patches or frequency
  const brainandElectrodeResetOrbitControls = () => {
    if (electrodeOrbitControlsRef.current && brainOrbitControlsRef.current) {
      electrodeOrbitControlsRef.current.reset();
      brainOrbitControlsRef.current.reset();
    }
  };

  // reset orbit controls for all views when visual panel is community, patch-com-net, or region-com-net
  const resetAllOrbitControls = () => {
    orbitControlsRefs.current.forEach((controlsRef) => {
      controlsRef.reset();
    });
  };

  // add orbitcontrol ref to the orbitControlsRefs
  const attachRef = (index, ref) => {
    orbitControlsRefs.current[index] = ref;
  };

  // reset orbit controls for all views
  const reset = () => {
    if (
      visualPanel !== "Community" &&
      visualPanel !== "Patch-Com-Net" &&
      visualPanel !== "Region-Com-Net"
    ) {
      brainandElectrodeResetOrbitControls();
    } else {
      resetAllOrbitControls();
    }

    setEegInBrain(null);
  };

  const Lighting = () => {
    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[-15, 0, -250]}
          intensity={0.8}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={500}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />
        <directionalLight
          castShadow
          position={[-15, 0, 250]}
          intensity={0.8}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={500}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />
      </>
    );
  };
  // console.log(allnetworks)
  // console.log(Object.keys(allnetworks))

  return (
    <>
      <div style={{ position: "relative" }}>
        <Card
          className="brainViewerCard"
          style={
            visualPanel === "Patches" || visualPanel === "Pattern"
              ? {
                  width: width * 0.25,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: "5px",
                  left: "73%",
                  zIndex: 100,
                }
              : visualPanel === "Patch-Com-Net" ||
                visualPanel === "Region-Com-Net" ||
                visualPanel === "Community"
              ? {
                  width: width * 0.25,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: "33px",
                  left: "73%",
                  zIndex: 100,
                }
              : {
                  width: width * 0.3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: "20px",
                  left: "69%",
                  zIndex: 100,
                }
          }
        >
          {visualPanel === "Community" ? (
            <a id="titleBrain1" onClick={panelVisible}>
              <ControlOutlined /> {`${patientInformation.id}: Community`}{" "}
              <DownOutlined />
            </a>
          ) : visualPanel === "Patches" ? (
            <a id="titleBrain1" onClick={panelVisible}>
              <ControlOutlined /> {`${patientInformation.id}: Brain Patches`}{" "}
              <DownOutlined />
            </a>
          ) : visualPanel === "Pattern" ? (
            <a id="titleBrain1" onClick={panelVisible}>
              <ControlOutlined />{" "}
              {`${patientInformation.id}: Activation Pattern`} <DownOutlined />
            </a>
          ) : visualPanel === "Frequency" ? (
            <a id="titleBrain1" onClick={panelVisible}>
              <ControlOutlined /> {`${patientInformation.id}: Spikes Over Time`}{" "}
              <DownOutlined />
            </a>
          ) : visualPanel === "Propagation" ? (
            <a id="titleBrain1" onClick={panelVisible}>
              <ControlOutlined />{" "}
              {`${patientInformation.id}: Propagation Over Time`}{" "}
              <DownOutlined />
            </a>
          ) : visualPanel === "Patch-Com-Net" ? (
            <a id="titleBrain1" onClick={panelVisible}>
              <ControlOutlined /> {`${patientInformation.id}: Patch Network`}{" "}
              <DownOutlined />
            </a>
          ) : (
            <a id="titleBrain1" onClick={panelVisible}>
              <ControlOutlined /> {`${patientInformation.id}: Region Network`}{" "}
              <DownOutlined />
            </a>
          )}
          {isCardVisible && (
            <>
              {/* left brain control */}
              <Card
                className="leftBrainControlCard"
                size="small"
                title="Left Brain"
                style={{ width: "98%", margin: 5 }}
              >
                <p style={{ margin: 0 }}>Opacity:</p>
                <Slider
                  style={{ width: "100%" }}
                  defaultValue={leftBrainOpacity}
                  step={0.1}
                  max={1}
                  onChange={changeLeftBrainOpacity}
                />
              </Card>
              {/* right brain control */}
              <Card
                className="rightBrainControlCard"
                size="small"
                title="Right Brain"
                style={{ width: "98%", margin: 5 }}
              >
                <p style={{ margin: 0 }}>Opacity:</p>
                <Slider
                  style={{ width: "100%" }}
                  defaultValue={rightBrainOpacity}
                  step={0.1}
                  max={1}
                  onChange={changeRightBrainOpacity}
                />
              </Card>
              {/* <Button onClick={handleButtonClick} style={{marginTop: 20, marginBottom: 20}}>Update Projection</Button> */}
              <Button onClick={reset} style={{ marginBottom: 5 }}>
                Reset Brain
              </Button>
            </>
          )}
        </Card>
      </div>
      <Col md="12" style={{ height: height, width: width, padding: 0 }}>
        {visualPanel === "Community" ? (
          <div
            ref={containerRef}
            style={{
              height: height,
              width: width,
              overflow: "hidden",
              backgroundColor: "#33393E",
            }}
          >
            {community.map((item, index) => (
              <div
                key={index}
                ref={views[index]}
                style={{
                  height: height,
                  width: (width - 15) / community.length,
                  display: "inline-block",
                  padding: "2px",
                  margin: "2px",
                  // border: "0.5px solid grey",
                  // backgroundColor: "yellowgreen"
                }}
              ></div>
            ))}
            <Canvas eventSource={containerRef} className="canvas">
              {community.map((item, index) => (
                <View index={index} key={index} track={views[index]}>
                  <CustomAxesHelper />
                  <PerspectiveCamera
                    makeDefault
                    position={[-300, -10, 0]}
                    up={[0, 0, 1]}
                    aspect={width / height}
                    near={1}
                    far={2000}
                    fov={40}
                  />
                  <ambientLight intensity={0.5} />
                  {/* <directionalLight
                                                castShadow
                                                position={[0, 5, 5]}
                                                intensity={1}
                                                shadow-mapSize-width={2048}
                                                shadow-mapSize-height={2048}
                                                shadow-camera-near={0.5}
                                                shadow-camera-far={500}
                                                shadow-camera-left={-5}
                                                shadow-camera-right={5}
                                                shadow-camera-top={5}
                                                shadow-camera-bottom={-5}
                                            /> */}
                  <directionalLight
                    castShadow
                    position={[-15, 0, -250]}
                    intensity={0.8}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.5}
                    shadow-camera-far={500}
                    shadow-camera-left={-5}
                    shadow-camera-right={5}
                    shadow-camera-top={5}
                    shadow-camera-bottom={-5}
                  />
                  <directionalLight
                    castShadow
                    position={[-15, 0, 250]}
                    intensity={0.8}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.5}
                    shadow-camera-far={500}
                    shadow-camera-left={-5}
                    shadow-camera-right={5}
                    shadow-camera-top={5}
                    shadow-camera-bottom={-5}
                  />
                  <BrainLesionLoad
                    patientInformation={patientInformation}
                    lesionArray={dataRegisty[patientInformation.id].lesionArray}
                    brainPartition={
                      dataRegisty[patientInformation.id].brainPartition
                    }
                    leftBrainOpacity={leftBrainOpacity}
                    rightBrainOpacity={rightBrainOpacity}
                  />
                  <ElectrodeLoad
                    electrodeData={electrodeData}
                    sampleData={sample}
                    community={item}
                    bbox={dataRegisty[patientInformation.id].bbox}
                    eegInBrain={eegInBrain}
                    timeRange={time}
                    eventData={events}
                    allnetwork={allnetworks}
                    visualPanel={visualPanel}
                    buttonValue={buttonValue}
                    sliderObj={sliderObj}
                    eegList={eegList}
                    sampleDomain={sampleDomain}
                  />
                  <NetworkView
                    electrodeData={electrodeData}
                    networkData={allnetworks[`sample${index + 1}`]}
                    topPercent={topPercent}
                    bbox={dataRegisty[patientInformation.id].bbox}
                    selectedRoi={selectedRoi}
                    eegInBrain={eegInBrain}
                    propagatoinButtonValue={propagatoinButtonValue}
                    setPropagationSlider={setPropagationSlider}
                    visualPanel={visualPanel}
                    endTime={dataRegisty[patientInformation.id].time}
                  />
                  <OrbitControls
                    ref={(ref) => attachRef(index, ref)}
                    enablePan={true}
                  />
                </View>
              ))}
              {/* <Stats /> */}
            </Canvas>
          </div>
        ) : visualPanel === "Patch-Com-Net" ? (
          <div
            ref={containerRef}
            style={{
              height: height,
              width: width,
              overflow: "hidden",
              backgroundColor: "#33393E",
            }}
          >
            {Object.keys(allnetworks).map((item, index) => (
              <div
                key={index}
                ref={views[index]}
                style={{
                  height: height,
                  width: (width - 15) / community.length,
                  display: "inline-block",
                  padding: "2px",
                  margin: "2px",
                  // border: "0.5px solid grey",
                  // backgroundColor: "yellowgreen"
                }}
              ></div>
            ))}
            <Canvas eventSource={containerRef} className="canvas">
              {Object.keys(allnetworks).map((item, index) => (
                <View index={index} key={index} track={views[index]}>
                  <CustomAxesHelper />
                  <PerspectiveCamera
                    makeDefault
                    position={[-300, -10, 0]}
                    up={[0, 0, 1]}
                    aspect={width / height}
                    near={1}
                    far={2000}
                    fov={40}
                  />
                  <ambientLight intensity={0.5} />
                  {/* <directionalLight
                                                    castShadow
                                                    position={[0, 5, 5]}
                                                    intensity={1}
                                                    shadow-mapSize-width={2048}
                                                    shadow-mapSize-height={2048}
                                                    shadow-camera-near={0.5}
                                                    shadow-camera-far={500}
                                                    shadow-camera-left={-5}
                                                    shadow-camera-right={5}
                                                    shadow-camera-top={5}
                                                    shadow-camera-bottom={-5}
                                                /> */}
                  <directionalLight
                    castShadow
                    position={[-15, 0, -250]}
                    intensity={0.8}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.5}
                    shadow-camera-far={500}
                    shadow-camera-left={-5}
                    shadow-camera-right={5}
                    shadow-camera-top={5}
                    shadow-camera-bottom={-5}
                  />
                  <directionalLight
                    castShadow
                    position={[-15, 0, 250]}
                    intensity={0.8}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.5}
                    shadow-camera-far={500}
                    shadow-camera-left={-5}
                    shadow-camera-right={5}
                    shadow-camera-top={5}
                    shadow-camera-bottom={-5}
                  />
                  <BrainLesionLoad
                    patientInformation={patientInformation}
                    lesionArray={dataRegisty[patientInformation.id].lesionArray}
                    brainPartition={
                      dataRegisty[patientInformation.id].brainPartition
                    }
                    leftBrainOpacity={leftBrainOpacity}
                    rightBrainOpacity={rightBrainOpacity}
                  />
                  <ElectrodeLoad
                    electrodeData={electrodeData}
                    sampleData={sample}
                    community={community}
                    bbox={dataRegisty[patientInformation.id].bbox}
                    eegInBrain={eegInBrain}
                    timeRange={time}
                    eventData={events}
                    allnetwork={allnetworks[item]}
                    visualPanel={visualPanel}
                    buttonValue={buttonValue}
                    sliderObj={sliderObj}
                    eegList={eegList}
                    sampleDomain={sampleDomain}
                  />

                  <NetworkView
                    electrodeData={electrodeData}
                    networkData={allnetworks[item]}
                    topPercent={topPercent}
                    bbox={dataRegisty[patientInformation.id].bbox}
                    selectedRoi={selectedRoi}
                    eegInBrain={eegInBrain}
                    propagatoinButtonValue={propagatoinButtonValue}
                    setPropagationSlider={setPropagationSlider}
                    visualPanel={visualPanel}
                  />
                  <OrbitControls
                    ref={(ref) => attachRef(index, ref)}
                    enablePan={true}
                  />
                </View>
              ))}
              {/* <Stats /> */}
            </Canvas>
          </div>
        ) : visualPanel === "Region-Com-Net" ? (
          <div
            ref={containerRef}
            style={{
              height: height,
              width: width,
              overflow: "hidden",
              backgroundColor: "#33393E",
            }}
          >
            {Object.keys(allnetworks).map((item, index) => (
              <div
                key={index}
                ref={views[index]}
                style={{
                  height: height,
                  width: (width - 15) / community.length,
                  display: "inline-block",
                  padding: "2px",
                  margin: "2px",
                  // border: "0.5px solid grey",
                  // backgroundColor: "yellowgreen"
                }}
              ></div>
            ))}
            <Canvas eventSource={containerRef} className="canvas">
              {Object.keys(allnetworks).map((item, index) => (
                <View index={index} key={index} track={views[index]}>
                  <CustomAxesHelper />
                  <PerspectiveCamera
                    makeDefault
                    position={[-300, -10, 0]}
                    up={[0, 0, 1]}
                    aspect={width / height}
                    near={1}
                    far={2000}
                    fov={40}
                  />
                  <ambientLight intensity={0.5} />
                  {/* <directionalLight
                                                        castShadow
                                                        position={[0, 5, 5]}
                                                        intensity={1}
                                                        shadow-mapSize-width={2048}
                                                        shadow-mapSize-height={2048}
                                                        shadow-camera-near={0.5}
                                                        shadow-camera-far={500}
                                                        shadow-camera-left={-5}
                                                        shadow-camera-right={5}
                                                        shadow-camera-top={5}
                                                        shadow-camera-bottom={-5}
                                                    /> */}
                  <directionalLight
                    castShadow
                    position={[-15, 0, -250]}
                    intensity={0.8}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.5}
                    shadow-camera-far={500}
                    shadow-camera-left={-5}
                    shadow-camera-right={5}
                    shadow-camera-top={5}
                    shadow-camera-bottom={-5}
                  />
                  <directionalLight
                    castShadow
                    position={[-15, 0, 250]}
                    intensity={0.8}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-near={0.5}
                    shadow-camera-far={500}
                    shadow-camera-left={-5}
                    shadow-camera-right={5}
                    shadow-camera-top={5}
                    shadow-camera-bottom={-5}
                  />
                  <BrainLesionLoad
                    patientInformation={patientInformation}
                    lesionArray={dataRegisty[patientInformation.id].lesionArray}
                    brainPartition={
                      dataRegisty[patientInformation.id].brainPartition
                    }
                    leftBrainOpacity={leftBrainOpacity}
                    rightBrainOpacity={rightBrainOpacity}
                  />
                  <ElectrodeLoad
                    electrodeData={electrodeData}
                    sampleData={sample}
                    community={community}
                    bbox={dataRegisty[patientInformation.id].bbox}
                    eegInBrain={eegInBrain}
                    timeRange={time}
                    eventData={events}
                    allnetwork={allnetworks[item]}
                    visualPanel={visualPanel}
                    buttonValue={buttonValue}
                    sliderObj={sliderObj}
                    eegList={eegList}
                    sampleDomain={sampleDomain}
                  />

                  <NetworkView
                    electrodeData={electrodeData}
                    networkData={allnetworks[item]}
                    topPercent={topPercent}
                    bbox={dataRegisty[patientInformation.id].bbox}
                    selectedRoi={selectedRoi}
                    eegInBrain={eegInBrain}
                    propagatoinButtonValue={propagatoinButtonValue}
                    setPropagationSlider={setPropagationSlider}
                    visualPanel={visualPanel}
                  />
                  <OrbitControls
                    ref={(ref) => attachRef(index, ref)}
                    enablePan={true}
                  />
                </View>
              ))}
              {/* <Stats /> */}
            </Canvas>
          </div>
        ) : visualPanel === "Pattern" ? (
          <Canvas style={{ background: "#33393E" }}>
            <Suspense fallback={null}>
              <Hud renderPriority={1}>
                <CustomAxesHelper />
                <PerspectiveCamera
                  makeDefault
                  position={[-300, -10, 0]}
                  up={[0, 0, 1]}
                  aspect={width / height}
                  near={1}
                  far={2000}
                  fov={40}
                />
                <Lighting />
                <BrainLesionLoad
                  patientInformation={patientInformation}
                  lesionArray={dataRegisty[patientInformation.id].lesionArray}
                  brainPartition={
                    dataRegisty[patientInformation.id].brainPartition
                  }
                  leftBrainOpacity={leftBrainOpacity}
                  rightBrainOpacity={rightBrainOpacity}
                />
                <OrbitControls ref={brainOrbitControlsRef} enablePan={true} />
              </Hud>
              {/* <Hud renderPriority={2}>
                <PerspectiveCamera
                  makeDefault
                  position={[-300, -10, 0]}
                  up={[0, 0, 1]}
                  aspect={width / height}
                  near={1}
                  far={2000}
                  fov={40}
                />
                <Lighting />
                <ElectrodeLoad
                  electrodeData={electrodeData}
                  sampleData={sample}
                  community={community}
                  bbox={dataRegisty[patientInformation.id].bbox}
                  eegInBrain={eegInBrain}
                  timeRange={time}
                  eventData={events}
                  allnetwork={allnetworks}
                  visualPanel={visualPanel}
                  buttonValue={buttonValue}
                  sliderObj={sliderObj}
                  eegList={eegList}
                  sampleDomain={sampleDomain}
                  patchRegionToggle={patchRegionToggle}
                />
                <OrbitControls
                  ref={electrodeOrbitControlsRef}
                  enablePan={true}
                />
              </Hud> */}
            </Suspense>
            {/* <Stats /> */}
          </Canvas>
        ) : (
          <Canvas style={{ background: "#33393E" }}>
            <Suspense fallback={null}>
              <Hud renderPriority={1}>
                <CustomAxesHelper />
                <PerspectiveCamera
                  makeDefault
                  position={[-300, -10, 0]}
                  up={[0, 0, 1]}
                  aspect={width / height}
                  near={1}
                  far={2000}
                  fov={40}
                />
                <Lighting />
                <BrainLesionLoad
                  patientInformation={patientInformation}
                  lesionArray={dataRegisty[patientInformation.id].lesionArray}
                  brainPartition={
                    dataRegisty[patientInformation.id].brainPartition
                  }
                  leftBrainOpacity={leftBrainOpacity}
                  rightBrainOpacity={rightBrainOpacity}
                />
                <OrbitControls ref={brainOrbitControlsRef} enablePan={true} />
              </Hud>
              <Hud renderPriority={2}>
                <PerspectiveCamera
                  makeDefault
                  position={[-300, -10, 0]}
                  up={[0, 0, 1]}
                  aspect={width / height}
                  near={1}
                  far={2000}
                  fov={40}
                />
                <Lighting />
                <ElectrodeLoad
                  electrodeData={electrodeData}
                  sampleData={sample}
                  community={community}
                  bbox={dataRegisty[patientInformation.id].bbox}
                  eegInBrain={eegInBrain}
                  timeRange={time}
                  eventData={events}
                  allnetwork={allnetworks}
                  visualPanel={visualPanel}
                  buttonValue={buttonValue}
                  sliderObj={sliderObj}
                  eegList={eegList}
                  sampleDomain={sampleDomain}
                  patchRegionToggle={patchRegionToggle}
                />
                {visualPanel === "Propagation" ? (
                  <NetworkView
                    electrodeData={electrodeData}
                    networkData={allnetworks[patientInformation.sample]}
                    topPercent={topPercent}
                    bbox={dataRegisty[patientInformation.id].bbox}
                    selectedRoi={selectedRoi}
                    eegInBrain={eegInBrain}
                    network_per_minute={network_per_minute}
                    visualPanel={visualPanel}
                    propagatoinButtonValue={propagatoinButtonValue}
                    setPropagationSlider={setPropagationSlider}
                  />
                ) : null}
                <OrbitControls
                  ref={electrodeOrbitControlsRef}
                  enablePan={true}
                />
              </Hud>
            </Suspense>
            {/* <Stats /> */}
          </Canvas>
        )}
      </Col>
    </>
  );
};
