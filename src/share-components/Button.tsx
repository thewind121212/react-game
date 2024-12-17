import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

type Props = {
    content: string,
    onClickEventHandler: () => void,
    className?: string
}

export default function Button({ onClickEventHandler, className, content }: Props) {

    const [buttonSpring, setButtonSpring] = useState<boolean>(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        clearTimeout(timeoutRef.current!)
        timeoutRef.current = setTimeout(() => {
            setButtonSpring(false)
        }, 100)

        return () => {
            clearTimeout(timeoutRef.current!)
        }
    }, [buttonSpring])


    const onClickEventHandlerWithSpring = () => {
        setButtonSpring(true)
        onClickEventHandler()
    }


    return (
        <div className={clsx(`bg-[#18BC9C] rounded-[6px] px-[12px] py-[6px] flex justify-center items-center text-white font-bold cursor-pointer duration-100 ${className}`,
            {
                'scale-125': buttonSpring,
                'scale-100': !buttonSpring

            }
        )}
            onClick={onClickEventHandlerWithSpring}
        >{content}</div>
    )
}