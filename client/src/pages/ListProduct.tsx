import React, { useState } from "react";
import { useCreateProductMutation } from "../redux/API/Product";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ListProduct = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photo, setPhoto] = useState<File>();

  const navigate = useNavigate();

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null) {
      setPhoto(e.target.files[0]);
    }
  };

  const [newProduct] = useCreateProductMutation();

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.set("name", name);
    formData.set("description", description);
    formData.set("category", category);
    formData.set("price", String(price));
    formData.set("stock", String(stock));
    formData.set("photo", photo);

    const res = await newProduct({ formData });

    if ("data" in res) {
      toast.success("Product has been created successfully");
      navigate("/");
    } else {
      toast.error("Can't Create New Product");
    }
  };

  return (
    <main className="list">
      <h1>List Products</h1>
      <form onSubmit={handleSubmit}>
        <div className="data">
          <div className="">
            <label htmlFor="">name</label>
            <input
              required
              type="text"
              placeholder="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="">
            <label htmlFor="">Description</label>
            <textarea
              required
              typeof="text"
              placeholder="Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="">
            <label htmlFor="">category</label>
            <input
              required
              type="text"
              placeholder="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="">stock</label>
            <input
              required
              type="number"
              placeholder="stock"
              name="stock"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </div>

          <div>
            <label htmlFor="">price</label>
            <input
              required
              type="number"
              placeholder="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="image">
          <input
            required
            type="file"
            placeholder="Photo"
            accept=".png, .jpeg, .jpg"
            name="photo"
            onChange={handlePhoto}
          />

          <button type="submit">Submit</button>
        </div>
      </form>
    </main>
  );
};

export default ListProduct;
