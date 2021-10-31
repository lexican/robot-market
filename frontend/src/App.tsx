import RobotList from "./components/robot-list/RobotList";
import "./app.scss";
import FilterMaterial from "./components/filter-material/filter-material";
import CartBtn from "./components/cart-btn/cart-btn";
import CartList from "./components/cart/CartList";
import { FC } from "react";
import { useAppStateContext } from "./context/state";
import Loading from "./components/loading/Loading";
const App: FC<unknown> = () => {
  const { isLoading } = useAppStateContext();
  return (
    <div className="home">
      <h1>Robot Market</h1>
      <div className="top-menu">
        <FilterMaterial />
        <CartBtn />
        <CartList />
      </div>
      {isLoading ? <Loading /> : <RobotList />}
    </div>
  );
};

export default App;
