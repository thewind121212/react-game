import React from "react";
import { createAvatar } from "@dicebear/core";
import { adventurer } from '@dicebear/collection'


interface PlayerCardProps {
    playerName: string;
    isTurn: boolean;
    position: "left" | "right";
}

const PlayerCard = ({ playerName, isTurn, position }: PlayerCardProps) => {

    const avatar = createAvatar(adventurer, {
        seed: playerName,
        backgroundColor: ["b6e3f4", "c0aede", "d1d4f9"],
        size: 48,
        rotate: 0,
        radius: 0,
    })

    const avatarSvg = avatar.toString()


    return (
        <div
            className={`absolute top-0 rounded-xl  ${position === "left" ? "left-0 pl-4" : "right-0 pr-4"
                } w-fit h-20  flex items-center justify-start space-x-3`}
        >
            {
                position === "right" && (
                    <div>
                        <h4 className="text-xl font-bold text-white order-1">{playerName}</h4>
                    </div>
                )
            }
            <div
                className={`w-14 h-14 overflow-hidden flex justify-center items-center rounded-full border-4 ${isTurn ? "border-green-500" : "border-gray-400"
                    }`}
                dangerouslySetInnerHTML={{ __html: avatarSvg }}
            >
            </div>
            {
                position === "left" && (
                    <div>
                        <h4 className="text-xl font-bold text-white order-1">{playerName}</h4>
                    </div>
                )
            }
        </div>
    );
};

export default PlayerCard;