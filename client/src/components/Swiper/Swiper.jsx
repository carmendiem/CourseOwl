import { Navigation, Pagination, Scrollbar, A11y, Grid} from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "swiper/css/grid"
import "./SwiperStyles.css"


export const SwiperComponent = ({slides}) => {
    return (
        <Swiper
          // install Swiper modules
          modules={[Navigation, A11y, Grid]}
                                     slidesPerView={3} // Number of courses to show per page
                                      grid={{
                                        rows: 2, // 2 rows per slide
                                        fill: "row"
                                      }}
                                      className='mySwiper'
                                     navigation
                                     slidesPerGroup={3}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log('slide change')}
        >

            {slides.map((slide, index)=> (<SwiperSlide key={index }>{slide}</SwiperSlide>))
            }
            {slides.map((slide, index)=> (<SwiperSlide key={index }>{slide}</SwiperSlide>))
            }
            {slides.map((slide, index)=> (<SwiperSlide key={index }>{slide}</SwiperSlide>))
            }
            {slides.map((slide, index)=> (<SwiperSlide key={index }>{slide}</SwiperSlide>))
            }
            {slides.map((slide, index)=> (<SwiperSlide key={index }>{slide}</SwiperSlide>))
            }
        </Swiper>
      );
}
