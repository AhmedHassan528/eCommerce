export interface IProduct {
  Id: number
  NumSold: number
  LikeCount: number
  RatingsQuantity: number
  Title: string
  Description: string
  Price: number
  CategoryName: string
  BrandName: string
  ViewCount: number
  ImageCover: string
  Images: Images
  Category: Category
  Brand: Brand
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
export interface Images {
    $values: string[]
}

