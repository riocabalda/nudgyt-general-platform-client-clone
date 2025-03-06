import React, { useRef, useState } from 'react'
import Slider from 'react-slick'
import { ChevronRight } from 'lucide-react'
import { ChevronLeft } from 'lucide-react'
import { Lightbulb } from 'lucide-react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '../style.css'

export const tipsData = [
  'To interact with the elder select transcript to record or type in your conversation if your simulation times out at any point, just refresh the page to resume',
  'Remember to check your seniors understanding of any task you assign them.',
  'Reiterating their concerns and validating seniors feelings are a step towards helping them open up.',
  'Remember to check seniors capabilities in performing Active Daily Living (ADL) Tasks.',
  'The three items in the memory test should not be related to each other.',
  'Asking the senior about their daily lifestyle is a quick way to answer multiple questions in the Community Screener form.'
]

function TipsContent() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1)
  const sliderRef = useRef<Slider | null>(null)

  const settings = {
    infinite: false,
    swipe: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index: number) => setCurrentSlideIndex(index + 1)
  }

  const handlePrevious = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev()
    }
  }

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext()
    }
  }
  return (
    <>
      <div className='w-[80vw] max-w-[570px] lg:w-full'>
        <Slider ref={sliderRef} {...settings}>
          {tipsData.map((text) => (
            <div className='!flex gap-3' key={text}>
              <span>
                <Lightbulb
                  className='text-brandcolora'
                  size={24}
                  strokeWidth={1}
                />
              </span>
              <p className='text-sm text-muted-foreground break-words'>
                {text}
              </p>
            </div>
          ))}
        </Slider>
      </div>
      <div className='flex items-center justify-between mt-3'>
        <button
          className='disabled:text-muted-foreground'
          disabled={currentSlideIndex === 1}
          onClick={handlePrevious}
        >
          <ChevronLeft size={24} strokeWidth={1} />
        </button>
        <div>
          <p className='text-sm text-foreground'>
            {currentSlideIndex} of {tipsData.length}
          </p>
        </div>
        <button
          className='disabled:text-muted-foreground'
          disabled={currentSlideIndex === tipsData.length}
          onClick={handleNext}
        >
          <ChevronRight size={24} strokeWidth={1} />
        </button>
      </div>
    </>
  )
}

export default TipsContent
