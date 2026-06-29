import { FiFacebook, FiInstagram, FiMapPin, FiPhone, FiYoutube } from "react-icons/fi"

const logo = "/logo.png";

const Footer = () => {
return (

  <footer className="bg-black border-t border-white/5 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-1 text-2xl font-black tracking-tighter mb-4">
           <img src={logo} alt="Logo" className="w-[150px]" />
          </div>
          <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
            Helping brands dominate the digital space through cinematic storytelling, strategic video marketing, and high-impact visual experiences.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Link</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-red-500 transition-colors">Home</a></li>
            <li><a href="#services" className="hover:text-red-500 transition-colors">Service</a></li>
            <li><a href="#about" className="hover:text-red-500 transition-colors">About</a></li>
            <li><a href="#portfolio" className="hover:text-red-500 transition-colors">Portfolio</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <p className="text-sm text-gray-400 flex items-center gap-2 mb-2">
            <FiPhone /> 01646-057717
          </p>
          <p className="text-sm text-gray-400 flex items-start gap-2 mb-6">
            <FiMapPin className="mt-1" /> House- 31 Road-2, Banasree, Rampura, Dhaka
          </p>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition-colors"><FiFacebook className="w-5 h-5"/></a>
            <a href="#" className="hover:text-white transition-colors"><FiInstagram className="w-5 h-5"/></a>
            <a href="#" className="hover:text-white transition-colors"><FiYoutube className="w-5 h-5"/></a>
          </div>
        </div>
      </div>
      
      <div className="text-center border-t border-white/5 pt-6">
        <p className="text-gray-600 text-xs">
          © 2026 all rights reserved by techency
        </p>
      </div>
    </footer>
)
}

export default Footer