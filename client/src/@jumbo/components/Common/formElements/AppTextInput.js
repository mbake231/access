import React from "react";
import {TextField} from "@material-ui/core";
import PropTypes from "prop-types";

const AppTextInput = ({
  type,
  name,
  id,
  fullWidth,
  size,
  value,
  onChange,
  helperText,
  variant,
  error,
  ...rest
}) => {
  return (
    <TextField
      {...rest}
      type={type}
      name={name}
      id={id || name}
      size={size}
      fullWidth={fullWidth}
      value={value}
      variant={variant}
      onChange={onChange}
      error={error || helperText !== ""}
      helperText={helperText}
    />
  );
};

AppTextInput.prototype = {
  type: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  fullWidth: PropTypes.bool,
  value: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.bool
};

AppTextInput.defaultProps = {
  type: "text",
  fullWidth: true,
  size: "small",
  error: false,
  helperText: ""
};

export default AppTextInput;
