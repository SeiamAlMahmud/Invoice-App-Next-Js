
import Link from 'next/link';
import Container from './Container';
const Footer = () => {
    return (
        <footer className='mt-6 mb-8'>
            <Container className='flex justify-between gap-6 items-center my-6'>
                <p className='text-sm'>
                    Invoicipedia &copy; {new Date().getFullYear()}
                </p>
                <p className='text-sm'>
                    Created by 
                    <Link href={"https://almahmud.top"} target='_blank' className='hover:text-blue-500'> Seiam Al Mahmud </Link>  with Next.js, Xata.io & Clerk
                </p>
            </Container>
        </footer>
    )
}

export default Footer