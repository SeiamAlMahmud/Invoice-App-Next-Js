"use client"


import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"
import { LoaderCircle } from 'lucide-react'

interface SubmitButtonProps {
    text?: string;
    text2: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
} 
const SubmitButton = ({
    text= "Submit",
    text2="",
    variant= "default"
}: SubmitButtonProps) => {
    const { pending } = useFormStatus();
    // console.log(pending, "pending")
    return (
        <Button
        variant={variant}
        className="relative w-full font-semibold border-0">
            <span className={pending ? "text-transparent" : ""}>{text}</span>
            {
                pending && (
                    <span className="absolute flex justify-center items-center w-full h-full text-gray-400  gap-2">
                        <LoaderCircle className="animate-spin" /> 
                      { <span className={`text-gray-200 ${!text2  ? "hidden" : ""}`}>{text2}</span> }
                    </span>
                )
            }
        </Button>
    )
}

export default SubmitButton