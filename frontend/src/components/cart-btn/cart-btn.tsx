import { useAppStateContext } from "../../context/state";
import "./cart-btn.scss";
const CartBtn = () => {
  const { cart } = useAppStateContext();
  return (
    <div className="cart-btn">
      <button className="btn">
        <img src="/images/shopping-cart.svg" />
        Cart
        <div className="badge-container">
          <span className="badge">{cart.length}</span>
        </div>
      </button>
    </div>
  );
};

export default CartBtn;
