import React, { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useGetMyOrderQuery } from "../redux/API/OrderApi";
import { err } from "../types/types";
import toast from "react-hot-toast";
import Loader from "../Components/Loader";

type Datatype = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<Datatype>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quntity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Order = () => {
  const [rows, setOrder] = useState<Datatype[]>([
    {
      _id: "123dx23df86",
      amount: 4999,
      quantity: 23,
      discount: 199,
      status: <span className="red">Proccesing</span>,
      action: <Link to={"/order/123dx23df86"}>View</Link>,
    },
  ]);

  const { data, isLoading, isError, error } = useGetMyOrderQuery("");

  if (isError) {
    const errors = error as err;
    toast.error(errors.data.message);
  }

  useEffect(() => {
    if (data) {
      setOrder(
        data.orders.map((item) => ({
          _id: item._id,
          amount: item.total,
          quantity: item.orderItems.length,
          discount: item.discount,
          status: <span style={item.status === "Processing" ? {  color: "red"} : item.status === "Shipped" ? {color: "green"} : {color: "blue"}}>{item.status}</span>,
          action: <Link to={`/admin/transaction/${item._id}`}>Manage</Link>,
        }))
      );
    }
  }, [data]);

  const table = TableHOC<Datatype>(
    column,
    rows,
    "dashbord-product-box",
    "Order",
    true
  )();

  return (
    <div className="container">
      <h1>My Order</h1>
      { isLoading ? <Loader /> : table}
    </div>
  );
};

export default Order;
