/**
 * Address Service
 * Chứa logic nghiệp vụ cho addresses: CRUD, set default
 */

import Address from '../models/Address.js';

/**
 * Helper function to ensure backward compatibility - populate addressLine1 from address if missing
 */
const normalizeAddress = (address) => {
  if (!address) return address;
  
  // Convert to plain object if it's a Mongoose document
  const addressObj = address.toObject ? address.toObject() : address;
  
  // If addressLine1 is missing but address exists, use address
  if (!addressObj.addressLine1 && addressObj.address) {
    addressObj.addressLine1 = addressObj.address;
  }
  
  // Ensure addressLine2 exists
  if (!addressObj.addressLine2) {
    addressObj.addressLine2 = '';
  }
  
  return addressObj;
};

/**
 * Lấy danh sách addresses của user
 */
export const getUserAddresses = async (userId) => {
  const addresses = await Address.find({ userId })
    .sort({ isDefault: -1, createdAt: -1 });
  
  // Normalize addresses for backward compatibility
  return addresses.map(normalizeAddress);
};

/**
 * Lấy chi tiết một address
 */
export const getAddressById = async (addressId, userId) => {
  const address = await Address.findOne({
    _id: addressId,
    userId
  });

  if (!address) {
    throw new Error('Không tìm thấy địa chỉ');
  }

  return normalizeAddress(address);
};

/**
 * Tạo address mới
 */
export const createAddress = async (userId, addressData) => {
  const { name, phone, address, addressLine1, addressLine2, ward, district, city, country, zipCode, isDefault, label } = addressData;

  // Validation - support both old format (address) and new format (addressLine1)
  const addressValue = addressLine1 || address;
  if (!name || !phone || !addressValue || !city) {
    throw new Error('Vui lòng điền đầy đủ thông tin: tên, số điện thoại, địa chỉ, thành phố');
  }

  // Validate phone
  const phoneRegex = /^(0|\+84)[1-9][0-9]{8,9}$/;
  const cleanPhone = phone.replace(/\s/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    throw new Error('Số điện thoại không hợp lệ');
  }

  // If setting as default, unset other defaults
  if (isDefault) {
    await Address.updateMany(
      { userId },
      { $set: { isDefault: false } }
    );
  }

  const newAddress = new Address({
    userId,
    name: name.trim(),
    phone: cleanPhone,
    address: addressValue.trim(), // Keep for backward compatibility
    addressLine1: addressLine1?.trim() || addressValue.trim(),
    addressLine2: addressLine2?.trim() || '',
    ward: ward?.trim() || '',
    district: district?.trim() || '',
    city: city.trim(),
    country: country?.trim() || 'Vietnam',
    zipCode: zipCode?.trim() || '',
    isDefault: isDefault || false,
    label: label?.trim() || 'Nhà riêng'
  });

  await newAddress.save();

  return normalizeAddress(newAddress);
};

/**
 * Cập nhật address
 */
export const updateAddress = async (addressId, userId, updateData) => {
  const { name, phone, address, addressLine1, addressLine2, ward, district, city, country, zipCode, isDefault, label } = updateData;

  const addressDoc = await Address.findOne({
    _id: addressId,
    userId
  });

  if (!addressDoc) {
    throw new Error('Không tìm thấy địa chỉ');
  }

  // Validate phone if provided
  if (phone) {
    const phoneRegex = /^(0|\+84)[1-9][0-9]{8,9}$/;
    const cleanPhone = phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      throw new Error('Số điện thoại không hợp lệ');
    }
    addressDoc.phone = cleanPhone;
  }

  // If setting as default, unset other defaults
  if (isDefault && !addressDoc.isDefault) {
    await Address.updateMany(
      { userId, _id: { $ne: addressId } },
      { $set: { isDefault: false } }
    );
    addressDoc.isDefault = true;
  }

  // Update fields - support both old format (address) and new format (addressLine1)
  if (name) addressDoc.name = name.trim();
  if (addressLine1 !== undefined) {
    addressDoc.addressLine1 = addressLine1.trim();
    addressDoc.address = addressLine1.trim(); // Keep for backward compatibility
  } else if (address !== undefined) {
    addressDoc.address = address.trim();
    if (!addressDoc.addressLine1) {
      addressDoc.addressLine1 = address.trim();
    }
  }
  if (addressLine2 !== undefined) addressDoc.addressLine2 = addressLine2?.trim() || '';
  if (ward !== undefined) addressDoc.ward = ward?.trim() || '';
  if (district !== undefined) addressDoc.district = district?.trim() || '';
  if (city) addressDoc.city = city.trim();
  if (country) addressDoc.country = country.trim();
  if (zipCode !== undefined) addressDoc.zipCode = zipCode?.trim() || '';
  if (label) addressDoc.label = label.trim();

  await addressDoc.save();

  return normalizeAddress(addressDoc);
};

/**
 * Xóa address
 */
export const deleteAddress = async (addressId, userId) => {
  const address = await Address.findOneAndDelete({
    _id: addressId,
    userId
  });

  if (!address) {
    throw new Error('Không tìm thấy địa chỉ');
  }

  return address;
};

/**
 * Đặt address làm mặc định
 */
export const setDefaultAddress = async (addressId, userId) => {
  const address = await Address.findOne({
    _id: addressId,
    userId
  });

  if (!address) {
    throw new Error('Không tìm thấy địa chỉ');
  }

  // Unset other defaults
  await Address.updateMany(
    { userId, _id: { $ne: addressId } },
    { $set: { isDefault: false } }
  );

  // Set this as default
  address.isDefault = true;
  await address.save();

  return normalizeAddress(address);
};

