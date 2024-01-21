import emptyAvatar from "@assets/empty avatar.jpg"
import clsx from "clsx";

const sizes = {
    sm: "h-[50px] w-[50px]",
    md: "h-[100px] w-[100px]",
    lg: "h-[150px] w-[150px]"
};


type AvatarProps = {
    src: string;
    size?: keyof typeof sizes
    className?: string;
}


export const Avatar = ({src, size = "md", className}: AvatarProps) => {
    return <img src={src || emptyAvatar} className={clsx(className, sizes[size], "rounded-full")} alt=""/>
}