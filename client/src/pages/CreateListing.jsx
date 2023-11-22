import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const navigate = useNavigate();
    const {currentUser} = useSelector(state => state.user);
    const [files,setFiles] = useState([]);
    const [formData,setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        regularPrice: 50,
        time: '0:00',
    });

    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading,setUploading] = useState(false);
    const [error,setError] = useState(false);
    const [loading,setLoading] = useState(false);


    console.log(formData);
    


    const handleImageSubmit = (e) => {
        e.preventDefault();
        if (0 < files.length && files.length + formData.imageUrls.length  < 7 ){
            //we create it to check weather each image is uploaded or not
            const promises = [];
            setUploading(true);
            setImageUploadError(false);
            for(let i=0;i<files.length;i++){
                promises.push(storeImage(files[i]));
            }
            
            //we use all coz we have to wait for all of them
            Promise.all(promises).then((urls) => {
                setFormData({...formData, 
                    imageUrls: formData.imageUrls.concat(urls)
                });
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) =>{
                setImageUploadError('Image upload failed (2 mb max per image');
                setUploading(false);
            })
        }
        else{
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                //skip checking the progress
                (snapshot) => {
                    const progress = 
                        (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            );
        });
    };


    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_,i) => 
            i !== index),
        });
    };

    const handelChange = (e) => {
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            if(formData.imageUrls.length < 1) return setError('You must upload atleast one image');
            if(+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');
            setLoading(true);
            setError(false);

            const res = await fetch('/api/listing/create',{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            setLoading(false);
            if (data.success === false){
                setError(data.message);
            }

            navigate(`/listing/${data._id}`)

        } catch(error){
            setError(error.message);
            setLoading(false);
        }
    }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold 
        text-center my-7'>
            Create a Listing
        </h1>

        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                
                <input type="text" placeholder='Name' id='name' 
                maxLength={62} minLength={10} required 
                className='border p-3 rounded-lg' 
                onChange={handelChange} value = {formData.name}/>

                <textarea type="text" placeholder='Description' id='description' 
                required 
                className='border p-3 rounded-lg' value={formData.description}
                onChange={handelChange} />
                
                <input type="text" placeholder='Address' id='address' 
                required className='border p-3 rounded-lg'
                value={formData.address} onChange={handelChange}/>

                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 
                        rounded-lg' type="text" id='time' required 
                        onChange={handelChange} 
                        value={formData.time} placeholder='Time in 12-hour clock'/>
                        <p>Time</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input className='p-3 border border-gray-300 
                        rounded-lg' type="number" id='regularPrice' min='50' max='1000000' 
                        required onChange={handelChange} 
                        value={formData.regularPrice}/>
                        <div className='flex flex-col items-center'> 
                            <p>Regular Price</p>
                            <span className='text-xs'>Rupees per Peerson</span>
                        </div>
                    </div>
                </div>
            
            </div>

            <div className='flex flex-col gap-4 flex-1'>
                <p className='font-semibold'>Images:
                <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>

                <div className='flex gap-4'>
                    <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                    <button disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700
                    border-green-700 rounded 
                    uppercase hover:shadow-lg disabled:opacity-80'>
                    {uploading ? 'Uploading....' : 'Upload'}
                    </button>
                </div>
                <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) => (
                        <div key={url} className='flex p-3 
                        justify-between items-center border'>
                            <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                            <button type='button' onClick={() => handleRemoveImage(index)} className='text-red-700 p-3
                            rounded-lg uppercase hover:opacity-75'>Delete</button>
                        </div>
                    ))  
                }
                <button disabled={loading || uploading} className='p-3 rounded-lg bg-slate-700
            uppercase text-white hover:opacity-95 disabled:opacity-80'>
               {loading ? 'Creating...': 'Create Listing'}
                </button>
                {error && <p className='text-red-700 text-sm'>{error}</p>}

            </div>
        </form>
    </main>
  )
}
