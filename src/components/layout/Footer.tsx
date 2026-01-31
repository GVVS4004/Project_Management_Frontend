const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // bg-white = white background
    // border-t = border on top
    // border-gray-200 = gray border color (shade 200)
    // mt-auto = margin-top: auto (pushes footer to bottom when using flex)
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* mx-auto = center horizontally */}
      {/* px-4, sm:px-6, lg:px-8 = responsive horizontal padding */}
      {/* py-4 = padding top & bottom 1rem */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* flex = display: flex */}
        {/* flex-col = flex direction column (stack vertically) */}
        {/* md:flex-row = on medium screens (768px+), flex direction row */}
        {/* justify-between = space between items */}
        {/* items-center = center items vertically */}
        {/* text-sm = font size 0.875rem (14px) */}
        {/* text-gray-600 = gray text color (shade 600) */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div>
            © {currentYear} Task Management Platform. All rights reserved.
          </div>

          {/* flex = display: flex */}
          {/* space-x-6 = horizontal gap of 1.5rem between links */}
          {/* mt-2 = margin top 0.5rem (on mobile) */}
          {/* md:mt-0 = on medium screens, no margin top */}
          <div className="flex space-x-6 mt-2 md:mt-0">
            {/* hover:text-blue-600 = blue text on hover */}
            <a href="#" className="hover:text-blue-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-600">
              Terms of Service
            </a>
            <a href="#" className="hover:text-blue-600">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
