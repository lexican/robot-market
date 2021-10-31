import { FC } from "react";
import { formatPrice } from "../../../common/helper";
import { IRobot } from "../../robot-list/RobotList";
import "./cart-item.scss";

interface Props {
  robot: IRobot;
}

const CartItem: FC<Props> = ({ robot }) => {
  const { name, image, price, quantity } = robot;
  return (
    <div className="cart-item">
      <img src={image}></img>
      <div className="info">
        <h3 className="name">{name}</h3>
        <div className="price">{formatPrice(price)}</div>
        <div className="d-flex mt-3">
          <button>-</button>
          <span className="mx-2">{quantity}</span>
          <button>+</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
