'use client';
import Image from 'next/image';
import React from 'react';
import { useDispatch } from 'react-redux';
import { del } from '../../store/CartSlice';
export default function Cart() {
  const cartProducts =
    window !== 'undefined'
      ? JSON.parse(localStorage?.getItem('cartProducts'))
      : '';
  console.log(cartProducts);
  const dispatch = useDispatch();
  function removeProduct(id) {
    dispatch(del(id));
  }
  return (
    <div className="mt-52 bg-gray-500 h-screen">
      <h1 className="text-white text-2xl">Cart Products:</h1>
      {cartProducts?.length > 0 &&
        cartProducts.map((product) => {
          return (
            <div className="flex items-center gap-24 my-2 bg-white px-4 py-2 rounded-md w-4/5">
              <div className="relative h-16 w-16 rounded-md overflow-hidden">
                <Image src={product?.image} layout="fill" objectFit="cover" />
              </div>
              <h1 className=" p-1 line-clamp-1 h-fit">{product?.title}</h1>
              <h1 className="grow text-end">${product?.price}</h1>
              <button
                className="bg-primary p-2 rounded-md text-white hover:bg-red-500 text-nowrap"
                onClick={() => removeProduct(product.id)}
              >
                Remove Item
              </button>
            </div>
          );
        })}
    </div>
  );
}
