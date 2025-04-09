import React,{useState} from 'react'
import { Dropdown } from 'react-bootstrap'

export default function DropdownMenu() {
 const [selectedCategory, setSelectedCategory] = useState("Categories");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimers = {}; 
 
    const dropdownMenuLG = [
        { name: "Women's Fashion", key: "women" },
        { name: "Men's Fashion", key: "men" },
        { name: "Electronics", key: "electronics" },
        { name: "Home & LifeStyle", key: "home" },
        { name: "Baby's & Toy", key: "baby" },
        { name: "Health & Beauty", key: "beauty" },
      ];
    
    
      const handleSelect = (category) => {
        console.log("Selected Categorfy:", category);
        setSelectedCategory(category); // Update the selected category
        setActiveDropdown(null)
      };
    
      const handleMouseEnter = async (dropdownName) => {
        clearAllDropdownTimers(); // Clear any active timers for all dropdowns
        setActiveDropdown(dropdownName); // Set the active dropdown
      };
    
      const handleMouseLeave = (dropdownName) => {
        if (dropdownTimers[dropdownName]) clearTimeout(dropdownTimers[dropdownName]);
    
        dropdownTimers[dropdownName] = setTimeout(() => {
          if (activeDropdown === dropdownName) {
            setActiveDropdown(null); // Close the dropdown if it's still active
          }
        }, 1000); // Adjust timing here as needed
      };
      const handleClick=(dropdownName)=>{
        setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    
      }
    
      const clearAllDropdownTimers = () => {
        Object.keys(dropdownTimers).forEach((dropdown) => {
          if (dropdownTimers[dropdown]) clearTimeout(dropdownTimers[dropdown]);
        });
      };
    


  return (
    <>
     <Dropdown
                  className="h-100  "
                  onSelect={handleSelect}
                  onMouseEnter={ () =>handleMouseEnter('showMdDropdown')} // Open on hover
                  onMouseLeave={()=>handleMouseLeave('showMdDropdown')} // Close on mouse leave
                  onClick={()=>handleClick('showMdDropdown')}                        
                  show={activeDropdown === 'showMdDropdown'}
                >
               <Dropdown.Toggle
    id="dropdown-category-selector"
  
    className="py-0 py-md-3 d-flex align-items-center justify-content-center gap-3"
    style={{ backgroundColor: "var(--secondary)" }}
    
  ><span className="">Shop By Categories</span>
    {/* Show only list icon */}
    <i className="bi bi-list "style={{ fontSize: "1.2rem" }}></i>
  </Dropdown.Toggle>

                  <Dropdown.Menu>
    {dropdownMenuLG.map((item) => (
      <Dropdown.Item
        key={item.key}
        eventKey={item.name}
    
        className={`${selectedCategory === item.key ? "selected-category" : ""}`}
        onClick={() => handleSelect(item.key)}
      >
        {item.name}
      </Dropdown.Item>
    ))}
    <Dropdown.Divider />
    <Dropdown.Item
      eventKey={"more"}
      className={`${selectedCategory === "more" ? "selected-category" : ""}`}
      onClick={() => handleSelect("more")}
    >
      More Categories
    </Dropdown.Item>
  </Dropdown.Menu>
                </Dropdown>
              
    </>
  )
}
