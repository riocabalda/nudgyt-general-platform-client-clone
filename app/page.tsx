import { FacebookIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import RedirectAuth from './(shared)/components/helper/RedirectAuth'
import { Button } from './(shared)/components/ui/button'

function HomePageContent() {
  return (
    <div id='home-page' className='min-h-screen flex flex-col'>
      <div className='bg-transparent relative min-h-[85vh] lg:min-h-[90vh]'>
        <Image
          src={'/images/background.webp'}
          alt='background'
          fill
          className='object-cover absolute -z-10 brightness-[0.85] animate-fade-in'
          priority
          quality={100}
        />
        <div className='container mx-auto h-full pb-10 lg:pb-[120px] px-4 lg:px-6'>
          <div className='flex justify-between items-center py-6 lg:py-8'>
            <Image
              src={'/icon/nudgyt-white.svg'}
              alt='logo'
              height={100}
              width={100}
              className='transition-transform hover:scale-105'
            />
            <Link href='/sign-in'>
              <Button className='bg-transparent border-2 border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 px-8 py-2'>
                Login
              </Button>
            </Link>
          </div>
          <main className='grid grid-cols-1 lg:grid-cols-3 gap-[110px] mt-16 lg:mt-28 2xl:mt-36'>
            <div className='hidden col-span-1 relative lg:block'>
              <Image
                src={'/icon/connection-line.svg'}
                alt='connection-line'
                layout='responsive'
                height={100}
                width={300}
                className='hidden absolute bottom-[225px] -left-3 lg:block lg:max-w-[250px] animate-slide-in-left'
              />
              <Image
                src={'/icon/magnet.svg'}
                alt='magnet'
                layout='responsive'
                height={230}
                width={230}
                className='hidden absolute bottom-0 right-0 lg:block lg:max-w-[200px] animate-slide-in-right'
              />
            </div>
            <div className='col-span-3 lg:col-span-2 flex flex-col gap-12'>
              <h1 className='text-5xl lg:text-7xl font-black text-white text-center max-w-[420px] mx-auto leading-tight lg:leading-[1.15] lg:max-w-full lg:text-left animate-fade-in'>
                Scale your Thinking Processes with AI
              </h1>
              <p className='font-normal text-white/90 text-xl text-center lg:text-left max-w-[420px] mx-auto lg:max-w-full leading-relaxed'>
                We combine behavioral science and AI to create intelligent
                simulations that sense, think, and act—just like you—allowing
                you to save time and scale faster.
              </p>
              <div>
                <Link href='mailto:info@nudgyt.com' target='_blank'>
                  <Button className='w-full bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300 lg:w-auto text-lg px-10 py-6'>
                    Contact Nudgyt
                  </Button>
                </Link>
              </div>
            </div>
          </main>
          <div className='backdrop-blur-xl bg-white/10 py-12 px-8 mt-20 lg:mt-28 2xl:mt-[180px] rounded-2xl grid md:grid-cols-2 lg:grid-cols-3 gap-14 border border-white/10 hover:border-white/20 transition-colors duration-300'>
            <div className='space-y-6 max-w-[320px] col-span-1 group hover:translate-y-[-8px] transition-transform duration-300 animate-fade-in'>
              <Image
                src={'/icon/message.svg'}
                alt='Personalized Learning icon'
                height={72}
                width={72}
                className='object-contain group-hover:scale-110 transition-transform duration-300'
              />
              <div className='space-y-4'>
                <h4 className='text-3xl font-black text-white'>
                  Personalized Learning
                </h4>
                <p className='text-base text-white/90 leading-relaxed'>
                  AI-driven simulations that adapt to individual learning styles
                  for tailored skill development.
                </p>
              </div>
            </div>
            <div className='space-y-6 max-w-[320px] col-span-1 group hover:translate-y-[-8px] transition-transform duration-300 animate-fade-in'>
              <Image
                src={'/icon/planet.svg'}
                alt='Real-World Training icon'
                height={72}
                width={72}
                className='object-contain group-hover:scale-110 transition-transform duration-300'
              />
              <div className='space-y-4'>
                <h4 className='text-3xl font-black text-white'>
                  Real-World Training
                </h4>
                <p className='text-base text-white/90 leading-relaxed'>
                  Behavioral AI creates realistic scenarios to help learners
                  practice and improve in real-world situations.
                </p>
              </div>
            </div>
            <div className='space-y-6 max-w-[320px] col-span-1 group hover:translate-y-[-8px] transition-transform duration-300 animate-fade-in'>
              <Image
                src={'/icon/target.svg'}
                alt='Effortless Scalability icon'
                height={72}
                width={72}
                className='object-contain group-hover:scale-110 transition-transform duration-300'
              />
              <div className='space-y-4'>
                <h4 className='text-3xl font-black text-white'>
                  Effortless Scalability
                </h4>
                <p className='text-base text-white/90 leading-relaxed'>
                  Quickly scale your training with customizable simulations that
                  reach a wide audience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-white text-gray-800'>
        <div className='container mx-auto py-12'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center space-x-6'>
              <Image
                src={'/images/nudgyt-logo.svg'}
                alt='nudgyt-logo'
                width={80}
                height={80}
                className='object-cover hover:opacity-90 transition-opacity'
              />
              <div className='flex space-x-4'>
                <Link
                  href='https://www.facebook.com/Nudgyt'
                  target='_blank'
                  className='text-gray-600 hover:text-blue-500 transition-colors'
                >
                  <FacebookIcon
                    strokeWidth={1.5}
                    size={24}
                    className='hover:scale-110 transition-transform duration-200'
                  />
                </Link>
                <Link
                  href='https://www.linkedin.com/company/nudgyt'
                  target='_blank'
                  className='text-gray-600 hover:text-blue-500 transition-colors'
                >
                  <LinkedinIcon
                    strokeWidth={1.5}
                    size={24}
                    className='hover:scale-110 transition-transform duration-200'
                  />
                </Link>
                <Link
                  href='https://www.youtube.com/@nudgyt'
                  target='_blank'
                  className='text-gray-600 hover:text-red-500 transition-colors'
                >
                  <YoutubeIcon
                    strokeWidth={1.5}
                    size={24}
                    className='mt-[2px] hover:scale-110 transition-transform duration-200'
                  />
                </Link>
              </div>
            </div>

            <div className='mt-6 md:mt-0 text-center md:text-left'>
              <p className='text-sm text-gray-600'>
                © {new Date().getFullYear()} Nudgyt Pte. Ltd. Singapore
              </p>
              <p className='text-sm text-gray-600'> All rights reserved.</p>
              <p className='text-xs text-gray-500 mt-2'>
                Empowering your AI-driven future.
              </p>
            </div>

            <div className='mt-6 md:mt-0 flex flex-col items-center md:items-start space-y-2'>
              <Link
                href='https://www.nudgyt.com/privacy'
                className='text-sm text-gray-600 hover:text-gray-800 transition-colors'
                target='_blank'
              >
                Privacy Policy
              </Link>
              <Link
                href='https://www.nudgyt.com/terms-of-service'
                className='text-sm text-gray-600 hover:text-gray-800 transition-colors'
                target='_blank'
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <RedirectAuth>
      <HomePageContent />
    </RedirectAuth>
  )
}

export default HomePage
