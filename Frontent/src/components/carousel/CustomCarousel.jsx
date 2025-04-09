// import React, { useState, useEffect ,forwardRef} from "react";
// import { Carousel, Row, Col } from "react-bootstrap";
// import PropTypes from "prop-types";

// const CustomCarousel = forwardRef(({
//   indicators = false,
//   controls = false,
//  preIcon,
//  nextIcon,
//   col,
//   xs,
//   sm,   
//   md,
//   lg,
//   xl,
//   xxl,
//   initialItemsPerSlide={xs, sm, md, lg, xl,xxl} || 1,
//   Fade = false,
//   Slide = true,
//   numberOfRow=1,
//   Interval ,
//   className = "",
//   children,
// },control
// ) => {
//   const [itemsPerSlide, setItemsPerSlide] = useState(initialItemsPerSlide);
//   const [chunkedItems, setChunkedItems] = useState([]);

//   const chunkItems = (items, itemsPerChunk) => {
//     // Ensure each item is its own slide if `itemsPerChunk` is 1
//     if (itemsPerChunk === 1) {
//       return items.map((item) => [item]);
//     }
//     const chunks = [];
//     for (let i = 0; i < items.length; i += itemsPerChunk) {
//       chunks.push(items.slice(i, i + itemsPerChunk));
//     }
//     return chunks;
//   };

//   const flattenChildren = (nodes) => {
//     return React.Children.toArray(nodes).flatMap((node) => {
//       if (React.isValidElement(node) && node.props.children) {
//         return flattenChildren(node.props.children);
//       } else if (React.isValidElement(node) && node.type === "Col") {
//         // If it's a 'Col', treat it as an item to be chunked
//         return node;
//       }
//       return [];
//     });
//   };

//   useEffect(() => {
//     const updateItemsPerSlide = () => {
//       if (initialItemsPerSlide === 1) {
//         setItemsPerSlide(1); // Force single item per slide
//       } 
      
//       else if (window.innerWidth >= 1399.98) {
//         setItemsPerSlide(initialItemsPerSlide.xxl); // Large screens
//       }  
//       else if (window.innerWidth >= 1199.98) {
//         setItemsPerSlide(initialItemsPerSlide.xl); // Large screens
//       }  
//       else if (window.innerWidth >= 991.98) {
//         setItemsPerSlide(initialItemsPerSlide.lg); // Large screens
//       } else if (window.innerWidth >= 767.98) {
//         setItemsPerSlide(initialItemsPerSlide.md); // Medium screens
//       } else if (window.innerWidth >= 576) {
//         setItemsPerSlide(initialItemsPerSlide.sm); // Small screens
//       } else {
//         setItemsPerSlide(initialItemsPerSlide.xs); // Extra small screens
//       }
//     };

//     updateItemsPerSlide();
//     window.addEventListener("resize", updateItemsPerSlide);

//     return () => {
//       window.removeEventListener("resize", updateItemsPerSlide);
//     };
//   }, [initialItemsPerSlide]);

//   useEffect(() => {
//     const subNode = React.Children.toArray(children).flatMap((child) => {
//       if (React.isValidElement(child)) {
//         return React.Children.toArray(child.props.children);
//       } else {
//         return child;
//       }
//     });

//     setChunkedItems(chunkItems(subNode, itemsPerSlide));
//   }, [children, itemsPerSlide]);

//   return (
//     <Carousel
//       as={col}
//       xs={xs}
//       sm={sm}
//       md={md}
//       lg={lg}
//       xl={xl}
//       xxl={xxl}
//       indicators={indicators}
//       controls={controls}
//       className={className}
//       fade={Fade}
//       slide={Slide}
//       interval={Interval}
//     ref={control}
//     >
//       {chunkedItems.map((itemGroup, index) => (
//         <Carousel.Item key={index}>
//           {Array(numberOfRow).map((_, rowIndex) => <Row className="align-items-stretch  justify-content-space-between">
//             {itemGroup.map((item, idx) => (
//               <Col className="px-0" key={idx}>{item}</Col>
//             ))}
//           </Row>)}
//         </Carousel.Item>
//       ))}
//     </Carousel>
//   );
// });

// CustomCarousel.propTypes = {
//   indicators: PropTypes.bool,
//   controls: PropTypes.bool,
//   preIcon: PropTypes.node,
//   nextIcon: PropTypes.node,
//   initialItemsPerSlide: PropTypes.number,
//   className: PropTypes.string,
//   col: PropTypes.object,
//   Fade: PropTypes.bool,
//   Slide: PropTypes.bool,
//   Interval: PropTypes.number,
//   children: PropTypes.node.isRequired, // Expect multiple components as children
//   numberOfRow: PropTypes.number,
// xs: PropTypes.number,
// sm: PropTypes.number,
// md: PropTypes.number,
// lg: PropTypes.number,
// xl: PropTypes.number,
// xxl: PropTypes.number,

// };

// export default CustomCarousel;
import React, { useState, useEffect, useMemo, useCallback, forwardRef } from "react";
import { Carousel, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};
console.log(1)
const CustomCarousel = forwardRef(
  (
    {
      indicators = false,
      controls = false,
      preIcon,
      nextIcon,
      xs = 1,
      sm = 2,
      md = 3,
      lg = 4,
      xl = 5,
      xxl = 6,
      fade = false,
      slide = true,
      numberOfRows = 1,
      interval,
      className = "",
      children,
    },
    ref
  ) => {
    const breakpoints = useMemo(() => ({ xs, sm, md, lg, xl, xxl }), [
      xs, sm, md, lg, xl, xxl
    ]);

    const calculateItemsPerSlide = useCallback(() => {
      const width = window.innerWidth;
      if (width >= 1400) return breakpoints.xxl;
      if (width >= 1200) return breakpoints.xl;
      if (width >= 992) return breakpoints.lg;
      if (width >= 768) return breakpoints.md;
      if (width >= 576) return breakpoints.sm;
      return breakpoints.xs;
    }, [breakpoints]);

    const [itemsPerSlide, setItemsPerSlide] = useState(calculateItemsPerSlide);

    useEffect(() => {
      const handleResize = debounce(() => {
        const newItemsPerSlide = calculateItemsPerSlide();
        setItemsPerSlide(prev => prev !== newItemsPerSlide ? newItemsPerSlide : prev);
      }, 100);

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [calculateItemsPerSlide]);

    const validChildren = useMemo(() => {
      return React.Children.toArray(children).filter(
        (node) => React.isValidElement(node) && node.type === Col
      );
    }, [children]);

    const chunkedItems = useMemo(() => {
      const itemsPerPage = itemsPerSlide * numberOfRows;
      const chunks = [];
      
      // Create unique chunks without overlapping items
      for (let i = 0; i < validChildren.length; i += itemsPerPage) {
        chunks.push(validChildren.slice(i, i + itemsPerPage));
      }
      return chunks;
    }, [validChildren, itemsPerSlide, numberOfRows]);

    return (
      <Carousel
        indicators={indicators}
        controls={controls}
        fade={fade}
        slide={slide}
        interval={interval}
        className={className}
        ref={ref}
      >
        {chunkedItems.map((pageItems, pageIndex) => (
          <Carousel.Item key={`page-${pageIndex}`}>
            {Array.from({ length: numberOfRows }).map((_, rowIndex) => {
              const startIdx = rowIndex * itemsPerSlide;
              const endIdx = startIdx + itemsPerSlide;
              const rowItems = pageItems.slice(startIdx, endIdx);
              
              // Only render row if it has items
              return rowItems.length > 0 ? (
                <Row key={`row-${rowIndex}`} className="align-items-stretch">
                  {rowItems.map((item, itemIndex) => (
                    <Col className="px-0" key={`item-${rowIndex}-${itemIndex}`}>
                      {item}
                    </Col>
                  ))}
                </Row>
              ) : null;
            })}
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }
);

CustomCarousel.propTypes = {
  indicators: PropTypes.bool,
  controls: PropTypes.bool,
  preIcon: PropTypes.node,
  nextIcon: PropTypes.node,
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  xxl: PropTypes.number,
  fade: PropTypes.bool,
  slide: PropTypes.bool,
  numberOfRows: PropTypes.number,
  interval: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default CustomCarousel;