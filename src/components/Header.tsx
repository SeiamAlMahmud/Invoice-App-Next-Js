import {
    OrganizationSwitcher,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs';
import Container from './Container';
import { Layers } from 'lucide-react';
import Link from 'next/link';
const Header = () => {
    return (
        <header>
            <Container>
                <div className='flex justify-between gap-4 items-center my-5'>
                    <div className='flex gap-4 items-center'>
                        <Link href={"/"} className='flex gap-4 cursor-pointer'>
                            <Layers />
                            <p>Invoicipedia</p>
                        </Link>
                        <span className='text-slate-300'>/</span>
                        <SignedIn>
                            <span className='-ml-2'>
                                <OrganizationSwitcher 
                                afterCreateOrganizationUrl={"/dashboard"}  />
                            </span>
                        </SignedIn>
                    </div>
                    <div>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </Container>
        </header>
    )
}

export default Header