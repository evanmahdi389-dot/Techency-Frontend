import { useEffect, useState } from "react";

const logo = "/logo.png";
import { FiPhone } from "react-icons/fi";


const Navber = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
 
   useEffect(() => {
     const sectionIds = ['home', 'services', 'about', 'portfolio'];
 
     const updateActiveSection = () => {
       const scrollPosition = window.scrollY + 180;
       let currentSection = 'home';
 
       sectionIds.forEach((id) => {
         const section = document.getElementById(id);
         if (!section) return;
 
         const sectionTop = section.offsetTop;
         const sectionBottom = sectionTop + section.offsetHeight;
 
         if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
           currentSection = id;
         }
       });
 
       setActiveSection(currentSection);
     };
 
     const handleScroll = () => {
       setIsScrolled(window.scrollY > 20);
       updateActiveSection();
     };
 
     handleScroll();
     window.addEventListener('scroll', handleScroll, { passive: true });
     window.addEventListener('resize', updateActiveSection);
 
     return () => {
       window.removeEventListener('scroll', handleScroll);
       window.removeEventListener('resize', updateActiveSection);
     };
   }, []);
 
   const navItems = [
     { href: '#home', label: 'Home', id: 'home' },
     { href: '#services', label: 'Service', id: 'services' },
     { href: '#about', label: 'About', id: 'about' },
     { href: '#portfolio', label: 'Portfolio', id: 'portfolio' },
   ];
 
   return (
     <nav
       className={`w-full z-50 transition-all duration-300 ${
         isScrolled ? 'fixed top-0' : 'absolute top-[20px]'
       }`}
     >
       <div className="max-w-[1100px] mx-auto rounded-[15px] px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/5 shadow-lg shadow-black/20">
         <div className="flex justify-between items-center h-16">
           {/* Logo */}
           <div className="flex items-center">
             <img src={logo} alt="TECHENCY" className="h-10" />
           </div>
 
           {/* Desktop Nav */}
           <div className="hidden md:flex items-center space-x-8 font-medium">
             {navItems.map((item) => (
               <a
                 key={item.id}
                 href={item.href}
                 className={`relative inline-flex items-center transition-colors duration-300 ${
                   activeSection === item.id ? 'text-red-500' : 'text-gray-300 hover:text-white'
                 }`}
               >
                 <span>{item.label}</span>
                 <span
                   className={`absolute left-0 right-0 -bottom-1.5 h-[2px] rounded-full bg-red-500 transition-all duration-300 ${
                     activeSection === item.id ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                   }`}
                 />
               </a>
             ))}
           </div>
 
           {/* Contact Button */}
           <div className="hidden md:flex items-center">
             <button className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-6 py-[6px] rounded-full font-semibold transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40">
               <FiPhone className="w-4 h-4" />
               Contact Us
             </button>
           </div>
         </div>
       </div>
     </nav>
   );
};

export default Navber;