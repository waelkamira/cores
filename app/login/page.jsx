'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

//? 1- react-hook-form نقوم بتنزيل مكتبة
//? 2- zod و مكتبة react-hook-form للربط بين مكتبة  @hookform/resolvers نقوم بتنزيل مكتبة
//? 3-  @hookform/resolvers القادم من مكتبة resolver عن طريق useForm الذي يتم تمريره ل  schema لعمل  zod نقوم بتنزيل مكتبة
///? لمراقبة عمل المكتبة (اختياري) @hookform/devtools نقوم بتنزيل

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export default function Signin() {
  const session = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
  });

  //?يعني ان المستخدم سجل دخول و سوف يتم توجيهه الى الصفحة الرئيسية session اذا كان هنالك
  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/');
    }
  }, [session]);

  async function onSubmit() {
    try {
      //? next-auth/react القادمة من signIn() التي تمثل صفحة الروات لتسجيل الدخول في الباك اند عن طريق الدالة  [...nextauth] الى الروات request نقوم بارسال
      const response = await signIn('credentials', {
        //?  useState تعطينا كل القيم المدخلة بدلا من استخدام getValues()
        ...getValues(),
        //? او نبقى في نفس صفحة تسجيل الدخول next auth المصممة من قبل signin اذا لم نضع هذه القيمة سوف يتم اعادة توجيهنا الى صفحة
        redirect: false,
      });

      console.log(response);
      if (response.ok) {
        toast.success('You Logged In Successfully');
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        //? هنا قمنا بالتقاط الأخطاء التي تم رميها في الباك اند
        toast.error(response?.error);
        console.log(response?.error);

        //? هنا قمنا بالتحقق من رسالة الخطأ القادمة من الباك اند و من الذي تسبب بها هل هو خطأ في كتابة الايميل ام الباسورد
        if (response?.error?.includes('email')) {
          setError('email', {
            type: 'custom',
            message: response.error,
          });
        } else {
          setError('password', {
            type: 'custom',
            message: response.error,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex justify-center items-center inset-0 h-screen w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center p-4 sm:p-8 bg-slate-600 md:w-3/5 lg:w-2/5 xl:w-1/5 rounded-md m-4 hover:shadow-md hover:shadow-red-400 border border-red-400"
      >
        <h1 className="text-2xl font-bold text-white">Login</h1>

        <div className="flex flex-col py-2 w-full">
          <label className="text-sm text-white">Your Email:</label>
          <input
            type={'text'}
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
          Login
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
          <h1 className="text-gray-400">
            You Don&apos;t Have An Account?
            <span className="underline text-white"> Sign Up</span>
          </h1>
        </Link>
      </form>
    </div>
  );
}
