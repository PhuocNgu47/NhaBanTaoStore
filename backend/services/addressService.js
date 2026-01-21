/**
 * Address Service
 * Chứa logic nghiệp vụ cho addresses: CRUD, set default
 */

import Address from '../models/Address.js';

/**
 * Lấy danh sách addresses của user
 */
export const getUserAddresses = async (userId) => {
  const addresses = await Address.find({ userId })
    .sort({ isDefault: -1, createdAt: -1 });
  return addresses;
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

  return address;
};

/**
 * Tạo address mới
 */
export const createAddress = async (userId, addressData) => {
  const { name, phone, address, ward, district, city, country, zipCode, isDefault, label } = addressData;

  // Validation
  if (!name || !phone || !address || !city) {
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
    address: address.trim(),
    ward: ward?.trim() || '',
    district: district?.trim() || '',
    city: city.trim(),
    country: country?.trim() || 'Vietnam',
    zipCode: zipCode?.trim() || '',
    isDefault: isDefault || false,
    label: label?.trim() || 'Nhà riêng'
  });

  await newAddress.save();

  return newAddress;
};

/**
 * Cập nhật address
 */
export const updateAddress = async (addressId, userId, updateData) => {
  const { name, phone, address, ward, district, city, country, zipCode, isDefault, label } = updateData;

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

  // Update fields
  if (name) addressDoc.name = name.trim();
  if (address) addressDoc.address = address.trim();
  if (ward !== undefined) addressDoc.ward = ward?.trim() || '';
  if (district !== undefined) addressDoc.district = district?.trim() || '';
  if (city) addressDoc.city = city.trim();
  if (country) addressDoc.country = country.trim();
  if (zipCode !== undefined) addressDoc.zipCode = zipCode?.trim() || '';
  if (label) addressDoc.label = label.trim();

  await addressDoc.save();

  return addressDoc;
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

  return address;
};

