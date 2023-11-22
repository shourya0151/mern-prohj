import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import { Link, useNavigate } from "react-router-dom";
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';


export default function Listing() {
  SwiperCore.use([Navigation]);
  const navigate = useNavigate();
  const [formData,setFormData] = useState({});
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  ;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);



   const handleBook = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const bookingDat = {
        ShowId: params.listingId,
        userId : await currentUser._id,
        email : await currentUser.email,
        ShowName : await listing.name,
        username : await currentUser.username,
      }
      

      const res = await fetch(`/api/listing/book`,
      {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingDat)
      });

      const data = await res.json();

      if(data.success === false){
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null); //here also if everything is fine set error to null
      navigate('/booked-ticket')
      console.log(data);
    } 
    catch(error){
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - Rs.{' '}
              {listing.regularPrice.toLocaleString('en-US')}
              {' per person'}
            </p>
            <p className='flex items-center gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                For Sale
              </p>
          
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
    
            {currentUser && listing.userRef !== currentUser._id && !contact && (

                <button 
                  className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                  onClick={handleBook}
                >
                  Book Ticket
                </button>
            
            )}
            
          </div>
        </div>
      )}
    </main>
  );
}