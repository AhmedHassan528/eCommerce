export interface IProduct {
    Id: number
    numSold: number
    ratingsQuantity: number
    title: string
    description: string
    quantity: number
    price: number
    imageCover: string
    images: string
    categoryID: number
    category: Category
    brandID: number
    brand: Brand
}

export interface Category {
    id?: number
    name?: string
    image?: string
    tenantId?: string
}

export interface Brand {
    $id?: string
    id?: number
    name?: string
    image?: string
    tenantId?: string
}

