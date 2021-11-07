import { FC } from "react";
import { useAppStateContext } from "../../context/state";
import RobotItem from "./robot-item/RobotItem";
import './robot-list.scss'
export type IRobot = {
  name: number;
  image: string;
  price: number;
  stock: number;
  createdAt: string;
  material: string;
  quantity: number;
  totalPrice: number;
};

const RobotList: FC<unknown> = () => {
  const { filteredRobots  } = useAppStateContext();
  return (
    <section className="robots-list">
      <div className="row">
        {filteredRobots.map((item) => {
          return <RobotItem robot={item} key={item.name} />;
        })}
      </div>
    </section>
  );
};

export default RobotList;
