export interface IUser {
  ID: string
  FirstName: string
  LastName: string
  email: string
  UserRoles: UserRoles
  PhoneNumber: any
} 
export interface UserRoles {
  $id: string
  $values: string[]
}
