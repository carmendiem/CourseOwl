import { Navigation, Pagination, Scrollbar, A11y, Grid} from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/css/grid"
import "./ForumSwiperStyles.css"


export const ForumSwiperComponent = ({slides}) => {
    return (
        <Swiper
          // install Swiper modules
          modules={[Navigation, A11y, Grid]}
                                     slidesPerView={3} // Number of courses to show per page
                                     
                                      grid={{
                                        rows: 3, // 2 rows per slide
                                        fill: "row"
                                      }}
                                      spaceBetween={20}
                                      className='mySwiper'
                                     navigation
                                    
                                     slidesPerGroup={3}
        >
            {slides.map((slide, index)=> (<SwiperSlide key={index }>{slide}</SwiperSlide>))
            }
        </Swiper>
      );
}
