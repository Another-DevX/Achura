'use client'
import React from 'react'
import Image from 'next/image'
import Nav from '@/components/landing/NavBar'
import Footer from '@/components/landing/Footer'
import Link from 'next/link'
import { Button } from '@nextui-org/react'
import useWallet from '@/hooks/useWallet'

const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  //TODO: implementar lógica de submit
  // axios.post('/api/user' ...)
}

export default function Example () {
  const { openWalletModal } = useWallet()

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 pt-40'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <Link href='/'>
            <p className='text-9xl animate-bounce justify-center items-center text-center'>
              🦙
            </p>
          </Link>
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-withe'>
            ACHURA
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <Button
            onPress={openWalletModal}
            radius='md'
            size='lg'
            color='primary'
            className='w-full text-white font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Conecta tu Near Wallet
          </Button>
          <p className='mt-10 text-center text-sm text-gray-500'>
            👛 Aun no tienes{' '}
            <Link
              href='https://www.mynearwallet.com/'
              target='_blank'
              className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
            >
              Near Wallet de Near?
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
