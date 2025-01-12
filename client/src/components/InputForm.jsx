import React from "react";

const InputForm = ({
  details,
  icon: Icon,
  placeholder,
  type,
  id,
  htmlFor,
  value,
  onChange,
  readOnly,
  className,
}) => {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-lg font-medium text-white">
        {details}
      </label>
      <div className="mt-2 flex items-center border-b-2 border-white focus-within:border-pink-500 transition-colors duration-200">
        <Icon className="text-white mr-2" />
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          className={className}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default InputForm;
