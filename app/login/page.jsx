'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export default function Signin() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit() {
    try {
      const response = await signIn('credentials', {
        //?  useState تعطينا كل القيم المدخلة بدلا من استخدام getValues()
        ...getValues(),
        //?  next auth المصممة من قبل signin اذا لم نضع هذه القيمة سوف يتم اعادة توجيهنا الى صفحة
        redirect: false,
        //? callback هنا قمنا بالتقاط الأخطاء التي تم رميها في الباك اند عن طريق استخدام ال
      }).then((callback) => {
        console.log(callback);
        if (callback?.error) {
          toast.error(callback?.error);
        } else {
          toast.success('You Logged In Successfully');
          setTimeout(() => {
            router.push('/');
          }, 500);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center items-center inset-0 h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center p-4 sm:p-8 bg-teal-500 md:w-3/5 lg:w-2/5 xl:w-1/5 rounded-md m-4 hover:shadow-lg"
      >
        <h1 className="text-2xl font-bold text-white">Login</h1>

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
          className={
            (isValid
              ? 'bg-teal-600 hover:bg-teal-700 text-white'
              : 'bg-gray-600') +
            ' border-2 text-lg rounded-md w-full py-2 my-4 font-bold text-gray-400 transition duration-900 ease-linear'
          }
        >
          Login
        </button>
        <h1 className="text-gray-500">===== Or =====</h1>
        <div
          className="flex justify-between w-full bg-white rounded-md px-4 py-2 items-center my-2 hover:shadow-md cursor-pointer"
          onClick={() => signIn('google')}
        >
          <div className="relative h-8 w-8">
            <Image
              src={'/google.png'}
              alt="google image"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h1 className="text-lg grow text-center">Login With Google</h1>
        </div>
        <div
          className="flex justify-between w-full bg-white rounded-md px-4 py-2 items-center my-2 hover:shadow-md cursor-pointer"
          onClick={() => signIn('github')}
        >
          <div className="relative h-8 w-8">
            <Image
              src={'/github.png'}
              alt="google image"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h1 className="text-lg grow text-center">Login With Github</h1>
        </div>
        <Link href={'/register'}>
          <h1 className="text-gray-600">
            You Don&apos;t Have An Account?
            <span className="underline text-gray-700"> Sign Up</span>
          </h1>
        </Link>
      </form>
    </div>
  );
}
