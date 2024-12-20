import React from 'react'
import clsx from 'clsx'

type Props = {
    className?: string
    content: string
    onClick: () => void
}

export default function Button({ className, content, onClick }: Props) {
    const [isClick, setIsClick] = React.useState(false)
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleClick = () => {
        clearTimeout(timerRef.current as ReturnType<typeof setTimeout>)
        setIsClick(true)
        onClick()
        timerRef.current  =  setTimeout(() => {
            setIsClick(false)
        },125)

    }

    
    return (

        <button className={clsx(`w-[120px] h-[40px] bg-red-400 rounded-md text-slate-100 ${className} duration-200`, {
            'scale-[0.75] !duration-[120]': isClick
        })}
            onClick={handleClick}
        >
            {content}
        </button>
    )
}