// GigsList.js
import { Link } from 'react-router-dom';

// Define the GigCard component
const GigCard = ({ id, companyLogo, jobTitle, companyName, duration, rate, type }) => {
  return (
    <div className="relative w-[250px] h-[270px] bg-white rounded-lg shadow-md p-3 flex flex-col justify-between">
      {/* Job Type */}
      <div className="absolute top-2 right-[0.5px] bg-[#ff0909] text-white text-xs px-3 py-1 rounded-l-[30px]">{type}</div>

      <div className="flex items-center mb-2">
        <div className="w-[80px] h-[80px] relative mt-[50px] mr-3">
          <img src={companyLogo} alt="Company Logo" width={60} height={60} style={{ objectFit: "contain" }} />
        </div>
        <span className="text-lg mt-8 mb-[-20px] font-semibold">{jobTitle}</span>
      </div>

      <div className="flex flex-col text-gray-500 text-sm mb-2">
        <div className="flex items-center ml-[10px] mb-3">
          <img src="/assets/briefcase.svg" alt="Company" width={14} height={14} className="mr-1" />
          <span>{companyName}</span>
        </div>
        <div className="flex items-center mt-[-30px] ml-[120px]">
          <img src="/assets/calender.svg" alt="Duration" width={14} height={14} className="mr-1" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center ml-2">
          <img src="/assets/money.svg" alt="Rate" width={14} height={14} className="mr-1" />
          <span>{rate}</span>
        </div>
        <div className="flex items-center mt-[-18px] ml-[120px]">
          <img src="/assets/profile-fill.svg" alt="Rate" width={14} height={14} className="mr-1" />
          <span>{rate}</span>
        </div>
      </div>
      <Link href="/gigdetail" className="bg-[#263238] text-white px-4 py-2 rounded-md text-sm self-center text-center">
        Apply now
      </Link>
    </div>
  );
};

// Define the GigsList component
const GigsList = ({ gigs }) => {
  return (
    <div className="grid grid-cols-4 gap-[20px] mr-4 justify-items-center">
      {gigs.slice(0, 8).map((gig, index) => (
        <GigCard key={index} {...gig} />
      ))}
    </div>
  );
};

export default GigsList;
