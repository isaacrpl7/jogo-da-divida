import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import EnterRoomFailed from './Pages/EnterRoomFailed'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/:roomId",
    element: <App/>
  },
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/enter-room-failed",
    element: <EnterRoomFailed/>
  },
  
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);


