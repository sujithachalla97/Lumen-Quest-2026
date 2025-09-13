// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  status: { type: String, enum: ['active','inactive'], default: 'active' },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

// Helper - set password
UserSchema.methods.setPassword = async function(password){
  this.passwordHash = await bcrypt.hash(password, 10);
};

// Helper - verify password
UserSchema.methods.verifyPassword = function(password){
  return bcrypt.compare(password, this.passwordHash);
};

// Return safe JSON
UserSchema.methods.toPublicJSON = function(){
  const { _id, name, phone, email, role, status, createdAt, updatedAt } = this.toObject();
  return { id:_id, name, phone, email, role, status, createdAt, updatedAt };
};

export default mongoose.model('User', UserSchema);
