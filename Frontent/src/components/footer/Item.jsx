import React from 'react';

const Item = ({ Links, title }) => {
  return (
    // list unstyled removes all bullets
    <ul className="list-unstyled mb-4"> 
      <h5 className="mb-2 text-white fw-semibold">{title}</h5>
      {Links.map((link) => (
        <li key={link.name} className="mb-1">
          <a
            className="text-white-50 text-decoration-none small d-block"
            href={link.link}
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Item;
