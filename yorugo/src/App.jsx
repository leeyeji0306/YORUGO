// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SignIn from "./SignIn.jsx";
import SignUp from "./SignUp.jsx";

function App() {
  function clickButton() {}

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn clickButton={clickButton} />}></Route>
        <Route
          path="/signUp"
          element={<SignUp clickButton={clickButton} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
