// Run using: npx ts-node src/scripts/create-admin.ts
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'manager', 'hr', 'owner'], default: 'employee' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

(async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('❌ Set MONGO_URI in .env file');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Defaults (you can override these from .env)
    const name = process.env.INIT_ADMIN_NAME || 'Owner';
    const email = process.env.INIT_ADMIN_EMAIL || 'owner@example.com';
    const password = process.env.INIT_ADMIN_PASSWORD || 'Strong@123';
    const role = process.env.INIT_ADMIN_ROLE || 'owner';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('⚠️ Admin already exists with this email:', existing.email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);                                                                                                                                          
    const newUser = await User.create({ name, email, password: hashed, role });

    console.log('✅ Admin user created successfully!');
    console.log('👤 Name:', newUser.name);
    console.log('📧 Email:', newUser.email);
    console.log('🔑 Role:', newUser.role);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
})();
