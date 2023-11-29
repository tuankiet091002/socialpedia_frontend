type AvatarProps = {
    src: string,
    size: keyof typeof sizes
}

const sizes = {
    sm: {width: '50px', height: '50px'},
    md: {width: '100px', height: '100px'},
    lg: {width: '150px', height: '150px'},
};

export const Avatar = ({src, size}: AvatarProps) => {
    return (<img src={src} className="rounded-circle mb-3" style={sizes[size]}
                 alt="Avatar"/>)
}