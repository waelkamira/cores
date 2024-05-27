'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export default function RegisterPage() {
  const session = useSession();
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

  //? يعني ان المستخدم سجل دخول و سوف يتم توجيهه الى الصفحة الرئيسية session اذا كان هنالك
  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/');
    }
  }, [session]);

  //? الى الباك اند لتسجيل مستخدم جديد request نرسل
  //?  register الى الروات
  async function onSubmit() {
    try {
      // console.log('getValues', getValues());
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getValues()),
      });

      if (response.ok) {
        console.log(response);
        toast.success('Register Success');
        //? toast تم استخدام هذه الدالة فقط لاعطاء وقت بسيط لاظهار ال
        setTimeout(() => {
          router.push('/login');
        }, 500);
      } else {
        //? هنا قمنا بعمل رسالة خطأ خاصة تعكس الخطأ الذي حدث في الباك اند وهو ان المستخدم فعلا موحود
        setError('email', {
          type: 'custom',
          message: 'This Email Is Already Exist, Try Another One Or Login!',
        });
      }
    } catch (error) {
      setError({ message: 'this email is token' });
    }
  }

  return (
    <div className="flex justify-center items-center inset-0 h-screen w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center p-4 sm:p-8 bg-slate-600 md:w-3/5 lg:w-2/5 xl:w-1/5 rounded-md m-4 border border-red-400 hover:shadow-red-400 hover:shadow-md"
      >
        <h1 className="text-2xl font-bold text-white">Register</h1>
        <div className="flex flex-col py-2 w-full">
          <label className="text-sm text-white">Your Name:</label>
          <input
            required
            type={'text'}
            name={'name'}
            placeholder={'Your Name'}
            {...register('name')}
            className="text-xl p-2 rounded-md w-full outline-none border-2 ring-0 border-solid focus:border-red-400"
          />
        </div>

        <div className="flex flex-col py-2 w-full">
          <label className="text-sm text-white">Your Email:</label>
          <input
            type={'text'}
            //? validation التعرف عليها عند عمل zod حتى يستطيع name انتبه يجب وضع الخاصية
            name={'email'}
            placeholder={'Your Email'}
            {...register('email')}
            className="text-xl p-2 rounded-md w-full outline-none border-2 ring-0 border-solid focus:border-red-400"
          />
          {errors?.email && (
            <span className="text-white bg-red-600 mt-2 p-2 rounded-md">
              {errors?.email?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col py-2 w-full">
          <label className="text-sm text-white">Your Password:</label>
          <input
            type={'text'}
            name={'password'}
            placeholder={'Your Password'}
            {...register('password')}
            className="text-xl p-2 rounded-md w-full outline-none border-2 ring-0 border-solid focus:border-red-400"
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
              ? 'bg-red-400 hover:bg-red-500 text-white'
              : 'bg-gray-600') +
            ' border-2 text-lg rounded-md w-full py-2 my-4 font-bold text-gray-400 transition duration-900 ease-linear'
          }
        >
          Register
        </button>
        <h1 className="text-gray-400">===== Or =====</h1>
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
          <h1 className="text-lg grow text-center">Sign Up With Google</h1>
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
          <h1 className="text-lg grow text-center">Sign Up With Github</h1>
        </div>
        <Link href={'/login'}>
          <h1 className="text-gray-400">
            Already Have An Account?{' '}
            <span className="underline text-white"> Signin</span>
          </h1>
        </Link>
      </form>
    </div>
  );
}
