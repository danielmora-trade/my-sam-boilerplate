export class Product {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public price: number,
        public category: string,
        public stock: number,
        public createdAt: string,
        public updatedAt: string
    ) {}
}