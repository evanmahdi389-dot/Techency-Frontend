const logo = "/logo.png";
const aboutBg = "/aboutbg.jpg";
import { FiPhone, FiPenTool, FiUser, FiCamera, FiVideo } from "react-icons/fi";
import { motion } from "framer-motion";

const About = () => {
return (

  <section id="about" className="py-15 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto  border-white/5">
 
 

      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          

          <button className="flex items-center gap-2 border-b border-red-600 ">
                        
                         About
                       </button>
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold mb-6">Why We Started  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">TECHENCY?</span></h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            We’ve worked in places where marketing felt complicated, disconnected, or just off. TECHENCY is our way of doing it right.
          </p>
          <p className="text-gray-400 leading-relaxed">
            We believe good marketing means real strategy, real action, and real connection. We help you show up where it matters.
          </p>

           {/* Contact Button */}
                     <div className="hidden md:flex items-center mt-[35px]">
                       <button className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white px-6 py-[6px] rounded-full font-semibold transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40">
                         <FiPhone className="w-4 h-4" />
                         Contact Us
                       </button>
                     </div>
        </div>
        
        {/* Floating elements visualization */}
        <div className="relative h-[400px] flex items-center justify-center bg-gradient-to-b from-red-900/10 to-transparent rounded-2xl border border-red-500/10 overflow-hidden">
          <img src={logo} alt="TECHENCY" className="w-[300px] relative z-20" />
          <img src={aboutBg} alt="About Background" className="absolute inset-0 w-full h-full object-cover opacity-5 z-10 rounded-2xl" />

          <motion.div
            animate={{ y: [0, -10, 0], x: [0, 8, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-[#0f0f0f]/90 px-4 py-2 text-xs font-semibold text-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.04)] backdrop-blur-md"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <FiPenTool className="h-4 w-4" />
            </span>
            Script
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0], x: [0, -6, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-[#0f0f0f]/90 px-4 py-2 text-xs font-semibold text-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.04)] backdrop-blur-md"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10 text-orange-300">
              <FiUser className="h-4 w-4" />
            </span>
            Model
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0], x: [0, 6, 0], rotate: [0, 1, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/3 left-1/3 z-30 flex items-center gap-2 rounded-full border border-red-500/30 bg-[#110909]/90 px-4 py-2 text-xs font-semibold text-red-400 shadow-[0_0_22px_rgba(239,68,68,0.12)] backdrop-blur-md"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/15 text-red-400">
              <FiCamera className="h-4 w-4" />
            </span>
            Shoot
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0], x: [0, -5, 0], rotate: [0, -1, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/3 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-[#0f0f0f]/90 px-4 py-2 text-xs font-semibold text-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.04)] backdrop-blur-md"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
              <FiVideo className="h-4 w-4" />
            </span>
            Editing
          </motion.div>
        </div>
      </div>
    </section>
)
}

export default About;