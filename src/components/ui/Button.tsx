
import React from "react";

const Button = ({ children, ...props }) => {
  return (
    <button className="bg-primary text-white px-4 py-2 rounded-xl hover:opacity-90" {...props}>
      {children}
    </button>
  );
};

export default Button;
