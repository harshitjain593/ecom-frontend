import React, { useEffect, useRef, useState } from "react";
import { FaMinusCircle, FaStar } from "react-icons/fa";
import './Reviews.css'
import { sendReview } from "../../action/ReviewActions";
import { useFetcher, useNavigate, useParams } from "react-router-dom";
import { MdVerifiedUser } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails } from "../../action/productdetailaction";

const ReviewandRatingsPage = () => {
  const [reviewForm, setReviewForm] = useState({
    reviewTitle: '',
    reviewDescription: '',
    rating: 0,
   images: []
  });
  const {id} = useParams()
   const uploadLimitRef = useRef()
  const [uploadedImages, setUploadedImages] = useState([]);
  const [inputError,setInputError] = useState([])
  const [direct,setDirect] = useState(false) 
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const product = useSelector(state=>state.productDetails.product)
  useEffect(()=>{
    dispatch(getProductDetails(id))
  },[dispatch])
 
  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if(name==='reviewDescription' && value!==''){
      document.getElementById('titleArea').style.color='#0d7eee'
    }else{
      document.getElementById('titleArea').style.color='black'
    }

    if(name==='reviewTitle' && value!==''){
      
     document.getElementById('reviewTitle').style.color='#0d7eee'
    }else{
         document.getElementById('reviewTitle').style.color='#000'
    }
    setReviewForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  // Handle rating change
  const handleRatingChange = (e) => {
    setReviewForm(prevForm => ({
      ...prevForm,
      rating: parseInt(e.target.value)
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(uploadedImages.length < 3){
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedImages(prevImages => [...prevImages, reader.result]);
        };
        reader.readAsDataURL(file);
        setReviewForm(prevForm => ({
          ...prevForm,
         images: [...prevForm.images, file]
        }));
      }
    }else{
      uploadLimitRef.current.innerText='Your reached maximum upload limit'

    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };

  // Handle remove image
  const handleRemoveImage = (index) => {
    uploadLimitRef.current.innerText=''
    setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
    setReviewForm(prevForm => ({
      ...prevForm,
     images: prevForm.images.filter((_, i) => i !== index)
    }));
  };

  // Handle form submit
  const handleSubmit = async(e) => {
    console.log(reviewForm,'testing the image view in console')
    if(reviewForm.rating ===0 || reviewForm.reviewDescription==='' ){
      setInputError(['please fill the input fields'])

    }else{
      setInputError([])
      const response = await sendReview(id, reviewForm)
      if(response){
        setReviewForm({
          reviewTitle: '',
          reviewDescription: '',
          rating: 0,
         images: []
        })
        setUploadedImages([]);
        setDirect(true)
        setTimeout(() => {
          navigate('/')
        }, 3000);
      }else{
        alert('failed')
      }

    }
  
    e.preventDefault();
     
  };

  if(direct){
      return (
        <>
        <div className="d-flex flex-column justify-content-center align-items-center mx-auto " style={{margin:'10% 0' ,fontSize:'1.3rem' ,fontWeight:600}}>
        <div>
          Thank you for your Valuable Feedback <MdVerifiedUser color="green" size={30}/>
        </div>
          <p style={{fontSize:'.7rem'} }>you will be redirected shortly</p>
        </div>
        </>
      )
  }
 


  return (
    <section className="px-10 py-4">
      {product &&
      <main className="rev-productbox d-flex px-4 py-2 gap-4">
        <div>
          <img src={product.productImage} alt="Product" />
        </div>
        <div className="rev-productTextbox">
          <label>{product.product_name}</label>
          <p>{product.category}</p>
          <div className="rating-cont">
            <FaStar color="white" /> <span>{product.averageRating}</span>
          </div>
        </div>
      </main>
      }
      <main className="rating-sec">
        <div className="form-area-review d-flex flex-column gap-2">
          <div className="ratebox">
            <h4>Rate Product</h4>
            <div className="rate d-block justify-self-start">
              <input type="radio" id="star5" name="rate" value="5" onChange={handleRatingChange} />
              <label htmlFor="star5" title="5 stars">5 stars</label>
              <input type="radio" id="star4" name="rate" value="4" onChange={handleRatingChange} />
              <label htmlFor="star4" title="4 stars">4 stars</label>
              <input type="radio" id="star3" name="rate" value="3" onChange={handleRatingChange} />
              <label htmlFor="star3" title="3 stars">3 stars</label>
              <input type="radio" id="star2" name="rate" value="2" onChange={handleRatingChange} />
              <label htmlFor="star2" title="2 stars">2 stars</label>
              <input type="radio" id="star1" name="rate" value="1" onChange={handleRatingChange} />
              <label htmlFor="star1" title="1 star">1 star</label>
            </div>
          </div>
          <div>
            <h4>Review this Product</h4>
            <main className="text-area-cont">
              <div className="d-flex px-4 justify-content-between py-2 text-heading-area">
                <label htmlFor="" id="titleArea">Description</label>
                {reviewForm.reviewDescription === '' ? (
                    <label htmlFor="" id="empty">Cannot be empty</label>
                  ) : (
                    <label htmlFor="" id="empty"></label>
                  )}

              </div>
              <textarea
                name="reviewDescription"
                placeholder="Description...."
                id=""
                className="px-4"
                style={{ padding: 0 }}
                value={reviewForm.reviewDescription}
                onChange={handleInputChange}
              ></textarea>
              <div className="ratetitle-cont px-4">
                <label htmlFor="" id="reviewTitle" style={{ fontSize: '.85rem', fontWeight: 500 }}>Title (optional)</label>
                <input
                  type="text"
                  name="reviewTitle"
                  placeholder="Review title..."
                  style={{ fontSize: '.9rem' }}
                  value={reviewForm.reviewTitle}
                  onChange={handleInputChange}
                />
              </div>
            </main>
            <div className="mt-5 add-photo-cont px-4 d-flex gap-4">
              <div className="">
                <input
                  type="file"
                  id="fileInput"
                  className="hidden-input"
                  onChange={handleFileChange}
                />
                <img
                  src="https://icon-library.com/images/add-photo-icon/add-photo-icon-19.jpg"
                  alt="AddPhoto"
                  onClick={triggerFileInput}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div className="d-flex align-items-center gap-2 uploaded-images position-relative">
                {uploadedImages.map((item, index) => (
                  <div key={index} className="position-relative">
                    <img src={item} alt="Uploaded" className="uploaded-img" />
                    <FaMinusCircle
                      color="red"
                      size={25}
                      className="position-absolute translate-middle-x"
                      style={{ left: '50%', top: '50%', cursor: 'pointer' }}
                      onClick={() => handleRemoveImage(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
                <p id="uploadLimit " className="px-4" style={{color:'red', display:'block' ,fontWeight:400}} ref={uploadLimitRef}></p>
                <p id="uploadLimit " className="px-4" style={{color:'red', display:'block' ,fontWeight:400}} >
                  {inputError&& inputError[0]}
                </p>

            <div className='submit-rate-button-cont d-flex justify-content-end'>
              <button className="submit-rate-button" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default ReviewandRatingsPage;
