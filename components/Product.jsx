'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { add } from '../store/CartSlice';
import Link from 'next/link';
import { getProducts } from '../store/FetchSlice';
export const Product = () => {
  const [allCartProducts, setAllCartProducts] = useState();
  const products = useSelector((state) => state?.products?.data);
  console.log('products', products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
    setAllCartProducts(
      window !== 'undefined'
        ? JSON.parse(localStorage?.getItem('cartProducts'))?.length
        : ''
    );
  }, []);

  function addToCart(product) {
    //? dispatch an add action هنا نقوم بعمل
    dispatch(add(product));
    setAllCartProducts(
      window !== 'undefined'
        ? JSON.parse(localStorage?.getItem('cartProducts'))?.length
        : ''
    );
  }

  return (
    <>
      <div className="relative flex justify-end px-10">
        <Link href={'/cart'}>
          <h1 className="text-sm text-whites absolute -top-4 right-8 text-white bg-primary rounded-full py-[2px] px-[8px]">
            {allCartProducts || 0}
          </h1>
          <div className="relative h-8 w-8">
            <Image
              src={'/cart.png'}
              layout="fill"
              objectFit="cover"
              alt={'cart'}
            />
          </div>
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-8">
        {products?.length > 0 &&
          products.map((product) => {
            return (
              <div className="flex flex-col items-center justify-center bg-slate-600 hover:shadow-md hover:shadow-red-400 w-52 p-4 rounded-md m-2 border border-red-400">
                <div className="relative h-32 w-full rounded-md overflow-hidden">
                  <Image src={product?.image} layout="fill" objectFit="cover" />
                </div>
                <h1 className="text-white p-1 line-clamp-1 h-fit">
                  {product?.title}
                </h1>
                <h1 className="text-white">${product?.price}</h1>
                <button
                  className="mt-2 bg-gray-600 px-6 py-2 rounded-md hover:bg-gray-700 text-white border border-red-400"
                  onClick={() => addToCart(product)}
                >
                  Add To Cart
                </button>
              </div>
            );
          })}
      </div>
    </>
  );
};
