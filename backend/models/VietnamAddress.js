/**
 * Vietnam Address Model
 * Lưu dữ liệu địa chỉ Việt Nam (Tỉnh/Thành, Quận/Huyện, Phường/Xã)
 */

import mongoose from 'mongoose';

const provinceSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameEn: String,
  fullName: String,
  fullNameEn: String,
  codeName: String,
  administrativeUnit: String, // Tỉnh hoặc Thành phố Trung ương
  administrativeRegion: String // Vùng
}, { timestamps: false });

const districtSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameEn: String,
  fullName: String,
  fullNameEn: String,
  codeName: String,
  administrativeUnit: String, // Quận, Huyện, Thị xã, Thành phố
  provinceCode: { type: String, required: true, index: true },
  provinceName: String
}, { timestamps: false });

const wardSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameEn: String,
  fullName: String,
  fullNameEn: String,
  codeName: String,
  administrativeUnit: String, // Phường, Xã, Thị trấn
  districtCode: { type: String, required: true, index: true },
  districtName: String,
  provinceCode: { type: String, required: true, index: true },
  provinceName: String
}, { timestamps: false });

// Indexes
provinceSchema.index({ code: 1 });
districtSchema.index({ provinceCode: 1, code: 1 });
wardSchema.index({ districtCode: 1, code: 1 });
wardSchema.index({ provinceCode: 1 });

export const Province = mongoose.model('Province', provinceSchema);
export const District = mongoose.model('District', districtSchema);
export const Ward = mongoose.model('Ward', wardSchema);

