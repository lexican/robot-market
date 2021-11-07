import { FC } from "react";
import { formatPrice } from "../../common/helper";
import { useAppStateContext } from "../../context/state";
import CartItem from "./cart-item/CartItem";
import "./cart-list.scss";
export type ICart = {
  name: number;
  image: string;
  price: number;
  stock: number;
  createdAt: string;
  material: string;
  quantity: number;
};
const CartList: FC<unknown> = () => {
  const { cart, totalAmount, openCartDropdown } = useAppStateContext();
  return (
    <div className={`cart-list ${openCartDropdown ? "open" : "hide"}`}>
      <div className="cart-list-container">
        <div className="inner-container">
          {cart.map((item) => {
            return <CartItem robot={item} key={item.name} />;
          })}
        </div>
        <div className="total-amount">
          Total amount: {formatPrice(totalAmount)}
        </div>
      </div>
    </div>
  );
};

export default CartList;
