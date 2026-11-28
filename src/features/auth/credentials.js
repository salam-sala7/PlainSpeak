export function authenticateWithEmail(auth, credentials, registrationName) {
  if (registrationName !== undefined) {
    return auth.signUp({
      ...credentials,
      options: { data: { username: registrationName } },
    })
  }
  return auth.signInWithPassword(credentials)
}
