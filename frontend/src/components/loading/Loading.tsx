import { FC } from "react";
import ReactLoading from "react-loading";
import './loading.scss'
const Loading: FC<unknown> = () => {
  return (
    <div className="loading">
      <ReactLoading type="spin" color="#0d6efd" height={50} width={50} />;
    </div>
  );
};

export default Loading;
