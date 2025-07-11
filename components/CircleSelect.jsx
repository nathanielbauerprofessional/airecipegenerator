import React, { useState } from "react";

const CircleSelect = ({ options, onChange, prevSelected }) => {
  const [selected, setSelected] = useState(prevSelected);

  const handleSelect = (option) => {
    setSelected(option.value); // Identify the selected value
    onChange(option.value); // Pass selected value to parent
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 my-6 w-full">
      {options.map((option, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center min-w-[120px] w-28 sm:w-32"
          onClick={() => handleSelect(option)}
        >
          <div
            className={`w-20 h-20 flex justify-center items-center rounded-full border-2 cursor-pointer 
              ${
                selected === option.value
                  ? "bg-blue-500 text-white border-blue-700 scale-110"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-all`}
          >
            {option.icon && React.createElement(option.icon, { size: 32 })}
          </div>
          <span
            className={`text-base font-medium ${
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
