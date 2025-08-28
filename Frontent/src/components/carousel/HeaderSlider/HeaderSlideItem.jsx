import React from 'react'
import PropTypes from 'prop-types'

import { Button, Carousel, Container, Row,Col } from 'react-bootstrap';
export default function HeaderSlideItem({className,style,src,alt,CaptionTitle,CaptionText}) {
  return (
    <
    >
      
 
 <Carousel.Caption    className="" >
                        <h1 className=''>{CaptionTitle}</h1>
                        <p>{CaptionText}</p>
                        <Button variant="warning" style={{color:"white"}}>Shop Now</Button>
                    </Carousel.Caption>
                    
                    
<div className={`img-container ${CaptionTitle?"h-100 w-75":"h-100 w-100"}` }>                                 
   
   <img
                        className={`img-fluid ${className}  h-100 w-100   `}
                        src={src}
                        style={style }
                        alt={alt}
                        
                    />

</div>
 
    </ >
  )
  YourComponent.propTypes = {
    className: PropTypes.string,         // Optional CSS class
   style: PropTypes.object,
    src: PropTypes.string.isRequired,   // Image source URL (required)
    alt: PropTypes.string.isRequired,   // Alt text for accessibility (required)
    CaptionTitle: PropTypes.string,     // Optional title for the carousel caption
    CaptionText: PropTypes.string       // Optional text for the carousel caption
  };
}
