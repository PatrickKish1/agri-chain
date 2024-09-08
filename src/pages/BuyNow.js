import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import addIcon from '../assets/add.svg'; // Path to add icon
import dashIcon from '../assets/dash.svg'; // Path to dash icon
import backArrow from '../assets/back-arrow.svg'; // Path to back arrow icon
import { useWallet } from '../context/Context';
import Loading from '../components/Loading'

const BuyNow = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [convertedPrice, setConvertedPrice] = useState(null); 
  const navigate = useNavigate();
  const {
    requestPurchase,
    getProduceById,
    getETHinNaira,
    account,
    sendGiftcard,
    userBonus,
    generatePic,
  } = useWallet();

  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch product data on component mount
    const fetchProduce = async () => {
      setIsLoading(true);
      try {
        const productData = await getProduceById(productId);
        setProduct(productData);
        if (productData.imageUrl && productData.imageUrl.length > 0) {
          setSelectedImage(productData.imageUrl[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setIsLoading(false);
    };

    fetchProduce();
  }, [getProduceById, productId]);

  
  useEffect(() => {
    const convertPrice = async () => {
      if (product && product.price) {
        try {
          const priceInNaira = await getETHinNaira(product.price);
          setConvertedPrice(priceInNaira);
        } catch (error) {
          console.error("Error converting ETH to Naira:", error);
        }
      }
    };

    convertPrice();
  }, [getETHinNaira, product]);

  const handlePurchase = async (produceId, quantity, price) => {
    console.log(produceId,quantity, price)
    if (quantity > 10) {
      try{ const uri = await generatePic(account, 'Aeroplane by the beach');
       await userBonus('2');
       await sendGiftcard(account, uri);
      }catch(err){
       console.trace(err)
      }
     }
    // eslint-disable-next-line no-undef
    const finalPrice = BigInt((price * 10 ** 18).toFixed(0));
    await requestPurchase(produceId, quantity, finalPrice.toString() );
  
  };

  const handleQuantityChange = (value) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + value));
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleBackClick = () => {
    navigate('/products');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loading />
      </div>
    );
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found.</div>;
  }

  return (
    <div className="container mx-auto bg-white px-4 py-8 relative">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="absolute top-4 left-8 flex items-center bg-white p-2 rounded-lg shadow-md"
      >
        <img src={backArrow} alt="Back" className="w-6 h-6" />
        <span className="ml-2 text-lg font-semibold">Back</span>
      </button>

      <div className="flex flex-col md:flex-row mt-[100px] ">
        {/* Image Thumbnails */}
        <div className="flex flex-col items-center md:mr-8">
          <div className="space-y-4 ml-[70px]">
            {product.imageUrl.map((image, index) => (
              <div
                key={index}
                className={`w-20 h-20 p-1 rounded-lg cursor-pointer border ${
                  selectedImage === image ? 'border-[#ff0909] border-2' : 'opacity-50'
                }`}
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Image */}
        <div className="flex-1">
          <div className="flex justify-center items-center">
            <div className="w-[320px] h-[300px] p-1 rounded-lg border-2 border-[#ff0909]">
              <img
                src={selectedImage}
                alt="Selected Produce"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 ml-6">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-2">Farmer: {product.farmer}</p>
          <p className="text-gray-600 mb-2">Company: {product.company}</p>

          {/* Conditionally render price */}
          <p className="text-gray-800 mb-4">
            Rate: {convertedPrice ? `₦${convertedPrice.toLocaleString()}` : 'Loading price...'}
          </p>

          <p className="text-gray-500 mb-6">{product.description}</p>

          <div className="flex items-center mb-4">
            <label htmlFor="quantity" className="mr-4">Quantity:</label>
            <button
              onClick={() => handleQuantityChange(-1)}
              className="bg-gray-300 rounded-md p-2"
            >
              <img src={dashIcon} alt="Decrease Quantity" width={15} height={15} />
            </button>
            <input
              type="text"
              id="quantity"
              value={quantity}
              readOnly
              className="text-center bg-white mb-2 w-12 border mx-2 rounded-md p-2"
            />
            <button
              onClick={() => handleQuantityChange(1)}
              className="bg-gray-300 rounded-md p-2"
            >
              <img src={addIcon} alt="Increase Quantity" width={15} height={15} />
            </button>
          </div>

          <button
            className="bg-green-500 text-white px-6 py-2 mb-[100px] rounded-md"
            onClick={() => handlePurchase(product.produceId, quantity, product.price)}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyNow;
