// Type definitions for the dashboard data

export interface CaseData {
  lat: number
  lng: number
  location: string
  cases: number
  date: string
}

export interface SocialData {
  lat: number
  lng: number
  location: string
  volume: number
  sentiment: number
  keywords: string[]
  date: string
}

export interface VaccineData {
  lat: number
  lng: number
  location: string
  rate: number
  hesitancyMentions: number
}

export interface TimelineDataPoint {
  date: Date
  percentage: number
}
