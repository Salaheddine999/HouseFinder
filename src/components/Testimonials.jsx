import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { HiStar } from "react-icons/hi";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

function Testimonials({ ratings }) {
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={5}
      slidesPerView={1}
      navigation
      // pagination={{ clickable: true }}
      loop={true}
      className="mySwiper"
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 2,
        },
      }}
    >
      {ratings.map((rating, index) => (
        <SwiperSlide key={index} className="p-4">
          <motion.div className="bg-white p-8 rounded-2xl shadow-md flex flex-col h-full transition-transform duration-300 transform hover:scale-105">
            <FaQuoteLeft className="text-primary opacity-20 text-5xl mb-4" />
            <p className="text-gray-700 italic mb-6 flex-1">
              “{rating.description}”
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg text-darker">
                  {rating.author}
                </p>
                <p className="text-sm text-gray-500">{rating.position}</p>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4" />
                ))}
              </div>
            </div>
          </motion.div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Testimonials;
