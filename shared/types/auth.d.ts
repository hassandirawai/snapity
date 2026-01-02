// shared/types/auth.d.ts
declare module '#auth-utils' {
  interface User extends UserType {
    // Add your own fields
  }

  interface UserSession {
    // Add your own fields
    lastLogin: Date
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export { }
