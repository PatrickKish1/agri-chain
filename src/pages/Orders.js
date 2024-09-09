import React, { useState, useEffect } from 'react';
import Notification from '../components/Notification';
import Loading from '../components/Loading'; // Import Loading component
import addPlusIcon from '../assets/add-plus.svg';
import { useWallet } from "../context/Context"; // Assuming this context provides wallet-related functions
import back from '../assets/back-arrow.svg' 

function Orders() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [notification, setNotification] = useState('');
  const [step, setStep] = useState(1); // For multi-step form

  const { getAllProduce } = useWallet(); // Fetch produce using wallet context

  // Fetch products from the wallet context
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const produce = await getAllProduce();
        setProducts(produce);
      } catch (error) {
        setNotification('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [getAllProduce]);

  // Handle file uploads for images
  const handleImageUpload = (event) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles.length < 3) {
      setNotification('Please upload at least 3 images.');
      return;
    }
    const imageURLs = Array.from(uploadedFiles).map(file => URL.createObjectURL(file));
    setImages(imageURLs);
  };

  // Handle confirmation order button click (move to step 2 after loading)
  const handleConfirmOrder = () => {
    setStep(2);
  };

  // Handle back button click
  const handleBackButtonClick = () => {
    setStep(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Notification Component */}
      {notification && <Notification message={notification} />}

      {/* Display product cards */}
      {step === 1 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-[100px] mb-[150px]">
          {products.map(product => (
            <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={product.imageUrl[0]} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-900 font-bold">Price: {product.price}</p>
                <button
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
                  onClick={handleConfirmOrder}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Image upload form */}
      {step === 2 && (
        <div className="relative">
          <button
            onClick={handleBackButtonClick}
            className="absolute top-[-140px] left-4 p-2 bg-gray-300 rounded-full shadow-md hover:bg-gray-400"
          >
            <img src={back} alt="Back" className="w-6 h-6" />
          </button>
          <div className="mt-[150px] mx-auto max-w-lg mb-[160px] bg-gray-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Upload Product Images</h2>
            <label className="block cursor-pointer bg-gray-200 rounded-lg p-4 text-center shadow hover:bg-gray-300">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <img src={addPlusIcon} alt="Add Plus" className="mx-auto w-12 h-12" />
              <p className="mt-2 text-gray-700">Choose files</p>
            </label>
            <div className="grid gap-4 mt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {images.length >= 3 && images.map((image, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <img src={image} alt={`Uploaded ${index + 1}`} className="w-full h-32 object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
