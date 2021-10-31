import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { IRobot } from "../components/robot-list/RobotList";
import axios from "axios";

export interface IStateContext {
  robots: IRobot[];
  filteredRobots: IRobot[];
  cart: IRobot[];
  totalAmount: number;
  openCartDropdown: boolean;
  isLoading: boolean;
  addToCart: (cart: IRobot) => void;
  filterRobotsByMaterial: (material: string) => void;
  incrementQuantity: (robot: IRobot) => void;
  decrementQuantity: (robot: IRobot) => void;
  handleDropdown: () => void;
}

const AppStateContext = createContext<IStateContext>(undefined as never);

export const AppStateProvider: FC<unknown> = ({ children }) => {
  const localCart: IRobot[] | [] = JSON.parse(
    localStorage.getItem("ecom_robot:cart") || "[]"
  );
  const [robots, setRobots] = useState<IRobot[]>([]);
  const [filteredRobots, setFilteredRobots] = useState<IRobot[]>([]);
  const [cart, setCart] = useState<IRobot[]>(localCart);
  const [openCartDropdown, setOpenCartDropdown] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDropdown = useCallback(() => {
    setOpenCartDropdown(!openCartDropdown);
  }, [openCartDropdown]);

  useEffect(() => {
    loadRobots();
  }, []);

  //Fetch all the robots from the backend
  const loadRobots = () => {
    setIsLoading(true);
    axios
      .get("/api/robots")
      .then((response) => {
        const robots = [...response.data.data];
        setRobots(robots);
        setFilteredRobots(robots);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
        setIsLoading(false);
      });
  };

  const addTotal = useCallback((cart: IRobot[]) => {
    let total = 0;
    cart.map((item) => (total += Number(item.totalPrice)));
    setTotalAmount(() => {
      return total;
    });
  }, []);

  const incrementStock = useCallback(
    (robot: IRobot) => {
      const tempRobots = [...robots];
      const selectedRobot = tempRobots.find(
        (item: IRobot) => item.name === robot.name
      );
      if (selectedRobot) {
        const index = tempRobots.indexOf(selectedRobot);
        const robotItem = tempRobots[index];
        robotItem.stock = robotItem.stock + 1;
        setRobots(() => {
          addTotal(tempRobots);
          return [...tempRobots];
        });
      }
    },
    [addTotal, robots]
  );

  const decrementStock = useCallback(
    (robot: IRobot) => {
      const tempRobots = [...robots];
      const selectedRobot = tempRobots.find(
        (item: IRobot) => item.name === robot.name
      );
      if (selectedRobot) {
        const index = tempRobots.indexOf(selectedRobot);
        const robotItem = tempRobots[index];
        robotItem.stock = robotItem.stock - 1;
        setRobots(() => {
          addTotal(tempRobots);
          return [...tempRobots];
        });
      }
    },
    [addTotal, robots]
  );

  const incrementQuantity = useCallback(
    (robot: IRobot) => {
      const tempRobots = [...robots];
      const selectedRobot = tempRobots.find(
        (item: IRobot) => item.name === robot.name
      );
      if (selectedRobot) {
        const index = tempRobots.indexOf(selectedRobot);
        const robotItem = tempRobots[index];

        if (robotItem.stock > 0) {
          robotItem.stock = robotItem.stock - 1;
          robotItem.totalPrice = robotItem.price * robotItem.quantity;
          setRobots(() => {
            return [...tempRobots];
          });

          const tempCart = [...cart];
          const selectedRobot = tempCart.find(
            (item: IRobot) => item.name === robot.name
          );
          if (selectedRobot) {
            const index = tempCart.indexOf(selectedRobot);
            const robotItem = tempCart[index];
            robotItem.quantity = robotItem.quantity + 1;
            robotItem.totalPrice = robotItem.price * robotItem.quantity;
            setCart(() => {
              const newCart = [...tempCart];
              addTotal(newCart);
              return newCart;
            });
          }
        }
      }
    },
    [addTotal, cart, robots]
  );

  const removeCartItem = useCallback(
    (robot: IRobot) => {
      let tempCart = [...cart];
      tempCart = tempCart.filter((item: IRobot) => item.name !== robot.name);
      setCart(() => {
        const newCart = [...tempCart];
        addTotal(newCart);
        return newCart;
      });
    },
    [addTotal, cart]
  );

  const decrementQuantity = useCallback(
    (robot: IRobot) => {
      const tempCart = [...cart];
      const selectedRobot = tempCart.find(
        (item: IRobot) => item.name === robot.name
      );

      if (selectedRobot) {
        const index = tempCart.indexOf(selectedRobot);
        const robotItem = tempCart[index];

        if (robotItem.quantity > 1) {
          incrementStock(robot);
          robotItem.quantity = robotItem.quantity - 1;
          robotItem.totalPrice = robot.price * robot.quantity;
          setCart(() => {
            const newCart = [...tempCart];
            addTotal(newCart);
            return newCart;
          });
        } else {
          incrementStock(robot);
          removeCartItem(robot);
        }
      }
    },
    [addTotal, cart, incrementStock, removeCartItem]
  );

  const addToCart = useCallback(
    (robot: IRobot) => {
      const tempCart = [...cart];
      const selectedRobot = tempCart.find(
        (item: IRobot) => item.name === robot.name
      );

      if (selectedRobot) {
        decrementStock(robot);
        const index = tempCart.indexOf(selectedRobot);
        const robotItem = tempCart[index];
        robotItem.quantity = robotItem.quantity + 1;
        robotItem.totalPrice = robot.price * robotItem.quantity;
        tempCart[index] = robotItem;
        setCart(() => {
          const newCart = [...tempCart];
          addTotal(newCart);
          return newCart;
        });
      } else {
        decrementStock(robot);
        robot.quantity = 1;
        robot.totalPrice = robot.price;
        setCart((prev) => {
          const newCart = [robot, ...prev];
          addTotal(newCart);
          return newCart;
        });
      }
    },
    [addTotal, cart, decrementStock]
  );

  const filterRobotsByMaterial = useCallback(
    (material: string) => {
      const filteredRobots = robots.filter((robot: IRobot) => {
        return robot.material
          .toLowerCase()
          .includes(material.toLocaleLowerCase());
      });
      setFilteredRobots([...filteredRobots]);
    },
    [robots]
  );

  const value = useMemo(
    () => ({
      robots,
      filteredRobots: filteredRobots,
      totalAmount,
      incrementQuantity,
      decrementQuantity,
      filterRobotsByMaterial,
      setRobots,
      setFilteredRobots,
      cart,
      addToCart,
      openCartDropdown,
      handleDropdown,
      isLoading,
    }),
    [
      robots,
      filteredRobots,
      totalAmount,
      incrementQuantity,
      decrementQuantity,
      filterRobotsByMaterial,
      cart,
      addToCart,
      openCartDropdown,
      handleDropdown,
      isLoading,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export function useAppStateContext(): IStateContext {
  return useContext(AppStateContext);
}
