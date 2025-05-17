import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dropdown, Modal, Row, Col, Accordion } from "react-bootstrap";
import "./CustomDropdownMenu.scss";

const CustomDropdownMenu = ({
  categories,
  theme = "light",
  navigate,
  isMobile,
  setShowOffcanvas,
}) => {
  const [showMain, setShowMain] = useState(false);
  const [openSubIndex, setOpenSubIndex] = useState(null);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const closeTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
    };
  }, []);

  const handleClick = useCallback(
    (e) => {
      const role = e.target.closest("[data-role]")?.dataset?.role;
      const index = e.target.closest("[data-index]")?.dataset?.index;
      const subKey = e.target.closest("[data-subkey]")?.dataset?.subkey;

      if (!role) return;

      if (role === "toggle-main") {
        if (isMobile) {
          setShowMobileModal(true);
        } else {
          setShowMain((prev) => !prev);
          setOpenSubIndex(null);
        }
      }

      if (role === "toggle-sub") {
        setOpenSubIndex((prev) => (prev === index ? null : index));
      }

      if (role === "subcategory" && subKey) {
        navigate(`/catalog/open=${subKey}`);
        setShowMain(false);
        setOpenSubIndex(null);
        setShowMobileModal(false);
        setShowOffcanvas(false);
      }
    },
    [isMobile, navigate, setShowOffcanvas]
  );

  const handleMouseEnter = (index) => {
    if (!isMobile) {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      setShowMain(true);
      setOpenSubIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      closeTimeout.current = setTimeout(() => {
        setShowMain(false);
        setOpenSubIndex(null);
      }, 100);
    }
  };

  return (
    <>
      <nav
        className="custom-dropdown"
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        aria-label="Main Product Categories"
      >
        <Dropdown className="custom-dropdown" show={showMain}>
          <Dropdown.Toggle
            data-role="toggle-main"
            variant="primary"
            className="custom-dropdown-toggle d-flex align-items-center justify-content-center gap-3"
            aria-haspopup="true"
            aria-expanded={showMain}
            aria-controls="main-menu"
            onMouseEnter={() => handleMouseEnter(null)}
          >
            <span>Shop By Categories</span>
            <i className="bi bi-list d-none d-md-flex align-items-center justify-content-center"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu
            id="main-menu"
            className={`main-menu ${showMain ? "show" : ""}`}
            role="menu"
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => {
              if (closeTimeout.current) clearTimeout(closeTimeout.current);
            }}
          >
            {categories.map((category, index) => (
              <div
                key={category.key}
                className={`dropdown-item ${
                  category.subcategories?.length ? "has-submenu" : ""
                }`}
                data-role={
                  category.subcategories?.length ? "toggle-sub" : undefined
                }
                data-index={index}
                aria-haspopup={
                  category.subcategories?.length ? "true" : undefined
                }
                aria-expanded={openSubIndex === index}
                onMouseEnter={() => handleMouseEnter(index)}
              >
                {category.subcategories?.length ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center">
                      <span >{category.name}</span>
                      <i
                        className={`bi bi-caret-${
                          openSubIndex === index ? "right" : "down"
                        }-fill`}
                      ></i>
                    </div>
                    <div
                      className={`submenu ${
                        openSubIndex === index ? "show" : ""
                      }`}
                      role="menu"
                    >
                      {category.subcategories.map((sub) => (
                        <div
                          key={sub.key}
                          data-role="subcategory"
                          data-subkey={sub.key}
                          role="button"
                          className="sub-menu-item"
                          style={{
                            width: "100px",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src={sub.image}
                            alt={sub.name}
                            width="64"
                            height="64"
                            className="rounded-circle"
                            loading="lazy"
                            style={{ objectFit: "cover", marginBottom: "12px" }}
                          />
                          <p
                            className="m-0 text-muted"
                            style={{ fontSize: "clamp(12px, 1.2vw, 13px)" }}
                          >
                            {sub.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <a
                    href={`/category/${category.key}`}
                    className="dropdown-link"
                  >
                    {category.name}
                  </a>
                )}
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {isMobile && (
          <Modal
            data-bs-theme={theme}
            show={showMobileModal}
            onHide={() => setShowMobileModal(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Select Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Accordion alwaysOpen>
                {categories.map((category, idx) => (
                  <Accordion.Item eventKey={String(idx)} key={category.key}>
                    <Accordion.Header>{category.name}</Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        {category.subcategories?.slice(0, 20).map((sub) => (
                          <Col key={sub.key} xs={4} className="text-center mb-3">
                            <div
                              data-role="subcategory"
                              data-subkey={sub.key}
                              role="button"
                              className="mobile-submenu-item"
                              onClick={() => {
                                navigate(`/catalog/open=${sub.key}`);
                                setShowMobileModal(false);
                                setShowOffcanvas(false);
                              }}
                            >
                              <img
                                src={sub.image}
                                alt={sub.name}
                                width="64"
                                height="64"
                                className="rounded-circle"
                                style={{
                                  objectFit: "cover",
                                  marginBottom: "8px",
                                }}
                                loading="lazy"
                              />
                              <p className="m-0" style={{ fontSize: "12px" }}>
                                {sub.name}
                              </p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Modal.Body>
          </Modal>
        )}
      </nav>
    </>
  );
};

export default React.memo(CustomDropdownMenu);


// import React, { useState, useRef, useEffect } from "react";
// import { Dropdown, Row, Col, Modal, Button } from "react-bootstrap";
// import { useSelector } from "react-redux";

// export default function DropdownMenu() {
//   const theme = useSelector((state) => state.theme.theme);

//   const [activeSubDropdown, setActiveSubDropdown] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState("Categories");
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const dropdownTimers = useRef({});
//   const [menuHeight, setMenuHeight] = useState(0);
//   const menuRef = useRef();

//   /* for mobile  */
//   const [isMobile, setIsMobile] = useState(false);
// const [showMobileModal, setShowMobileModal] = useState(false);
// const [mobileSubcategories, setMobileSubcategories] = useState([]);

//   const handleSelect = (category) => {
//     clearAllDropdownTimers();
//     setSelectedCategory(category);
//     setActiveDropdown(null);
//     setActiveSubDropdown(null);
//   };

//   const handleMouseEnter = (dropdownName) => {
//   clearAllDropdownTimers();
//   setActiveDropdown(dropdownName);
//   if (menuRef.current) {
//     setMenuHeight(menuRef.current.scrollHeight);
//   }
// };

// const handleMouseLeave = (dropdownName) => {
// if (dropdownTimers.current[dropdownName])
//   clearTimeout(dropdownTimers.current[dropdownName]);

// dropdownTimers.current[dropdownName] = setTimeout(() => {
//   if (activeDropdown === dropdownName) {
//     setActiveDropdown(null);
//     setMenuHeight(0); // move height reset here
//   }
// }, 1000); // shorter delay (300ms feels natural)
// };

//   const handleClick = (dropdownName) => {
//     setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
//   };

//   const clearAllDropdownTimers = () => {
//   Object.keys(dropdownTimers.current).forEach((dropdown) => {
//     if (dropdownTimers.current[dropdown]) {
//       clearTimeout(dropdownTimers.current[dropdown]);
//     }
//   });
// };

// const dropdownMenuLG = [
//   {
//     name: "Women's Fashion",
//     key: "women",
//     subcategories: Array.from({ length: 30 }, (_, i) => ({
//       name: `Women's Item ${i + 1}`,
//       key: `women_item_${i + 1}`,
//       image: `https://picsum.photos/seed/women${i + 1}/150/150`,
//     })),
//   },
//   {
//     name: "Women's Fashion1",
//     key: "women1",
//     subcategories: Array.from({ length: 30 }, (_, i) => ({
//       name: `Women's Item ${i + 1}`,
//       key: `women_item_${i + 1}`,
//       image: `https://picsum.photos/seed/women${i + 1}/150/150`,
//     })),
//   },
//   {
//     name: "Men's Fashion",
//     key: "men",
//     subcategories: Array.from({ length: 30 }, (_, i) => ({
//       name: `Men's Item ${i + 1}`,
//       key: `men_item_${i + 1}`,
//       image: `https://picsum.photos/seed/men${i + 1}/150/150`,
//     })),
//   },
//   {
//     name: "Electronics",
//     key: "electronics",
//     subcategories: Array.from({ length: 27 }, (_, i) => ({
//       name: `Electronics Item ${i + 1}`,
//       key: `electronics_item_${i + 1}`,
//       image: `https://picsum.photos/seed/electronics${i + 1}/150/150`,
//     })),
//   },
// ];

//   useEffect(() => {
//   if (activeDropdown === "showDropdown" && menuRef.current) {
//     setMenuHeight(menuRef.current.scrollHeight);
//   } else {
//     setMenuHeight(0);
//   }
// }, [activeDropdown]);

//   /*for mobile */
//   useEffect(() => {
//   const handleResize = () => {
//     setIsMobile(window.innerWidth < 768); // md breakpoint
//   };

//   handleResize(); // Initial check
//   window.addEventListener("resize", handleResize);
//   return () => window.removeEventListener("resize", handleResize);
// }, []);

//   return (
// <>

//     <Dropdown
//       className="category-dropdown "
//       // onMouseLeave={() => setActiveSubDropdown(null)}
//       onMouseEnter={() => handleMouseEnter("showDropdown")} // Open on hover
//       onMouseLeave={() => handleMouseLeave("showDropdown")} // Close on mouse leave
//       show={activeDropdown === "showDropdown"}
//     >
//       <Dropdown.Toggle
//   id="dropdown-category-selector"
//   className="main-dropdown-toggle  py-0 py-md-3 d-flex align-items-center justify-content-center gap-3"
//   onClick={() => {
//     if (isMobile) {
//       setShowMobileModal(true);
//     }
//   }}
// >
// <span className="">Shop By Categories</span>
// <i className="bi bi-list " style={{ fontSize: "1.2rem" }}></i>
// </Dropdown.Toggle>

//       {!isMobile && <Dropdown.Menu
//         ref={menuRef}
//         className={`main-dropdown-menu${activeDropdown === "showDropdown" ? " show" : ""}`}

//         style={{
//             maxHeight: `${menuHeight + 20}px`,
//           transition: "max-height 1s ease",
//         }}
//         onMouseEnter={() => handleMouseEnter("showDropdown")} // cancel timer
//   onMouseLeave={() => handleMouseLeave("showDropdown")} // restart hide timer
//       >
//         {dropdownMenuLG.map((category) => (
//           <Dropdown

//             key={category.key}
//             drop="end"
//             show={activeSubDropdown === category.key}
//             onMouseEnter={() => {setActiveSubDropdown(category.key);}}
//             as="div"
//             className="w-100 sub-dropdown "

//           >
//             <Dropdown.Toggle
//               as="button"
//               className={`sub-dropdown-toggle w-100 text-start py-2 px-3 border-0 bg-white ${activeSubDropdown === "show" ? "" : ""} ` }
//             >
//               <span>{category.name}</span>
//               <i
//                 class={`bi bi-caret-${
//                   activeSubDropdown === category.key ? "right" : "down"
//                 }-fill `}
//               ></i>
//             </Dropdown.Toggle>

//             <Dropdown.Menu
//               align="end"
//               className={`${
//                 activeSubDropdown === category.key ? "show" : ""
//               }py-2 px-3 sub-dropdown-menu`}
//             >
//               <div
//                 className="sub-dropdown-item-container "
//                 // style={{
//                 //   display: "flex",
//                 //   flexWrap: "wrap",
//                 //   gap: "10px",
//                 //   justifyContent: "space-between",
//                 //   minWidth: `clamp(200px, 60vw, 1000px)`,
//                 //   maxWidth: "800px", // optional max width for visual balance

//                 // }}
//               >
//                 {category.subcategories.map((sub) => (
//                 <div
//                   key={sub.key}
//                   onClick={() => handleSelect(sub.name)}
//                   role="button"
//                   className="sub-dropdown-item "
//                   onSelect={() => handleSelect(sub.name)}
//                   style={{
//                     width: "100px",
//                     textAlign: "center",
//                   }}
//                 >
//                   <img
//                     src={sub.image}
//                     alt={sub.name}
//                     width="64"
//                     height="64"
//                     onError={(e) => {
//   e.currentTarget.onerror = null;
//   e.currentTarget.src = "/placeholder.jpg";
// }}
//                     className="rounded-circle "
//                     style={{ objectFit: "cover", marginBottom: "12px" }}
//                     loading="lazy"
//                   />
//                   <p
//                     className=" m-0"
//                     style={{ fontSize: `clamp(12px, 1.2vw, 13px)` }}
//                   >
//                     {sub.name}
//                   </p>
//                 </div>
//                 ))}
//               </div>
//             </Dropdown.Menu>
//           </Dropdown>
//         ))}
//       </Dropdown.Menu>}
//     </Dropdown>

//     {/* for mobile */}
// {isMobile &&<Modal data-bs-theme={theme} show={showMobileModal} onHide={() => setShowMobileModal(false)} centered size="lg">
//   <Modal.Header closeButton>
//     <Modal.Title>Select Category</Modal.Title>
//   </Modal.Header>
//   <Modal.Body>
//     {dropdownMenuLG.map((category) => (
//       <div key={category.key} className="mb-4">
//         <h6 className="fw-bold">{category.name}</h6>
//         <Row>
//           {category.subcategories.slice(0, 20).map((sub) => (
//             <Col key={sub.key} xs={4} className="text-center mb-3">
//               <div
//                 role="button"
//                 onClick={() => {
//                   handleSelect(sub.name);
//                   setShowMobileModal(false);
//                 }}
//               >
//                 <img
//                   src={sub.image}
//                   alt={sub.name}
//                   width="64"
//                   height="64"
//                   className="rounded-circle"
//                   style={{ objectFit: "cover", marginBottom: "8px" }}
//                 />
//                 <p className="m-0" style={{ fontSize: "12px" }}>{sub.name}</p>
//               </div>
//             </Col>
//           ))}
//         </Row>
//       </div>
//     ))}
//   </Modal.Body>
// </Modal>}
//     </>
//   );
// }

// import React, { useState } from "react";
// import { Dropdown } from "react-bootstrap";

// export default function DropdownMenu() {
//   const [selectedCategory, setSelectedCategory] = useState("Categories");
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const dropdownTimers = {};
//   const dropdownMenuLG = [
//     {
//       name: "Women's Fashion",
//       key: "women",
//       subcategories: [
//         { name: "Dresses", key: "dresses", image: "/images/dresses.jpg" },
//         { name: "Tops", key: "tops", image: "/images/tops.jpg" },
//         { name: "Bottoms", key: "bottoms", image: "/images/bottoms.jpg" },
//         { name: "Shoes", key: "shoes", image: "/images/women-shoes.jpg" },
//         {
//           name: "Accessories",
//           key: "accessories",
//           image: "/images/accessories.jpg",
//         },
//       ],
//     },
//     {
//       name: "Men's Fashion",
//       key: "men",
//       subcategories: [
//         { name: "Shirts", key: "shirts", image: "/images/shirts.jpg" },
//         { name: "Trousers", key: "trousers", image: "/images/trousers.jpg" },
//         { name: "Shoes", key: "shoes", image: "/images/men-shoes.jpg" },
//         { name: "Watches", key: "watches", image: "/images/watches.jpg" },
//       ],
//     },
//     {
//       name: "Electronics",
//       key: "electronics",
//       subcategories: [
//         { name: "Mobiles", key: "mobiles", image: "/images/mobiles.jpg" },
//         { name: "Laptops", key: "laptops", image: "/images/laptops.jpg" },
//         { name: "Cameras", key: "cameras", image: "/images/cameras.jpg" },
//         {
//           name: "Accessories",
//           key: "accessories",
//           image: "/images/electronics-accessories.jpg",
//         },
//       ],
//     },
//     // Add remaining categories similarly...
//   ];

//   const handleSelect = (category) => {
//     console.log("Selected Categorfy:", category);
//     setSelectedCategory(category); // Update the selected category
//     setActiveDropdown(null);
//   };

//   const handleMouseEnter = async (dropdownName) => {
//     clearAllDropdownTimers();
//     setActiveDropdown(dropdownName);
//   };

//   const handleMouseLeave = (dropdownName) => {
//     if (dropdownTimers[dropdownName])
//       clearTimeout(dropdownTimers[dropdownName]);

//     dropdownTimers[dropdownName] = setTimeout(() => {
//       if (activeDropdown === dropdownName) {
//         setActiveDropdown(null); // Close the dropdown if it's still active
//       }
//     }, 1000); // Adjust timing here as needed
//   };
//   const handleClick = (dropdownName) => {
//     setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
//   };

//   const clearAllDropdownTimers = () => {
//     Object.keys(dropdownTimers).forEach((dropdown) => {
//       if (dropdownTimers[dropdown]) clearTimeout(dropdownTimers[dropdown]);
//     });
//   };

//   return (
//     <>
//       <Dropdown
//         className="h-100 main-dropdown"
//         onSelect={handleSelect}
//         onMouseEnter={() => handleMouseEnter("showMdDropdown")} // Open on hover
//         onMouseLeave={() => handleMouseLeave("showMdDropdown")} // Close on mouse leave
//         onClick={() => handleClick("showMdDropdown")}
//         show={activeDropdown === "showMdDropdown"}
//       >
//         <Dropdown.Toggle
//           id="dropdown-category-selector"
//           className="main-dropdown-toggle  py-0 py-md-3 d-flex align-items-center justify-content-center gap-3"
//         >
//           <span className="">Shop By Categories</span>
//           {/* Show only list icon */}
//           <i className="bi bi-list " style={{ fontSize: "1.2rem" }}></i>
//         </Dropdown.Toggle>

//         <Dropdown.Menu>
//           {dropdownMenuLG.map((item) => (
//             <Dropdown.Item
//               as={Dropdown}
//               key={item.key}
//               eventKey={item.name}
//               className={`${
//                 selectedCategory === item.key ? "selected-category" : ""
//               }`}
//               onClick={() => handleSelect(item.key)}
//             >
//               <Dropdown.Toggle>
//                 <span className="">{item.name}</span>
//                 {/* Show only list icon */}
//                 <i className="bi  bi-caret-right-fill " style={{ fontSize: "1.2rem" }}></i>
//               </Dropdown.Toggle>
//             </Dropdown.Item>
//           ))}
//           <Dropdown.Divider />
//           <Dropdown.Item
//             eventKey={"more"}
//             className={`${
//               selectedCategory === "more" ? "selected-category" : ""
//             }`}
//             onClick={() => handleSelect("more")}
//           >
//             More Categories
//           </Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//     </>
//   );
// }
