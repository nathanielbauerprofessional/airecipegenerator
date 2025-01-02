import React, { useState } from "react";

const OblongSelect = ({ options, onChange, prevSelected }) => {
  const [selected, setSelected] = useState(prevSelected);

  const handleSelect = (option) => {
    setSelected(option);
    onChange(option); // Pass the selected value to parent
  };

  return (
    <div className="flex justify-center items-center gap-4 my-6">
      {options.map((option, index) => (
        <div
          key={index}
          className={`text-center p-2 flex justify-center items-center rounded-full border-2 text-xs font-bold cursor-pointer 
            ${
              selected === option
                ? "bg-blue-500 text-white border-blue-700 scale-110"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-all`}
          onClick={() => handleSelect(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default OblongSelect;
