import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { isBrowser } from "../common/is-browser";
import { IRobot } from "../components/robot-list/RobotList";
import axios from "axios";

export interface IStateContext {
  robots: IRobot[];
  filteredRobots: IRobot[];
  cart: IRobot[];
  addToCart: (cart: IRobot) => void;
  filterRobotsByMaterial: (material: string) => void;
  incrementQuantity: (robot: IRobot) => void;
  decrementQuantity: (robot: IRobot) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppStateContext = createContext<IStateContext>(undefined as any);

// eslint-disable-next-line @typescript-eslint/ban-types
export const AppStateProvider: FC<{}> = ({ children }) => {
  const localCart: IRobot[] | [] = JSON.parse(
    (isBrowser && localStorage.getItem("ecom_robot:cart")) || "[]"
  );
  const [robots, setRobots] = useState<IRobot[]>([]);
  const [filteredRobots, setFilteredRobots] = useState<IRobot[]>([]);
  const [cart, setCart] = useState<IRobot[]>(localCart);
  const [openCartDropdown, setOpenCartDropdown] = useState<boolean>(false);
  const openDropdown = () => setOpenCartDropdown(true);
  const closeDropdown = () => setOpenCartDropdown(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);

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

  const addTotal = useCallback(() => {
    const tempCart = [...cart];
    let total = 0;
    tempCart.map((item) => (total += item.totalPrice));
    setTotalAmount(() => {
      return total;
    });
  }, [cart]);

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
        addTotal();
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
          return [...tempRobots];
        });
        addTotal();
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
          robotItem.totalPrice = robot.price * robot.quantity;
          setRobots(() => {
            return [...tempRobots];
          });
          addTotal();
          const tempCart = [...cart];
          const selectedRobot = tempCart.find(
            (item: IRobot) => item.name === robot.name
          );

          if (selectedRobot) {
            const index = tempCart.indexOf(selectedRobot);
            const robotItem = tempCart[index];
            robotItem.quantity = robotItem.quantity + 1;
            robotItem.totalPrice = robot.price * robot.quantity;
            setCart(() => {
              const newCart = [...tempCart];
              isBrowser &&
                localStorage.setItem("ecom_poc:cart", JSON.stringify(newCart));
              return newCart;
            });
            addTotal();
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
        isBrowser &&
          localStorage.setItem("ecom_poc:cart", JSON.stringify(newCart));
        return newCart;
      });
      addTotal();
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
        incrementStock(robot);
        const index = tempCart.indexOf(selectedRobot);
        const robotItem = tempCart[index];

        if (robotItem.quantity > 1) {
          robotItem.quantity = robotItem.quantity - 1;
          robotItem.totalPrice = robot.price * robot.quantity;
          setCart(() => {
            const newCart = [...tempCart];
            isBrowser &&
              localStorage.setItem("ecom_poc:cart", JSON.stringify(newCart));
            return newCart;
          });
          addTotal();
        } else {
          removeCartItem(robot);
        }
      }
    },
    [addTotal, cart, incrementStock, removeCartItem]
  );

  const addToCart = useCallback(
    (robot: IRobot) => {
      if (cart.length == 0) {
        robot.quantity = 1;
        robot.totalPrice = robot.price;
        decrementStock(robot);
        setCart(() => {
          const newCart = [robot];
          isBrowser &&
            localStorage.setItem("ecom_poc:cart", JSON.stringify(newCart));
          return newCart;
        });
      } else {
        const tempCart = [...cart];
        const selectedRobot = tempCart.find(
          (item: IRobot) => item.name === robot.name
        );

        if (selectedRobot) {
          decrementStock(robot);
          const index = tempCart.indexOf(selectedRobot);
          const robotItem = tempCart[index];
          robotItem.quantity = robotItem.quantity + 1;
          robotItem.totalPrice = robot.price * robot.quantity;
          setCart(() => {
            const newCart = [...tempCart];
            isBrowser &&
              localStorage.setItem("ecom_poc:cart", JSON.stringify(newCart));
            return newCart;
          });
          addTotal();
        } else {
          decrementStock(robot);
          robot.quantity = 1;
          robot.totalPrice = robot.price;
          setCart((prev) => {
            const newCart = [robot, ...prev];
            isBrowser &&
              localStorage.setItem("ecom_poc:cart", JSON.stringify(newCart));
            return newCart;
          });
          addTotal();
        }
      }
    },
    [addTotal, cart, decrementStock]
  );

  const clearCart = useCallback(() => {
    setCart((_) => {
      isBrowser && localStorage.removeItem("ecom_poc:cart");
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
      openDropdown,
      closeDropdown,
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
    ]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export function useAppStateContext() {
  return useContext(AppStateContext);
}
