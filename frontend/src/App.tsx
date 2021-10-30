import RobotList from "./components/robot-list/RobotList";
import "./app.scss";
import FilterMaterial from "./components/filter-material/filter-material";
import CartBtn from "./components/cart-btn/cart-btn";
import CartList from "./components/cart/CartList";
function App() {
  return (
    <div className="home">
      <h1>Robot Market</h1>
      <div className="top-menu">
        <FilterMaterial />
        <CartBtn />
        <CartList />
      </div>
      <RobotList />
    </div>
  );
}

export default App;
