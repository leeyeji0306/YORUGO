// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SignIn from "./SignIn.jsx";
import SignUp from "./SignUp.jsx";
import Home from "./Home.jsx";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn setUser={setUser} />}></Route>
        <Route path="/signUp" element={<SignUp />}></Route>
        <Route path="/home" element={<Home user={user} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
