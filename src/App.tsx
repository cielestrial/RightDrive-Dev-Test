import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/RightDrive-Dev-Test/" element={<Landing />} />
    </Routes>
  );
}

export default App;
