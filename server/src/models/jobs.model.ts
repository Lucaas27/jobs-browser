import { geocoder } from '@/utils/geocoder';
import mongoose from 'mongoose';
import slugify from 'slugify';
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
      streetNumber: String,
      street: String,
      formattedAddress: String,
      city: String,
      state: String,
      postcode: String,
      country: String,
      countryCode: String,
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

// Pre-save middleware
// Slugify job title before saving to DB
jobSchema.pre('save', function (this: any, next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

jobSchema.pre('save', async function (this: any, next) {
  const location = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [location[0].longitude, location[0].latitude],
    streetNumber: location[0].streetNumber,
    street: location[0].streetName,
    formattedAddress: location[0].formattedAddress,
    city: location[0].city,
    state: location[0].state,
    postcode: location[0].zipcode,
    country: location[0].country,
    countryCode: location[0].countryCode,
  };

  // Don't save address provided by the user in DB - it's not necessary
  this.address = undefined;
  next();
});

export const Job = mongoose.model('Job', jobSchema);
