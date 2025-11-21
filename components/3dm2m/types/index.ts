export interface NodeObject {
  id: string
  label: string
  type: string
  cluster?: string
  parent?: string
  isHighlighted?: boolean
}

export interface LinkObject {
  source: string
  target: string
}
