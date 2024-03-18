'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
  });

  function handleSubmitRegister() {}

  async function onSubmit(data) {
    try {
      console.log('getValues', getValues());
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getValues()),
      });
      router.push('/signIn');
    } catch (error) {
      setError('root', { message: 'this email is token' });
    }
  }

  return (
    <div className="flex justify-center items-center  inset-0 h-screen ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center p-4 sm:p-8 bg-teal-500 md:w-3/5 lg:w-2/5 xl:w-1/5 rounded-md m-4 hover:shadow-lg"
      >
        <h1 className="text-2xl font-bold text-white">Register</h1>
        <div className="flex flex-col py-2 w-full">
          <label className="text-lg text-gray-700">Your Name:</label>
          <input
            required
            type={'text'}
            name={'name'}
            placeholder={'Your Name'}
            {...register('name')}
            className="text-xl p-2 rounded-md w-full outline-none border-2 ring-0 border-solid focus:border-gray-500"
          />
        </div>

        <div className="flex flex-col py-2 w-full">
          <label className="text-lg text-gray-700">Your Email:</label>
          <input
            type={'text'}
            name={'email'}
            placeholder={'Your Email'}
            {...register('email')}
            className="text-xl p-2 rounded-md w-full outline-none border-2 ring-0 border-solid focus:border-gray-500"
          />
          {errors?.email && (
            <span className="text-white bg-red-600 mt-2 p-2 rounded-md">
              {errors?.email?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col py-2 w-full">
          <label className="text-lg text-gray-700">Your Password:</label>
          <input
            type={'text'}
            name={'password'}
            placeholder={'Your Password'}
            {...register('password')}
            className="text-xl p-2 rounded-md w-full outline-none border-2 ring-0 border-solid focus:border-gray-500"
          />
          {errors?.password && (
            <span className="text-white bg-red-600 mt-2 p-2 rounded-md">
              {errors?.password?.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          onClick={handleSubmitRegister}
          className={
            (isValid
              ? 'bg-teal-600 hover:bg-teal-700 text-white'
              : 'bg-gray-600') +
            ' border-2 text-lg rounded-md w-full py-2 my-4 font-bold text-gray-400 transition duration-900 ease-linear'
          }
        >
          Register
        </button>
        <h1 className="text-gray-500">===== Or =====</h1>
        <div className="flex justify-between gap-2 w-full bg-white rounded-md px-4 py-2 items-center my-2 hover:shadow-md cursor-pointer">
          <div className="relative h-8 w-8">
            <Image
              src={'/google.png'}
              alt="google image"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h1 className="text-sm sm:text-lg grow text-center">
            Sing Up With Google
          </h1>
        </div>
        <div className="flex justify-between gap-2 w-full bg-white rounded-md px-4 py-2 items-center my-2 hover:shadow-md cursor-pointer">
          <div className="relative h-8 w-8">
            <Image
              src={'/github.png'}
              alt="google image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <h1 className="text-sm sm:text-lg grow text-center">
            Sing Up With Github
          </h1>
        </div>
        <Link href={'/signIn'}>
          <h1 className="text-gray-600">
            Already Have An Account?{' '}
            <span className="underline text-gray-700"> Signin</span>
          </h1>
        </Link>
      </form>
    </div>
  );
}
