import React, { useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
const ProductCard = ({ image, name, price, discount}) => {

  const [hoveredStarIndex, setHoveredStarIndex] = useState(-1);
const [islike, setIslike] = useState(false);
const [isview, setIsview] = useState(false);
const [rating, setRating] = useState(0);
const [addcart, setAddcart] = useState(false);
const theme = useSelector((state) => state.theme.theme);
const dark_mode = useSelector((state) => state.theme.dark_mode);



const handleMouseEnter = (index) => {
    setHoveredStarIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredStarIndex(-1);
  };
const handleRatingStar=(index)=>{
 
  setRating(index +1)

}
  const handlelike=()=>{

    setIslike(!islike)
  }
  const handleview=()=>{

    setIsview(!isview)
  }


  const handleAddItem = () => {
  
    setAddcart(!addcart);
  
  };

  return (
    <Card   className={ `h-100 ${dark_mode?`${theme} text-light`:`${theme} text-dark`}`}  >
      
      <div className=" p-1 responsive-img  ">
        <Card.Img 
          
          src={image}
          alt={name}
          className="img-fluid card-img-top"
          loading="lazy"
        />
        <Button  className="d-none d-md-flex ">
          Add to Cart
        </Button>
<i className={`bi bi-heart${islike ? "-fill islike" : ""}`}  onClick={handlelike}></i>
        <i className={`bi  d-none d-md-block bi-eye${isview?'-fill isview':''} `} onClick={handleview}></i>
        <i className={`bi bi-cart${addcart ? "-fill addcart" : ""}   d-block d-md-none`} onClick={handleAddItem}></i>
        <span>{discount}</span>
      </div>
      <Card.Body className="">
        <Card.Title className="card-title">{name}</Card.Title>
        <Card.Text className="card-price">${price}</Card.Text>
        <div className="card-rating d-none d-sm-flex  ">
          {[...Array(5)].map((_, index) => (
            <i
              key={index}
              className={`bi bi-star${
                hoveredStarIndex >= index || rating > index ? "-fill" : ""
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleRatingStar(index)}
            ></i>
          ))}
        </div>
        
      </Card.Body>
    </Card>
  );
};

export default ProductCard;