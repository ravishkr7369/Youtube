import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // Import the Provider from react-redux
import store from "./app/store"; // Import the Redux store (ensure you have the store.js 
import Index from "./index.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}
      {/* Wrap your app with Provider */}
      <BrowserRouter>
        <Index />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" // or "dark"
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
