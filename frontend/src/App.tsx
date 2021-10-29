import {useState, useEffect} from "react"
import axios from "axios"

type Robot = {
  name: number
  image: string
  price: string,
  stock: string,
  createdAt: string,
  material: string
  }

function App(){
  const [robots, setRobots] = useState<Robot[]>([]);
  //const [isLoading, setIsLoading] = useState<>(false);
  useEffect(() => {
    loadRobots();
  }, []);

  //Fetch all the devices from the database
  const loadRobots = () => {
    //setIsLoading(true);
    axios
      .get("/api/robots")
      .then((response) => {
        console.log(JSON.stringify(response.data.data));
        setRobots([...response.data.data]);
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
  return (
    <div className="App">
      <h1>Robot Market</h1>

    </div>
  );
}

export default App;
