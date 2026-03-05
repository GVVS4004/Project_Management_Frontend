

const Avatar = ({ src, alt }: { src: string; alt: string }) => {
    const getInitials = (name: string): string => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };
  return (
    <div className="h-8 w-8 rounded-full bg-gray-300" title={alt}>
      {(src !== "" && src !== null) ? (
        <img src={src} className="h-8 w-8 rounded-full"/>
      ) : (
        <div>
            <h3 className="text-center text-gray-700 font-bold m-1">
                {alt ? getInitials(alt) : "U"}
            </h3>
        </div>
      )}
    </div>
  );
};

export default Avatar;
