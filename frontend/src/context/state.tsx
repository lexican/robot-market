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
  addToCart: (cart: IRobot) => void;
  filterRobotsByMaterial: (material: string) => void;
  incrementQuantity: (robot: IRobot) => void;
  decrementQuantity: (robot: IRobot) => void;
  handleDropdown: () => void;
}

const AppStateContext = createContext<IStateContext>(undefined as never);

// eslint-disable-next-line @typescript-eslint/ban-types
export const AppStateProvider: FC<{}> = ({ children }) => {
  const localCart: IRobot[] | [] = JSON.parse(
    localStorage.getItem("ecom_robot:cart") || "[]"
  );
  const [robots, setRobots] = useState<IRobot[]>([]);
  const [filteredRobots, setFilteredRobots] = useState<IRobot[]>([]);
  const [cart, setCart] = useState<IRobot[]>(localCart);
  const [openCartDropdown, setOpenCartDropdown] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const handleDropdown = useCallback(() => {
    setOpenCartDropdown(!openCartDropdown);
  }, [openCartDropdown]);

  //const [isLoading, setIsLoading] = useState<>(false);

  useEffect(() => {
    loadRobots();
  }, []);

  //Fetch all the robots from the backend
  const loadRobots = () => {
    //setIsLoading(true);
    axios
      .get("/api/robots")
      .then((response) => {
        setRobots([...response.data.data]);
        setFilteredRobots([...response.data.data]);
        //setIsLoading(false);
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
        //setIsLoading(false);
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
          return [...tempRobots];
        });
        addTotal(cart);
      }
    },
    [addTotal, cart, robots]
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
          return [...tempRobots];
        });
        addTotal(cart);
      }
    },
    [addTotal, cart, robots]
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
              localStorage.setItem("ecom_poc:cart", JSON.stringify(newCart));
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
        localStorage.setItem("ecom_poc:cart", JSON.stringify(newCart));
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
            localStorage.setItem("ecom_poc:cart", JSON.stringify(newCart));
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
          localStorage.setItem("ecom_poc:cart", JSON.stringify(newCart));
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
          localStorage.setItem("ecom_poc:cart", JSON.stringify(newCart));
          return newCart;
        });
      }
    },
    [addTotal, cart, decrementStock]
  );

  const clearCart = useCallback(() => {
    setCart(() => {
      localStorage.removeItem("ecom_poc:cart");
      return [];
    });
  }, []);

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
      clearCart,
      openCartDropdown,
      handleDropdown,
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
      clearCart,
      openCartDropdown,
      handleDropdown,
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
