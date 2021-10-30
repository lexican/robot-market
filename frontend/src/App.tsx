import RobotList from "./components/robot-list/RobotList";
import "./app.scss"
function App() {
  return (
    <div className="home">
      <h1>Robot Market</h1>
      <div className="top-menu">
        <form className="d-flex">
          <div className="form-group mx-sm-3 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by material type"
            />
          </div>
          <button type="submit" className="btn btn-primary mb-2">
            Search
          </button>
        </form>
        
      </div>
      <RobotList />
    </div>
  );
}

export default App;
