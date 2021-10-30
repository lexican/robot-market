import { FC, useState } from "react";
import { useAppStateContext } from "../../context/state";

const FilterMaterial:FC<unknown> = () => {
  const [material, setMaterial] = useState("");
  const { filterRobotsByMaterial } = useAppStateContext();
  const handleSearch = () => {
    filterRobotsByMaterial(material);
  };
  return (
    <div className="d-flex">
      <div className="form-group mx-sm-3 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by material type"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary mb-2"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}

export default FilterMaterial;