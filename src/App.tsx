import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import Landing from "./pages/Landing";
import store from "./utils/store";

const App = () => {
  return (
    <>
      <CssBaseline />
      <Provider store={store}>
        <Landing />
      </Provider>
    </>
  );
};

export default App;
