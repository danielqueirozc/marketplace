export interface UserSession {
  valid: boolean
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    status: string
  } | null
}

export interface Login {
  email: string
  password: string
}