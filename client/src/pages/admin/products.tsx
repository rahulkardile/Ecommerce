import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/API/Product";
import toast from "react-hot-toast";
import { err } from "../../types/types";
import Loader from "../../Components/Loader";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const [rows, setRows] = useState<DataType[]>([]);

  const { data, isLoading, isError, error } =  useAllProductsQuery("");

  if (isError) {
    const customErr =error as err
    toast.error(customErr.data.message)
  }

  useEffect(() => {
    
    if (data) {
      setRows(
        data.Product.map((item) => ({
          photo: <img src={"/api/" + item.photo} alt="img" />,
          name: item.name,
          price: item.price,
          stock: item.stock,
          action: <Link to={`/admin/product/${item._id}`}>Manage</Link>,
        }))
      );
    }

  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows, 
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Loader /> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
