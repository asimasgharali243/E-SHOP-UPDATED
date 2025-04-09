import React from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import "./FormGroup.css";
import { propTypes } from "react-bootstrap/esm/Image";

const FormGroup = (props) => {
  return (
    <Form.Group className={`formInputBox ${props.classFormGroup}`}>
      
      <Form.Control
        type={props.type}
        id={props.id}
        placeholder={props.placeholder}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        isInvalid={props.formError} // Bootstrap's isInvalid for error styling
        className={`formInput ${props.classInput}`}
        autoFocus={props.autoFocus} 

      /> 
      <i className={`auth-icon ${props.icon}` } onClick={props.showPassword}></i>
<Form.Label htmlFor={props.id} className={`formLabel ${props.classLabel}`}>
        {props.label}
      </Form.Label>



      {props.formError && (
        <Form.Control.Feedback type="invalid">
          {props.formError}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
FormGroup.prototype = {
  classFormGroup: PropTypes.string,
  classInput: PropTypes.string,
  classLabel: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string.isRequired ,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  formError: PropTypes.string,
  icon:PropTypes.string,
  autoFocus:propTypes.bool
}
export { FormGroup };
