import React from "react";
import { Formulario } from "../../components";
import "./styles.scss";

export const Home = () => {
  return (
    <div className='home-body'>
      <div className='home-screen'></div>
      <Formulario />
    </div>
  );
};
