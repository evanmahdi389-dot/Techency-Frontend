import { FiPlayCircle, FiUser } from "react-icons/fi";
import { motion } from 'framer-motion';
import bannerImage from "../../../public/banner1.png";

const Banner = () => {
return (
  <section id="home" className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center min-h-screen justify-center">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={bannerImage} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#0a0a0a]"></div>
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Top Pill */}
        <div className="inline-block bg-red-950/40 border border-red-500/20 px-6  rounded-full mb-4">
          <span className="text-red-500 text-[12px] font-medium tracking-wide p-0 m-0">
            Commercial Films • TVC • Corporate Video • VFX
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          We Create Videos <br />
          That <span className="text-red-600">Grow</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Brands</span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-gray-300 max-w-3xl mx-auto text-base md:text-xl mb-12 leading-relaxed font-light">
          Professional Video Production, Commercial Ads, TVC, Corporate<br className="hidden md:block"/> Videos & Video Editing Services
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-15">
          <button className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-8 py-[7px] rounded-full font-semibold transition-all text-lg shadow-lg shadow-red-500/20">
            <FiPlayCircle className="w-5 h-5 fill-white text-red-600 bg-white rounded-full" />
            Watch Showreel
          </button>
          <button className="flex items-center gap-3 bg-[#111111] hover:bg-[#1a1a1a] border border-white/5 text-white px-8 py-[7px] rounded-full font-semibold transition-all text-lg">
            <FiUser className="w-5 h-5 text-gray-400" />
            Get Free Consultation
          </button>
        </div>

        {/* Stats Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-[#111111] border border-white/5 rounded-2xl py-8 px-6 text-center hover:bg-[#151515] transition-colors">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">500+</h3>
            <p className="text-gray-400 text-sm md:text-base">Projects Completed</p>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded-2xl py-8 px-6 text-center hover:bg-[#151515] transition-colors">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">10M</h3>
            <p className="text-gray-400 text-sm md:text-base">Projects Completed</p>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded-2xl py-8 px-6 text-center hover:bg-[#151515] transition-colors">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">4K</h3>
            <p className="text-gray-400 text-sm md:text-base">Projects Completed</p>
          </div>
        </div>
      </motion.div>
    </section>

)
}


export default Banner;