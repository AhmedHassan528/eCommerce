export interface ICart {
  Id: number
  CartOwner: string
  Products: Products
  TotalCartPrice: number
  CreatedAt: string
  UpdatedAt: string
  TenantId: string
}

export interface Products {
  $values: Value[]
}

export interface Value {
  Id: number
  Count: number
  Price: number
  ProductId: number
  Product: Product
  CartId: number
  TenantId: string
}

export interface Product {
  Id: number
  NumSold: number
  RatingsQuantity: number
  Title: string
  Description: string
  Price: number
  ViewCount: number
  ImageCover: string
  Images: Images
  Category: Category
  Brand: Brand
}

export interface Images {
  $values: string[]
}

export interface Category {
  Id: number
  Name: string
  Image: string
}

export interface Brand {
  Id: number
  Name: string
  Image: string
}
