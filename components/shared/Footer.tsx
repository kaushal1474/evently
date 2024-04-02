import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='border-t w-100'>
        <div className='wrapper flex flex-between items-center flex-col sm:flex-row p-4 gap-4 text-center'>
            <Link href={"/"}>
                <Image 
                    src="/assets/images/logo.svg"
                    alt="logo"
                    width={128} height={38}
                />
            </Link>
            <p>
                2024 Evently. All Rights reserved.
            </p>
        </div>
    </footer>
  )
}

export default Footer