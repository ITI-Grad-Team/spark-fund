<<<<<<< HEAD
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'

function App() {
=======
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
>>>>>>> 3968702da34aa6093260b10f45cd9ebce21a7240

  return (
    <>
      <Login />
      <Register />
      
    </>
  );
}

export default App;
