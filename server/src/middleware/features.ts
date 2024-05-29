import { myCache } from "../app.js"
import { Order } from "../models/OrderModel.js"
import { Product } from "../models/ProductModel.js"
import { InvalidateCacheType, OrderItemTypes } from "../types/types.js"

export const InvalidateCache = async ({
    product,
    order,
    admin,
    userId,
    orderId,
    productId
}: InvalidateCacheType) => {

    if (product) {
        const productKey: string[] = [
            "latest-product",
            "category",
            "allProductCache",
            `product-${productId}`
        ]

        myCache.del(productKey);
    }

    if (order) {
        const orderKey: string[] = [
            "allOrders",
            `myOrder${userId}`,
            `order_${orderId}`,
        ]
        // const getorderkeys = (await Order.find().select("_id" && "user"));

        // getorderkeys.forEach((i) => {
        //     orderKey.push(`order_${i._id}`)
        // })

        myCache.del(orderKey);
    }

    if (admin) {
        myCache.del([
            "Get-Stats1",
            "Get-Chart",
            "Get-Bar-Chart",
            "Get-Line",
        ])
    }
}

export const reduceStock = async (orderItems: OrderItemTypes[]) => {

    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);

        if (!product) throw new Error("product Not Found")
        product.stock -= order.quantity;
        await product.save();
    }
}

//(( ThisMonth = Final Value - LastMonth = Inicial value) / LastMonth = Inicial value ) * 100
export const CalPercentage = (ThisMonth: number, LastMonth: number) => {
    if (LastMonth === 0) return ThisMonth * 100;
    const Percentage = (ThisMonth / LastMonth) * 100;
    return Percentage.toFixed(2);
}

// category count

export const CategoriesCount = async (
    { Categories, ProductCount }: { Categories: string[], ProductCount: number }) => {

    const cate = Categories.map((category) => Product.countDocuments({ category: category }))
    const CategoriesCount = await Promise.all(cate)

    const categoryCount = new Array();

    Categories.forEach((category, i) => {
        categoryCount.push({
            [category]: ((CategoriesCount[i] / ProductCount) * 100).toFixed(2),
        })
    })

    return categoryCount
}

interface MyDocument extends Document {
    createdAt: Date;
    discount?: number;
    total?: number;
}

export type GetChartProp = {
    length: number;
    docArr: MyDocument[];
    today: Date;
    property?: string;
}

export const GetChartData = ({ length, docArr, today, property }: GetChartProp ) => {
    const data: number[] = new Array(length).fill(0);

    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

        if (monthDiff < length) {
            data[length - monthDiff - 1] += property ==="discount" ? i.discount! : property === "total" ? i.total! : 1;
        }
    })

    return data;
}