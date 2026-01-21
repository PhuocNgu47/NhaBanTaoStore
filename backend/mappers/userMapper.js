/**
 * User Mapper
 * Transform data giữa database model và API response
 */

/**
 * Map User từ database sang API response (không bao gồm password)
 */
export const mapUserToResponse = (user) => {
  if (!user) return null;
  
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    city: user.city,
    country: user.country,
    role: user.role,
    createdAt: user.createdAt
  };
};

/**
 * Map User list
 */
export const mapUserList = (users) => {
  return users.map(mapUserToResponse).filter(Boolean);
};

/**
 * Map User từ request body sang database model
 */
export const mapRequestToUser = (body) => {
  return {
    name: body.name,
    email: body.email?.toLowerCase(),
    password: body.password,
    phone: body.phone,
    address: body.address,
    city: body.city,
    country: body.country || 'Vietnam'
  };
};

