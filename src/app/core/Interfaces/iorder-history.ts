export interface IorderHostory {
  Id: number
  CartId: number
  TotalAmount: number
  status: boolean
  statusMess: string
  paymentMethodType: string
  CustomerName: string
  AddressId: number
  AddressName: string
  City: string
  Address: string
  PhoneNumber: string
  Items: Items
  OrderDate: string
  // Tracking information
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  assignedTo?: string
  lastTrackingUpdate?: string
  currentLocation?: string
  trackingNotes?: string
}

export interface Items {
  $values: Value2[]
}
export interface Value2 {
  Id: number
  OrderId: number
  Count: number
  Price: number
  ProductId: number
  ProductName: string
  ProductImage: string
  ProductDescription: string
  Category: string
  Brand: string
  CategoryId?: number
  BrandId?: number
}
