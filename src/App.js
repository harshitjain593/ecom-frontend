import './App.css';
import AppRouter from './Router/AppRouter';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
      <ToastContainer
        autoClose={2000}
      />
      <AppRouter />
    </>
  );
}
export default App;
