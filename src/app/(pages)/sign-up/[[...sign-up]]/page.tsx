import Container from "@/components/Container"
import { SignUp } from "@clerk/nextjs"

const page = () => {
  return (
    <>
    <Container className="flex justify-center h-full items-center mt-14 mb-20">
        <SignUp />
    </Container>
    </>
  )
}

export default page