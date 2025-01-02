import React, { useState } from "react";

const CircleSelect = ({ options, onChange, prevSelected }) => {
  const [selected, setSelected] = useState(prevSelected);

  const handleSelect = (option) => {
    setSelected(option.value); // Identify the selected value
    onChange(option.value); // Pass selected value to parent
  };

  return (
    <div className="flex justify-center items-center gap-6 my-6">
      {options.map((option, index) => (
        <div
          key={index}
          className="flex flex-col items-center space-y-2"
          onClick={() => handleSelect(option)}
        >
          <div
            className={`w-14 h-14 flex justify-center items-center rounded-full border-2 cursor-pointer 
              ${
                selected === option.value
                  ? "bg-blue-500 text-white border-blue-700 scale-110"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-all`}
          >
            {option.icon && React.createElement(option.icon, { size: 24 })} {/* Render the React Icon */}
          </div>
          <span
            className={`text-sm font-medium ${
              selected === option.value ? "text-blue-500" : "text-gray-700"
            }`}
          >
            {option.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CircleSelect;
