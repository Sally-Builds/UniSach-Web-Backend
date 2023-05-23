import slugify from 'slugify';
import Drug from '../interfaces/drug.interface'
import { Schema, model } from 'mongoose'

const drugSchema = new Schema<Drug>({
    name: {
        type: String,
        required: [true, 'Enter name of drug.']
    },
    price: Number,
    slug: String,
    amount: Number,
    description: String,
    category: String,
    pharmacy: {
        type: String,
        ref: "PharmacyModel",
        required: [true, "This Drug must belong to a Pharmacy"]
    },
    images: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
})

drugSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

export default model('Drugs', drugSchema)