import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Transformer } from "react-konva";
import shapeFactory from "./shapeFactory";
import ShapePrototype from "./shapePrototype";
import Konva from 'konva';

// Create a factory instance
const factory = new shapeFactory();
const prototype = new ShapePrototype();

export default function Portrait({ bgColour, shapeType }) {
  const stageRef = useRef();
  const dimensions = useRef(null);
  const transformerRef = useRef();
  const [copiedShape, setCopiedShape] = useState(null); 
  const [isCut, setIsCut] = useState(false); 
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
 

  const onPointerDown = (e) => {
    const stage = stageRef.current;

    if (e.target === stage && shapeType.current === "_MODE_") {
      setSelectedShape(null);
      return;
    }

    if (!shapeType?.current) return;
    const { x, y } = stage.getPointerPosition();
    if (shapeType.current === "Line") {
      dimensions.current = { points: [x, y] };
    } else {
      dimensions.current = { x1: x, y1: y, x2: x, y2: y };
    }
  };

  const onPointerMove = () => {
    if (!dimensions?.current || !shapeType?.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    if (shapeType.current === "Line") {
      dimensions.current = {
        points: [...dimensions.current.points, x, y], // to store all points
      };
    } else {
      dimensions.current = { ...dimensions.current, x2: x, y2: y };
    }

    setCurrentShape(
      factory.createShape(shapeType?.current, dimensions.current, bgColour, (e) => handleShapeClick(e.target))
    );
  };

  const onPointerUp = () => {
    if (currentShape !== null) {
      setShapes([...shapes, currentShape]); 
      setCurrentShape(null); 
      dimensions.current = null;
    }
  };

  const handleShapeClick = (node) => {
    console.log('Shape clicked:', node);
    setSelectedShape(node); 
  };
  //for copy , cut , past  //////////////////////////////////////
  const handleCopy = () => {
    console.log("copy")
   console.log(selectedShape);
    if (selectedShape) {
      const type = selectedShape.attrs.type || selectedShape.getClassName();
      const shapeProps = selectedShape.attrs; 
      console.log(type)
      setCopiedShape({
        type: type,
        dimension: {
          x1: shapeProps.x,
          y1: shapeProps.y,
          x2: shapeProps.z ,
          y2: shapeProps.w ,
        },
        bgColour: { current: shapeProps.fill },
        handleShapeClick, 
      });
      setSelectedShape(null)
    }
  };
  const handleCut = () => {
    if (selectedShape) {
    handleCopy(selectedShape);
    setShapes((prevShapes) => prevShapes.filter((shape) => shape !== selectedShape));
    }
  };
  const handlePaste = () => {
  if (copiedShape) {

    const stage =stageRef.current;
    const {x,y}=stage.getPointerPosition();
    const newShape =  prototype.cloneShape(copiedShape,x,y, (e) => handleShapeClick(e.target));
   
    setShapes([...shapes,newShape]);
  }
};
  ////////////////////////////////////////////
  useEffect(() => {
    if (selectedShape &&  transformerRef.current && shapeType.current === "_MODE_") {
      transformerRef.current.nodes([selectedShape]); // Apply transformer to selected shape
      transformerRef.current.getLayer().batchDraw();
      selectedShape.draggable(true);
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]); 
      transformerRef.current.getLayer().batchDraw();
      if (selectedShape) selectedShape.draggable(false);
    } else if (shapeType.current !== "_MODE_") {
      selectedShape && selectedShape.draggable(false);
    }
  }, [selectedShape, shapeType]);

 //////////////////////////////////////////////////
 useEffect(() => {
  const handleKeyDown = (e) => {
    
    if (e.ctrlKey) {
      if (e.key === "c") { 
        handleCopy();
      } else if (e.key === "x") { 
        handleCut();
      } else if (e.key === "v") { 
        handlePaste();
      }
    }
  };
  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [selectedShape, shapes, copiedShape, isCut]);

  return (
    <div className="portrait">
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <Layer>
    {shapes.map((shape, i) => {
      // Make sure each shape is a valid Konva element
      return shape
    })}

          {currentShape && React.cloneElement(currentShape, { draggable: false })}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
}
