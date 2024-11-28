import React, {  useRef, useState ,useEffect} from "react";
import { Stage, Layer ,Transformer} from "react-konva";

import shapeFactory from "./shapeFactory";

// const availableShapes = {   // more shapes to be added
//   Rectangle:'Rectangle',
//   Circle:'Circle'
// }

const factory = new shapeFactory();

export default function Portrait({bgColour, shapeType}) {

  const stageRef = useRef();
  const dimensions = useRef(null);
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);  
  const transformerRef = useRef(); 
  



  const onPointerDown = () => {
    const stage = stageRef.current;
    if(!shapeType?.current) return;
    const { x, y } = stage.getPointerPosition();
    if (shapeType.current === "Line") {
      dimensions.current = { points: [x, y] };    
    } else {
      dimensions.current = { x1: x, y1: y, x2: x, y2: y };
    }
    console.log(dimensions.current)
  };

  const onPointerMove = () => {
    if (!dimensions?.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    if (shapeType.current === "Line") {
      dimensions.current = {
        points: [...dimensions.current.points, x, y],//to store all points 
      };
    } else {
      dimensions.current = { ...dimensions.current, x2: x, y2: y };
    }

    console.log(dimensions.current)
    setCurrentShape(factory.createShape(shapeType?.current, dimensions.current, bgColour,(e) => handleShapeClick(e.target)));
  };

  const onPointerUp = () => {
    if (currentShape!==null) {
      setShapes([...shapes, currentShape]); // Finalize the RectangleShape
      setCurrentShape(null); // Reset current RectangleShape
      dimensions.current = null;
    }
  };
  const handleShapeClick = (node) => {
    setSelectedShape(node); 
  };
  useEffect(() => {
    if (selectedShape && transformerRef.current) {
      transformerRef.current.nodes([selectedShape]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedShape]);

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
        {/* Render finalized shapes */}
        {shapes.map((shape, i) => (
          shape
        ))}

        {/* Render the shapeangle being drawn */}
        {currentShape!==null && (
          currentShape
        )}
         <Transformer ref={transformerRef} />
      </Layer>
    </Stage>
    </div>
  );
}
