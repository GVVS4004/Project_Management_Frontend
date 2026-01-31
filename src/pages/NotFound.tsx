import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* text-center = text align center */}
      <div className="text-center">
        {/* text-6xl = font size 3.75rem (60px) */}
        {/* font-bold = font weight 700 */}
        {/* text-blue-600 = blue text */}
        {/* mb-4 = margin bottom 1rem */}
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>

        {/* text-2xl = font size 1.5rem (24px) */}
        {/* text-gray-800 = dark gray text */}
        {/* mb-4 = margin bottom 1rem */}
        <h2 className="text-2xl text-gray-800 mb-4">Page Not Found</h2>

        {/* text-gray-600 = gray text */}
        {/* mb-8 = margin bottom 2rem */}
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>

        {/* inline-block = display: inline-block */}
        {/* px-6 = padding left & right 1.5rem */}
        {/* py-3 = padding top & bottom 0.75rem */}
        {/* bg-blue-600 = blue background */}
        {/* text-white = white text */}
        {/* rounded = border radius */}
        {/* hover:bg-blue-700 = darker blue on hover */}
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
