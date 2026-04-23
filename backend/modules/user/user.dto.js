// Profile page receives user info and match history
// never expose passwordHash or walletBalance
export const toPublicUserDTO = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    country: user.country,
    role: user.role,
    isActive: user.isActive,
    avatarUrl: user.avatarUrl, // null or "/uploads/avatars/filename"
    createdAt: user.createdAt,
});

// For admin dashboard
// includes walletBalance but not passwordHash
export const toAdminUserDTO = (user) => ({
    ...toPublicUserDTO(user),
    lockUntil: user.lockUntil,
    failedLoginAttempts: user.failedLoginAttempts,
});