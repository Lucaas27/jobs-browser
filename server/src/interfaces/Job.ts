import mongoose from 'mongoose';

interface IJob {
  title: string;
  slug?: string;
  description: string;
  email?: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
    formattedAddress?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  company: string;
  industry: string[];
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Temporary' | 'Internship';
  minEducation: 'GCSE' | "Bachelor's Degree" | "Master's Degree" | 'Certificate of higher education' | 'Phd';
  positions: number;
  experience: 'No Experience' | '1 Year - 2 Years' | '2 Year - 5 Years' | '5 Years+';
  salary: number;
  createdAt: Date;
  deadline: Date;
  applicantsApplied?: any[]; // You can replace `any[]` with a specific type if needed
  user: mongoose.Types.ObjectId;
}

export { IJob };
