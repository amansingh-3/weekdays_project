import React from "react";

const RoleFilter = ({ value, onChange }) => {
  return (
    <select value={value} onChange={onChange}>
      <option value="">Frontend</option>
      <option value="">Android</option>

      {/* Add options for role filter */}
    </select>
  );
};

export default RoleFilter;
