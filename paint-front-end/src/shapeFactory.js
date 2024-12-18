import CircleShape from "./circle";
import RectangleShape from "./rectangle";
import LineShape from "./line";
import StraightLineShape from "./straightLine";
import SquareShape from "./square";
import EllipseShape from "./ellipse";
import TriangleShape from "./triangle";

class ShapeFactory {
  createShape(type, dimensions, bgColour,handleShapeClick ,id, handleCreateShape) {
    switch (type) {
      case 'Rectangle':
        return <RectangleShape dimension={dimensions} bgColour={bgColour} handleShapeClick={handleShapeClick} id={id} handleCreateShape={handleCreateShape}/>;
      case 'Circle':
        return <CircleShape dimension={dimensions} bgColour={bgColour}handleShapeClick={handleShapeClick} id={id} handleCreateShape={handleCreateShape}/>;
      case 'Line':
         return <LineShape dimensions={dimensions} bgColour={bgColour}handleShapeClick={handleShapeClick} id={id} handleCreateShape={handleCreateShape}/> ;
      case 'Straight line':
         return <StraightLineShape dimensions={dimensions} bgColour={bgColour}handleShapeClick={handleShapeClick} id={id} handleCreateShape={handleCreateShape}/> ;
      case 'Square':
        return <SquareShape dimension={dimensions} bgColour={bgColour} handleShapeClick={handleShapeClick} id={id}  handleCreateShape={handleCreateShape}/>;
      case 'Ellipse':
        return <EllipseShape dimension={dimensions} bgColour={bgColour} handleShapeClick={handleShapeClick} id={id}  handleCreateShape={handleCreateShape}/>;
      case 'Triangle':
          return <TriangleShape dimension={dimensions} bgColour={bgColour} handleShapeClick={handleShapeClick} id={id}  handleCreateShape={handleCreateShape}/>;
      default:
        return null;
    }
  }
  
}


export default ShapeFactory;
