export interface IWishList {
    Id: number
    NumSold: number
    RatingsQuantity: number
    Title: string
    Description: string
    Price: number
    ImageCover: string
    Images: Images
    CategoryName: string
    BrandName: string
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
  $id: string
  Id: number
  Name: string
  Image: string
}
