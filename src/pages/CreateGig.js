import React, { useState } from 'react';
import Notification from '../components/Notification';
import addPlusIcon from '../assets/add-plus.svg'; // Assuming you have this icon
import next from '../assets/forward-arrow.svg';
import back from '../assets/back-arrow.svg';
import './CreateGig.css'; // Import the CSS file for the tracker
import ReactQuill from 'react-quill'; // Import ReactQuill for rich text editing
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS for styling

function CreateGig({ walletAddress, addGig }) {
  const [companyLogo, setCompanyLogo] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rate, setRate] = useState('');
  const [duration, setDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState('days'); // Default to days
  const [type, setType] = useState('');
  const [desiredCandidates, setDesiredCandidates] = useState(''); // New field for desired candidates
  const [aboutCompany, setAboutCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [kpis, setKpis] = useState('');
  const [requiredQualifications, setRequiredQualifications] = useState('');
  const [notification, setNotification] = useState('');
  const [step, setStep] = useState(1); // Track current step

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setCompanyLogo(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (step === 1) {
      if (!jobTitle || !companyName || !rate || !duration || !type || !aboutCompany || !jobDescription || !kpis || !requiredQualifications) {
        setNotification('Please fill out all fields.');
        return;
      }

      const newGig = {
        id: walletAddress, // Use walletAddress as unique ID for the user
        companyLogo,
        jobTitle,
        companyName,
        rate,
        duration: `${duration} ${durationUnit}`, // Combine duration and unit
        type,
        desiredCandidates, // Include desired candidates
        aboutCompany,
        jobDescription,
        kpis,
        requiredQualifications,
      };

      addGig(newGig);
      setNotification('Gig posted successfully!');
      resetForm();
    } else if (step === 2) {
      // Handle submission for quiz form (for now just a placeholder)
      alert('Quiz form submitted!');
    }
  };

  const resetForm = () => {
    setCompanyLogo(null);
    setJobTitle('');
    setCompanyName('');
    setRate('');
    setDuration('');
    setDurationUnit('days'); // Reset to default
    setType('');
    setDesiredCandidates('');
    setAboutCompany('');
    setJobDescription('');
    setKpis('');
    setRequiredQualifications('');
  };

  const handleNext = () => {
    if (step === 1) {
      // Transition to the next step
      setStep(2);
    }
  };

  const handlePrevious = () => {
    if (step === 2) {
      // Transition back to the previous step
      setStep(1);
    }
  };

  const handleCancel = () => {
    resetForm();
    // Redirect to /gig
    window.location.href = '/gig';
  };

  return (
    <div className="min-h-screen font-[Times New Roman] flex items-center justify-center bg-white p-6 relative">
      {/* Progress Tracker */}
      <div className="progress-tracker mt-[30px] flex justify-center items-center">
        <span className="tracker-label ml-[-30px]">Product Info</span>
        <div className={`circle ${step === 1 ? 'bg-green' : 'bg-gray-300'}`}></div>
        <div className={`line ${step === 2 ? 'bg-green' : 'bg-gray-300'}`}></div>
        <div className={`circle ${step === 2 ? 'bg-green' : 'bg-gray-300'}`}></div>
        <span className="tracker-label ml-[540px]">Buyer Details</span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 w-full mt-[90px] max-w-4xl bg-white p-8 rounded-md shadow-lg relative">
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                  Rate
                </label>
                <input
                  type="text"
                  id="rate"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border border-gray-300 rounded-l-md p-2"
                    required
                  />
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    className="border border-gray-300 rounded-r-md p-2"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <input
                  type="text"
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="desiredCandidates" className="block text-sm font-medium text-gray-700">
                  Available Quantity
                </label>
                <input
                  type="number"
                  id="desiredCandidates"
                  value={desiredCandidates}
                  onChange={(e) => setDesiredCandidates(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="companyLogo" className="block text-sm mt-[80px] font-medium text-gray-700">
                Product Image
              </label>
              <div
                className={`w-[60%] h-48 flex items-center justify-center border-2 border-gray-300 rounded-md cursor-pointer ${companyLogo ? 'bg-transparent' : 'bg-gray-200'}`}
                onClick={() => document.getElementById('companyLogo').click()}
              >
                {companyLogo ? (
                  <img src={companyLogo} alt="Company Logo" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <img src={addPlusIcon} alt="Add Plus" className="w-12 h-12" />
                )}
                <input
                  type="file"
                  id="companyLogo"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>
            <div>
              <label htmlFor="aboutCompany" className="block text-sm mt-[80px] font-medium text-gray-700">
                About the Company
              </label>
              <ReactQuill
                theme="snow"
                value={aboutCompany}
                onChange={setAboutCompany}
                className="w-full border border-gray-300 rounded-md p-2 h-70"
                required
              />
            </div>
            <div>
              <label htmlFor="jobDescription" className="block text-sm mt-[80px] font-medium text-gray-700">
                Product Description
              </label>
              <ReactQuill
                theme="snow"
                value={jobDescription}
                onChange={setJobDescription}
                className="w-full border border-gray-300 rounded-md p-2 h-70"
                required
              />
            </div>
            <div>
              <label htmlFor="kpis" className="block text-sm mt-[80px] font-medium text-gray-700">
                Contant Info
              </label>
              <ReactQuill
                theme="snow"
                value={kpis}
                onChange={setKpis}
                className="w-full border border-gray-300 mb-[120px] rounded-md p-2 h-70"
                required
              />
            </div>
            
          </>
        )}
        {step === 2 && (
          <div>
            {/* Placeholder for Quiz Form - Modify according to actual quiz form requirements */}
            <h2 className="text-lg font-medium mb-10">Buyer Details</h2>
            {/* Add your quiz form fields here */}
            <div>
              <label htmlFor="kpis" className="block text-sm font-medium text-gray-700">
                Contant Info
              </label>
              <ReactQuill
                theme="snow"
                value={kpis}
                onChange={setKpis}
                className="w-full border mb-[80px] border-gray-300 rounded-md p-2 h-70"
                required
              />
            </div>
            <div>
              <label htmlFor="kpis" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <ReactQuill
                theme="snow"
                value={kpis}
                onChange={setKpis}
                className="w-full border border-gray-300 mb-[120px] rounded-md p-2 h-70"
                required
              />
            </div>
          </div>
        )}
        <div className="flex justify-between mt-4">
          {step === 2 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              <img src={back} alt="Back" className="w-4 h-4 mr-2" />
              Previous
            </button>
          )}
          {step === 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              Next
              <img src={next} alt="Next" className="w-4 h-4 ml-2" />
            </button>
          )}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
          >
            {step === 1 ? '1️⃣' : 'Post Product'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Notification */}
      {notification && <Notification message={notification} />}
    </div>
  );
}

export default CreateGig;
