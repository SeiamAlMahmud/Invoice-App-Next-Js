"use client"

import NextError from 'next/error';
const error = ({ error }: { error: Error }) => {
    return (
        <div>
        <p><NextError statusCode={500} title={error.message} /> </p>
        </div>
    )
}

export default error