import { FC } from "react";
import RobotItem from "./robot-item/RobotItem";
import './robot-list.scss'
export type Robot = {
  name: number;
  image: string;
  price: number;
  stock: number;
  createdAt: string;
  material: string;
};
interface Props {
  robotList: Robot[];
}
const RobotList: FC<Props> = ({ robotList }) => {
  return (
    <section className="robots-list">
      <div className="row">
        {robotList.map((item, index) => {
          return <RobotItem robot={item} key={index} />;
        })}
      </div>
    </section>
  );
};

export default RobotList;
