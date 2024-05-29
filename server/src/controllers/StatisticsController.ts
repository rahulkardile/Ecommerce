import { NextFunction, Request, Response } from "express";
import { myCache } from "../app.js";
import { Product } from "../models/ProductModel.js";
import { User } from "../models/UserModels.js";
import { Order } from "../models/OrderModel.js";
import { CalPercentage, CategoriesCount, GetChartData } from "../middleware/features.js";

export const Statistics = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {

        let stats;
        const key = "Get-Stats1";
        if (myCache.has(key)) {
            stats = JSON.parse(myCache.get(key) as string);
        } else {

            const today = new Date();
            const sixMonthAgo = new Date();
            sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

            const ThisMonth = {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: today,
            }

            const LastMonth = {
                start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
                end: new Date(today.getFullYear(), today.getMonth(), 0),
            }

            // Month wise Product . . .
            const ThisMonthProducts = Product.find({
                createdAt: {
                    $gte: ThisMonth.start,
                    $lte: ThisMonth.end
                }
            })

            const LastMonthProducts = Product.find({
                createdAt: {
                    $gte: LastMonth.start,
                    $lte: LastMonth.end
                }
            })

            const ThisMonthUsers = User.find({
                createdAt: {
                    $gte: ThisMonth.start,
                    $lte: ThisMonth.end
                }
            })

            const LastMonthUsers = User.find({
                createdAt: {
                    $gte: LastMonth.start,
                    $lte: LastMonth.end
                }
            })

            const ThisMonthOrders = Order.find({
                createdAt: {
                    $gte: ThisMonth.start,
                    $lte: ThisMonth.end
                }
            })

            const LastMonthOrders = Order.find({
                createdAt: {
                    $gte: LastMonth.start,
                    $lte: LastMonth.end
                }
            })

            // Six Month Wise Products

            const SixMonthsOfOrders = await Order.find({
                createdAt: {
                    $gte: sixMonthAgo,
                    $lte: today,
                }
            })

            const latestTransaction = Order.find()
                .select(["discount", "total", "orderItems", "status"])
                .limit(4);


            const [
                ThisMonthUser,
                ThisMonthProduct,
                ThisMonthOrder,
                LastMonthUser,
                LastMonthProduct,
                LastMonthOrder,
                ProductCount,
                UserCount,
                OrderTotal,
                SixMonthsOfOrder,
                Categories,
                FemaleUserCount,
                OtherRatio,
                Transaction
            ] = await Promise.all([
                ThisMonthUsers,
                ThisMonthProducts,
                ThisMonthOrders,
                LastMonthUsers,
                LastMonthProducts,
                LastMonthOrders,
                Product.countDocuments(),
                User.countDocuments(),
                Order.find().select("total"),
                SixMonthsOfOrders,
                Product.distinct("category"),
                User.countDocuments({ gender: "female" }),
                User.countDocuments({ gender: "other" }),
                latestTransaction
            ]);

            const OrderMonthCounts = new Array(6).fill(0);
            const OrderMonthRevenue = new Array(6).fill(0);

            SixMonthsOfOrder.forEach((order) => {
                const creationDate = order.createdAt;
                const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

                if (monthDiff < 6) {
                    OrderMonthCounts[5 - monthDiff] += 1;
                    OrderMonthRevenue[5 - monthDiff] += order.total;
                }
            })

            const totalRevenue = OrderTotal.reduce(
                (total, order) => total + (order.total || 0), 0
            )

            const Percentage = {
                UserPerc: CalPercentage(ThisMonthUser.length, LastMonthUser.length),
                ProductPerc: CalPercentage(ThisMonthProduct.length, LastMonthProduct.length),
                OrderPerc: CalPercentage(ThisMonthOrder.length, LastMonthOrder.length)
            }

            const Counts = {
                Revenue: totalRevenue,
                ProductCount: ProductCount,
                UserCount: UserCount,
                OrderCount: OrderTotal.length,
            }

            const categories = await CategoriesCount({ Categories, ProductCount });

            const chart = {
                Order: OrderMonthCounts,
                Revenue: OrderMonthRevenue
            }

            const ratio = {
                male: UserCount - FemaleUserCount - OtherRatio,
                female: FemaleUserCount,
                other: OtherRatio

            }

            const Modifiedtransaction = Transaction.map(i => ({
                _id: i._id,
                discount: i.discount,
                amount: i.total,
                quantity: i.orderItems.length,
                status: i.status
            }))

            stats = {
                categories,
                Percentage,
                Counts,
                chart,
                ratio,
                Transaction: Modifiedtransaction
            }

            myCache.set(key, JSON.stringify(stats))

        }

        res.status(200).json({
            success: true,
            stats
        })


    } catch (error) {
        next(error)
    }
}

export const Pie = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {

        let charts;
        const key = "Get-Chart";

        if (myCache.has(key)) {
            charts = JSON.parse(myCache.get(key) as string);
        } else {

            const getRevenue = Order.find().select(["total", "discount", "subtotal", "tax", "shippingCharges"]);

            const [processing, shipped, delivered, Categories, ProductCount, OutOfStock, Revenue, AllUser, TotalUser, TotalAdmin] = await Promise.all([
                Order.countDocuments({ status: "Processing" }),
                Order.countDocuments({ status: "Shipped" }),
                Order.countDocuments({ status: "Delivered" }),
                Product.distinct("category"),
                Product.countDocuments(),
                Product.countDocuments({ stock: 0 }),
                getRevenue,
                User.find({}).select("dob"),
                User.countDocuments({ role: "user" }),
                User.countDocuments({ role: "admin" })
            ])

            const categoryCount = await CategoriesCount({ Categories, ProductCount })

            const stockAvailability = {
                inStock: ProductCount - OutOfStock,
                OutOfStock,
            }

            const GrossIncome = Revenue.reduce((prev, order) => prev + (order.total || 0), 0);
            const Discount = Revenue.reduce((prev, order) => prev + (order.discount || 0), 0);
            const ProductionCost = Revenue.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
            const Burn = Revenue.reduce((prev, order) => prev + (order.tax || 0), 0);
            const MarketingCost = Math.round(GrossIncome * (30 / 100));
            const NetMargin = GrossIncome - Discount - ProductionCost - Burn - MarketingCost

            const RevenueDistribution = {
                NetMargin,
                Discount,
                ProductionCost,
                Burn,
                MarketingCost,
            }

            const teen = AllUser.filter((i) => i.age < 20).length;
            const adult = AllUser.filter((i) => i.age >= 20 && i.age <= 40).length;
            const old = AllUser.filter((i) => i.age >= 40).length;

            const AgeRatio = {
                teen,
                adult,
                old,
            }

            const UserRatio = {
                AllUser,
                TotalUser,
                TotalAdmin
            }

            const orderFullFillment = {
                Processing: processing,
                Shipped: shipped,
                Delivered: delivered,
                StockRatio: stockAvailability,
                RevenueDistribution,
                UserRatio,
                AgeRatio,
                CategoryRatio: categoryCount,
            }

            charts = {
                orderFullFillment,
            }

            myCache.set(key, JSON.stringify(charts))

        }

        return res.status(201).json({
            success: true,
            charts
        })

    } catch (error) {
        next(error)
    }
}

export const BarChart = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {

        let Chart;
        const key = "Get-Bar-Chart";

        if (myCache.has(key)) {
            Chart = JSON.parse(myCache.get(key) as string);
        } else {

            const today = new Date();

            const sixMonthAgo = new Date();
            sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

            const twelveMonthAgo = new Date();
            sixMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);

            const sixMonthUser = User.find({
                createdAt: {
                    $gte: sixMonthAgo,
                    $lte: today
                }
            }).select("createdAt")

            const sixMonthProduct = Product.find({
                createdAt: {
                    $gte: sixMonthAgo,
                    $lte: today
                }
            }).select("createdAt")

            const PastTwelveMonthOrder = Order.find({
                createdAt: {
                    $gte: sixMonthAgo,
                    $lte: today
                }
            }).select("createdAt")


            const [products, users, orders] = await Promise.all([
                sixMonthProduct,
                sixMonthUser,
                PastTwelveMonthOrder,
            ]);

            const productCounts = GetChartData({ length: 6, today, docArr: products });
            const usersCounts = GetChartData({ length: 6, today, docArr: users });
            const ordersCounts = GetChartData({ length: 12, today, docArr: orders });

            Chart = {
                users: usersCounts,
                products: productCounts,
                orders: ordersCounts,
            };

            myCache.set(key, JSON.stringify(Chart))
        }
        res.status(201).json({
            success: true,
            Chart
        })
    } catch (error) {
        next(error)
    }
}

export const Line = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {

        const key = "Get-Line"
        let Line;

        if (myCache.has(key)) {
            Line = JSON.parse(myCache.get(key) as string);
        } else {

            const today = new Date();
            const TwelveMonthAgo = new Date();

            TwelveMonthAgo.setMonth(TwelveMonthAgo.getMonth() - 12);

            const baseQuery = {
                createdAt: {
                    $gte: TwelveMonthAgo,
                    $lte: today
                }
            }

            const [Users, Products, Orders] = await Promise.all([
                User.find(baseQuery).select("createdAt"),
                Product.find(baseQuery).select("createdAt"),
                Order.find(baseQuery).select(["createdAt", "total", "discount"]),
            ])

            const UserCount = GetChartData({ length: 12, docArr: Users, today });
            const ProductCount = GetChartData({ length: 12, docArr: Products, today });
            const OrderCount = GetChartData({ length: 12, docArr: Orders, today });
            const Discount = GetChartData({ length: 12, docArr: Orders, today, property: "discount" });
            const Total = GetChartData({ length: 12, docArr: Orders, today, property: "total" });

            Line = {
                UserCount,
                ProductCount,
                OrderCount,
                Discount,
                Total
            }

        }

        res.status(200).json({
            success: true,
            Line
        })
    } catch (error) {
        next(error)
    }
}


