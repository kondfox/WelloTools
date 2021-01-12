export const onStartup = async appContext => {
  try {
    await appContext.userRepository.save({
      email: 'admin@admin.com',
      name: 'Admin',
      role: 'ADMIN',
      password: await appContext.encoder.encode('password'),
    })
    await appContext.userRepository.save({
      email: 'johndoe@domain.com',
      name: 'John Doe',
      password: await appContext.encoder.encode('password'),
    })
    await appContext.userRepository.save({
      email: 'janedoe@domain.com',
      name: 'Jane Doe',
      password: await appContext.encoder.encode('password'),
    })
  } catch (err) {}
}
