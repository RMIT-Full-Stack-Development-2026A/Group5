// Public profile
export const toPublicUserDTO = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email,
    country: user.country,
    role: user.role,
    isActive: user.isActive,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt
});

// For admin dashboard
export const toAdminUserDTO = (user) => ({
    ...toPublicUserDTO(user),
    lockUntil: user.lockUntil,
    failedLoginAttempts: user.failedLoginAttempts
});
