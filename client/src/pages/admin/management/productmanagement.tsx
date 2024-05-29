import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
  useDeleteProductsMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../../redux/API/Product";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../Components/Loader";
import toast from "react-hot-toast";

const Productmanagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isFetching, isLoading } = useGetProductsQuery(String(id));
  console.log(data?.Product);

  const { name, description, price, photo, stock, category } =
    data?.Product || {
      name: "",
      description: "",
      price: 100,
      stock: 1,
      photo: "assa",
      category: "",
    };

  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [descriptionUpdate, setDescriptionUpdate] =
    useState<string>(description);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoFile, setPhotoFile] = useState<File>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    setPhotoFile(file);
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(String(data?.Product.name));
      setDescriptionUpdate(String(data?.Product.description));
      setPriceUpdate(Number(data?.Product.price));
      setStockUpdate(Number(data?.Product.stock));
      setCategoryUpdate(String(data?.Product.category));
    }
  }, [data]);

  const [UpdateProduct] = useUpdateProductMutation();
  const [Deleteproduct] = useDeleteProductsMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (nameUpdate) formData.set("name", nameUpdate);
    if (descriptionUpdate) formData.set("description", descriptionUpdate);
    if (categoryUpdate) formData.set("category", categoryUpdate);
    if (priceUpdate) formData.set("price", String(priceUpdate));
    if (stockUpdate !== undefined) formData.set("stock", String(stockUpdate));
    if (photoFile) formData.set("photo", photoFile);

    const res = await UpdateProduct({
      formData,
      productId: String(data?.Product._id),
    });

    if ("data" in res) {
      toast.success(`product ${name} Has created`);
      navigate("/admin/product");
    } else {
      console.log("Got an error");
    }
  };

  const handleDelete = async () => {
    const res = await Deleteproduct({ ProductId: String(data?.Product._id) });

    if ("data" in res) {
      toast.success("product has been deleted!");
      navigate("/admin/product");
    } else {
      toast.error("Got an Error");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Loader />
        ) : isFetching ? (
          <Loader />
        ) : (
          <>
            <section>
              <strong>ID: {data?.Product._id}</strong>
              <img src={"/api/" + photo} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button onClick={handleDelete} className="product-delete-btn">
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    style={{
                      padding: "1rem",
                      border: "1px solid rgba(13, 13, 13, 0.196)",
                      width: "100%",
                    }}
                    placeholder="Description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photo</label>
                  <input type="file" onChange={changeImageHandler} />
                </div>

                {photo && <img src={"/api/" + photo} alt="New Image" />}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
