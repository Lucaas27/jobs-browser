import mongoose from 'mongoose';
import validator from 'validator';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter Job title.'],
      trim: true,
      maxlength: [100, 'Job title can not exceed 100 characters, got {VALUE} characters.'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please enter Job description.'],
      maxlength: [1000, 'Job description can not exceed 1000 characters, got {VALUE} characters.'],
    },
    email: {
      type: String,
      validate: [validator.isEmail, 'Please add a valid email address.'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address.'],
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      city: String,
      state: String,
      postcode: String,
      country: String,
    },
    company: {
      type: String,
      required: [true, 'Please add Company name.'],
    },
    industry: {
      type: [String],
      required: [true, 'Please enter industry for this job.'],
      enum: {
        values: [
          'Healthcare',
          'Marketing',
          'Customer Service',
          'Information Technology',
          'Manufacturing',
          'Engineering',
          'Design',
          'Hospitality',
          'Retail',
          'Finance and banking',
          'Education',
          'Telecommunications',
          'Construction',
          'Others',
        ],
        message: 'Please select correct options for industry, "{VALUE}" is not supported.',
      },
    },
    jobType: {
      type: String,
      required: [true, 'Please enter job type.'],
      enum: {
        values: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'],
        message: 'Please select correct options for job type, "{VALUE}" is not supported.',
      },
    },
    minEducation: {
      type: String,
      required: [true, 'Please enter minimum education for this job.'],
      enum: {
        values: ['GCSE', "Bachelor's Degree", "Master's Degree", 'Certificate of higher education', 'Phd'],
        message: 'Please select correct options for Education, "{VALUE}" is not supported.',
      },
    },
    positionsAvailable: {
      type: Number,
      default: 1,
    },
    experience: {
      type: String,
      required: [true, 'Please enter experience required for this job.'],
      enum: {
        values: ['No Experience', '1 Year - 2 Years', '2 Year - 5 Years', '5 Years+'],
        message: 'Please select correct options for Experience, "{VALUE}" is not supported.',
      },
    },
    salary: {
      type: Number,
      required: [true, 'Please enter expected salary for this job.'],
    },
    deadline: {
      type: Date,
      default: new Date().setDate(new Date().getDate() + 7),
    },
    applicantsApplied: {
      type: Object,
      select: false,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
