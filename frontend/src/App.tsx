import RobotList from "./components/robot-list/RobotList";
import "./app.scss";
import { useState } from "react";
import { useAppStateContext } from "./context/state";
function App() {
  const [material, setMaterial] = useState("");
  const { filterRobotsByMaterial } = useAppStateContext();
  const handleSearch = () => {
    filterRobotsByMaterial(material);
  };
  return (
    <div className="home">
      <h1>Robot Market</h1>
      <div className="top-menu">
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
        
      </div>
      <RobotList />
    </div>
  );
}

export default App;
