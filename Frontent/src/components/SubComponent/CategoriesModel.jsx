import React from 'react'

export default function CategoriesModel() {
  return (
    <Modal show={showMobileModal} onHide={() => setShowMobileModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Subcategories</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Row>
      {mobileSubcategories.map((sub) => (
        <Col xs={4} className="text-center mb-3" key={sub.key}>
          <img
            src={sub.image}
            alt={sub.name}
            width="64"
            height="64"
            className="rounded-circle"
            style={{ objectFit: "cover", marginBottom: "8px" }}
          />
          <div
            onClick={() => {
              handleSelect(sub.name);
              setShowMobileModal(false);
            }}
            role="button"
            style={{ fontSize: "0.8rem" }}
          >
            {sub.name}
          </div>
        </Col>
      ))}
    </Row>
  </Modal.Body>
</Modal>

  )
}
