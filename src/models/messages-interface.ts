export interface MessagesInterface {
  id: number
  jobSeekerId: number
  jobProviderId: number
  jobSeeker: JobSeeker | null
  jobProvider: JobProvider | null
  content: string
  userName: string
  dateTime: string
}

export interface JobSeeker {
  id: number
  userFName: string
  userLName: string
  userName: string
  address: any
  premium: boolean
  university: string
  college: string
  wallet: any
  birthDate: string
  photo: string
  currentYear: number
  status: string
  skills: any[]
}

export interface JobProvider {
  id: number
  companyName: string
  location: string
  premium: boolean
  companySize: string
  noOfEmployees: number
  category: string
  webSite: string
  logo: string
  description: string
  wallet: any
}
