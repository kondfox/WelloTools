export const exampleUserId = '5ff8aff14fa9e8344c7e9143'

export const validUserInput = {
  email: 'email@domain.com',
  password: 'password',
  name: 'John Doe',
}

export const exampleUser = {
  _id: '6000a45e83826d142d7682d2',
  email: 'email@domain.com',
  password: '$2b$10$3y6X.uPus55qA6RXnP9JbuMhzewWkNIsMLw68/EFMQflY6KxSYK7m',
  avatar: 'http://localhost:3000/avatars/6000a45e83826d142d7682d2.jpg',
  name: 'John Doe',
}

export const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMDBhNDVlODM4MjZkMTQyZDc2ODJkMiIsImlhdCI6MTYxMDY1NDkwMiwiZXhwIjo0NzY0MjU0OTAyfQ.32-LiY1jZtdFABP7BDaSdkFyfohzI49zuUSQG1iS15k'

export const adminToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMDBhNTdiNmVhOWQ4MTRlOGZkYTM0ZSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYxMDY1NTEwNiwiZXhwIjo0NzY0MjU1MTA2fQ.CZR9d4N_FYGVpjqj-v2kwjSFyn40i0PBNPiQJAdAux4'

export const exampleAdminUser = {
  _id: '6000a57b6ea9d814e8fda34e',
  email: 'admin@domain.com',
  password: '$2b$10$3y6X.uPus55qA6RXnP9JbuMhzewWkNIsMLw68/EFMQflY6KxSYK7m',
  avatar: 'http://localhost:3000/avatars/6000a57b6ea9d814e8fda34e.jpg',
  name: 'Admin',
  role: 'ADMIN',
}

export const validationErrors = {
  name: ["shouldn't be empty"],
  password: ['should be minimum 8 long'],
  email: ['invalid email format'],
}
