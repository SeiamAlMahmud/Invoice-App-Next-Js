import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs';
import Container from './Container';
const Header = () => {
    return (
        <header>
            <Container>
                <div className='flex justify-between gap-4 items-center my-5'>
                    <p>Invoicipedia</p>
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