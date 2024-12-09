import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MapComponent from "./pages/Map/Map";
import { FirebaseAuthProvider } from "./common/auth/firebaseAuthContext";

function App() {
  return (
    <FirebaseAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<MapComponent />} />
        </Routes>
      </BrowserRouter>
    </FirebaseAuthProvider>
  );
}

export default App;
