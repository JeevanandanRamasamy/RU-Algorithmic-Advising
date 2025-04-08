import { useState } from "react";

const useNoPlaceholderDropdown = (options, defaultValue = "") => {
  const [selected, setSelected] = useState(defaultValue || options[0]);

  const onChange = (e) => setSelected(e.target.value);

  // Return the selected value and the JSX for the dropdown
  const dropdown = (
    <select value={selected} onChange={onChange} className="cursor-pointer">
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  return { selected, dropdown };
};

export default useNoPlaceholderDropdown;
