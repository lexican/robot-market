import { FC } from "react";
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
    quantity: number
  };
const CartList: FC<unknown> = () => {
  const { cart } = useAppStateContext();
  return (
    <div className="cart-list">
      {cart.map((item, index) => {
        return <CartItem robot={item} key={index} />;
      })}
    </div>
  );
};

export default CartList;
