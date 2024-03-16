'use client';
import React from 'react';

export default function Button({ children, className, disabled }) {
  return (
    <button
      disabled={disabled}
      type="submit"
      className={
        className +
        'bg-transparent border-2 text-lg rounded-md hover:bg-teal-700 w-full py-2 my-4 font-bold text-gray-700 hover:text-white transition duration-900 ease-linear'
      }
    >
      {children}
    </button>
  );
}
