import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { OrderItem, OrderType } from "../../../types/ReduxType";
import {
  useDeleteOrderMutation,
  useGetOrderDetailQuery,
  useUpdateOrderMutation,
} from "../../../redux/API/OrderApi";
import Loader from "../../../Components/Loader";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TransactionManagement = () => {
  const navigate = useNavigate();

  const [defaultData, setDefaultData] = useState<OrderType>({
    shippingInfo: {
      address: "77 black street",
      city: "Neyword",
      state: "Nevada",
      country: "US",
      pin: 0,
    },
    orderItems: [
      {
        _id: "",
        name: "",
        photo: "",
        price: 0,
        productId: "",
        quantity: 0,
      },
    ],
    status: "Processing",
    subtotal: 4000,
    discount: 1200,
    shippingCharges: 0,
    tax: 200,
    total: 4000 + 200 + 0 - 1200,
    _id: "",
    user: {
      _id: "",
      name: "",
    },
  });

  const { id } = useParams();
  const { data, isLoading, isError, currentData } = useGetOrderDetailQuery(
    String(id)
  );

  console.log(data?.order);

  useEffect(() => {
    if (data) {
      setDefaultData(data?.order);
    }
  }, [data]);

  const {
    shippingInfo: { address, city, country, pin, state },
    orderItems,
    _id,
    user: { name },
    discount,
    shippingCharges,
    status,
    subtotal,
    tax,
    total,
  } = defaultData;

  const [update] = useUpdateOrderMutation();
  const updateHandler = async () => {
    const res = await update(String(_id));

    if ("data" in res) {
      console.log(res);
      toast.success(res.data.message);
    } else {
      toast.error("Can't Update!");
    }
  };

  const [deleteOrder] = useDeleteOrderMutation();
  const deleteHandler = async () => {
    const res = await deleteOrder(String(_id));

    if ("data" in res) {
      toast.success(res.data.message);
      navigate("/admin/transaction");
    }else{
      toast.error("Can't delete order")
      console.log(res.error);
      
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <section
              style={{
                padding: "2rem",
              }}
            >
              <h2>Order Items</h2>

              {orderItems.map((i) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={`${i.photo}`}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="shipping-info-card">
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              <p>
                Address: {`${address}, ${city}, ${state}, ${country} ${pin}`}
              </p>
              <h5>Amount Info</h5>
              <p>Subtotal: {subtotal}</p>
              <p>Shipping Charges: {shippingCharges}</p>
              <p>Tax: {tax}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>

              <h5>Status Info</h5>
              <p>
                Status:{" "}
                <span
                  className={
                    status === "Delivered"
                      ? "purple"
                      : status === "Shipped"
                      ? "green"
                      : "red"
                  }
                >
                  {status}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
  </div>
);

export default TransactionManagement;

// const defaultData: OrderType = {
//   shippingInfo: {
//     address: "77 black street",
//     city: "Neyword",
//     state: "Nevada",
//     country: "US",
//     pin: 0,
//   },
//   orderItems: [],
//   status: "Processing",
//   subtotal: 4000,
//   discount: 1200,
//   shippingCharges: 0,
//   tax: 200,
//   total: 4000 + 200 + 0 - 1200,
//   _id: "",
//   user: {
//     _id: "",
//     name: "",
//   },
// };
