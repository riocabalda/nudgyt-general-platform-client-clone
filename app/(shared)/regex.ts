const regex = {
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&-]).{8,}$/,
  min8Char: /^.{8,}$/,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  specialChar: /[@$!%*?&-]/,
  mobileNumberPh: /^(09|\+639)\d{9}$/,
  mobileNumber: /^\+(?:[0-9]●?){6,14}[0-9]$/
}

export default regex
