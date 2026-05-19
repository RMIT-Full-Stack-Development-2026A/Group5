export const registerDto = (body) =>  ({
    username: body.username,
    email: body.email?.trim(),
    password: body.password,
    confirmPassword: body.confirmPassword,
    country: body.country

})


export const loginDto = (body) => ({
    identifier: body.identifier?.trim().toLowerCase(),
    password: body.password
})