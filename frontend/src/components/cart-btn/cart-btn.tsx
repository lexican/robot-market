import { FC } from "react";
import { useAppStateContext } from "../../context/state";
import "./cart-btn.scss";
const CartBtn: FC<unknown> = () => {
  const { cart, handleDropdown } = useAppStateContext();
  return (
    <div className="cart-btn">
      <button className="btn" onClick={handleDropdown}>
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
