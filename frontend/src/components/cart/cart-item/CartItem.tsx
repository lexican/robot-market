import { FC } from "react";
import { formatPrice } from "../../../common/helper";
import { useAppStateContext } from "../../../context/state";
import { IRobot } from "../../robot-list/RobotList";
import "./cart-item.scss";

interface Props {
  robot: IRobot;
}

const CartItem: FC<Props> = ({ robot }) => {
  const { name, image, price, quantity, totalPrice } = robot;
  const { incrementQuantity, decrementQuantity } = useAppStateContext();
  return (
    <div className="cart-item">
      <img src={image}></img>
      <div className="info">
        <h3 className="name">{name}</h3>
        <div className="price">{formatPrice(price)}</div>
        <div className="d-flex mt-3">
          <button
            onClick={() => {
              decrementQuantity(robot);
            }}
          >
            -
          </button>
          <span className="m-2">{quantity}</span>
          <button
            onClick={() => {
              incrementQuantity(robot);
            }}
          >
            +
          </button>
        </div>
        <div className="total-price">{formatPrice(totalPrice)}</div>
      </div>
    </div>
  );
};

export default CartItem;
