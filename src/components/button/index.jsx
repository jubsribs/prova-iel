import React from 'react';
import './styles.scss';

export const Button = ({ children, onClick }) => {
  return (
    <button className='opus-button' onClick={onClick}>
      <span> {children}</span>
    </button>
  );
};
