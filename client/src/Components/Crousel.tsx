import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import '../app.css';
import { Pagination } from 'swiper/modules';

const images = [
    {
        image: 'https://www.buzzsneakers.bg/files/files/Air-max-modeli-AUG22-1920x789.jpg',
        url: '1'
    },
    {
        
        image: 'https://cdnb.artstation.com/p/assets/images/images/041/038/055/large/shikhar-yadav-shoes-banner.jpg?1630579962',
        url: '2'
    },
 
]

const Crousel = () => {
    return (
        <div className='crousel'>
            <Swiper
                pagination={{
                    dynamicBullets: true,
                }}
                modules={[Pagination]}
                className="mySwiper"
            >
                {images.map((item) => (
                <SwiperSlide key={item.url}>
                    <img style={{marginLeft: "3px", marginRight: "3px"}} src={item.image} alt="" />
                </SwiperSlide>
                ))}

            </Swiper>
        </div>
    )
}

export default Crousel