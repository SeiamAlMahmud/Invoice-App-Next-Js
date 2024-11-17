import Container from "@/components/Container"
import { SignIn } from "@clerk/nextjs"

const page = () => {
  return (
    <>
    <Container className="flex justify-center h-full items-center mt-14 mb-20">
        <SignIn />
    </Container>
    </>
  )
}

export default page