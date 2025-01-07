// Code: Đây là file chính của project, nó sẽ render ra file App.js và đưa vào thẻ div có id là root
// render có nghĩa là hiển thị,
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import RouterCustom from "./router";
import "./style/style.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <RouterCustom />
  </BrowserRouter>
);
