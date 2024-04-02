import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '../ui/button'
import NavItems from './NavItems'
import MobileNav from './MobileNav'

const Header = () => {
  return (
    <header className='border-b w-full'>
      <div className='wrapper flex justify-between items-center'>
        <Link href="/" className='w-36'>
          <Image src="/assets/images/logo.svg" alt="logo"
            width={128} height={38}
          />
        </Link>

        <SignedIn>
          <nav className='hidden md:flex-between w-full max-w-xs'>
            <NavItems />
          </nav>
        </SignedIn>


        {/*  //w-32 */}
        <div className='flex justify-end gap-3'>
          <SignedIn>
            <UserButton afterSignOutUrl='/' />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className='rounded-3xl' size={'lg'}>
              <Link href={"/signin"}>Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header