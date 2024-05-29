import { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useGetAllOrderQuery } from "../../redux/API/OrderApi";
import { err } from "../../types/types";
import toast from "react-hot-toast";
import Loader from "../../Components/Loader";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

const arr: Array<DataType> = [
  {
    user: "Charas",
    amount: 4500,
    discount: 400,
    status: <span className="red">Processing</span>,
    quantity: 3,
    action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
  },

  {
    user: "Xavirors",
    amount: 6999,
    discount: 400,
    status: <span className="green">Shipped</span>,
    quantity: 6,
    action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
  },
  {
    user: "Xavirors",
    amount: 6999,
    discount: 400,
    status: <span className="purple">Delivered</span>,
    quantity: 6,
    action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
  },
];

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
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

const Transaction = () => {
  const [rows, setRows] = useState<DataType[]>(arr);
  
  const { data, isLoading, isError, error } = useGetAllOrderQuery("");

  if (isError) {
    const customErr =error as err
    toast.error(customErr.data.message)
  }
  useEffect(()=>{

    if (data) {
      setRows(
        data.orders.map((item) => ({
          user: item.user.name,
          amount: item.total,
          discount: item.discount,
          quantity: item.orderItems.length,
          status: <span style={item.status === "Processing" ? {color: "red"} : item.status === "Shipped" ? {color: "green"} : { color: "blue"} }>{item.status}</span>,
          action: <Link to={`/admin/transaction/${item._id}`}>Manage</Link>
        }))
      );
    }

  },[data])

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{ isLoading ? <Loader /> :  Table}</main>
    </div>
  );
};

export default Transaction;
