import React, { FormEvent, useEffect, useState } from "react";
import Card from "../Components/Card";
import {
  useGetCategoryQuery,
  useGetSearchResultQuery,
} from "../redux/API/Product";
import toast from "react-hot-toast";
import Loader from "../Components/Loader";
import { CartInfo } from "../types/ReduxType";
import { addItem } from "../redux/Slices/CartSlice";
import { useDispatch } from "react-redux";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>();
  const [category, setcategory] = useState("");
  const [page, setPage] = useState(1);

  // useEffect(() => {}, [location.search]);

  const { data, isLoading, isError } = useGetCategoryQuery("");

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  const {
    data: SearchData,
    isLoading: IsSearchLoading,
    isError: IsSearchError,
  } = useGetSearchResultQuery({
    category,
    page,
    price: Number(maxPrice),
    search: search,
    sort,
  });

  if (isError) toast.error("Category Error");
  if (IsSearchError) toast.error("Search error occur!");
  console.log(SearchData);

  const dispatch = useDispatch();
  const CardHandler = (cartItem: CartInfo) => {

    if(cartItem.stock < 0) return toast.error("product is currently out of stock!")
    dispatch(addItem(cartItem))
    
  };

  return (
    <div className="search">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Filter</h2>

        <div className="">
          <h4>Search</h4>
          <input
            id="search"
            type="text"
            placeholder="Search by name . . ."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="">
          <h4 className="i">Sort</h4>
          <select
            name="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">None</option>
            <option value="asc">Low To High</option>
            <option value="dsc">High To Low</option>
          </select>
        </div>

        <div className="">
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            className="i"
            type="range"
            min={50}
            max={100000}
            name="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div className="">
          <h4 className="i">Category</h4>
          <select
            style={{ height: "50px" }}
            value={category}
            onChange={(e) => setcategory(e.target.value)}
            name=""
          >
            <option value="">ALL</option>
            {!isLoading
              ? data!.category?.map((i) => (
                  <option style={{ padding: "10px" }} key={i} value={i}>
                    {i.toUpperCase()}
                  </option>
                ))
              : "No Category Available"}
          </select>
        </div>
      </form>

      <main className="">
        <h1>Products</h1>
        <hr />

        <div className="produsts-cards">
          {IsSearchLoading ? (
            <Loader />
          ) : (
            SearchData?.products.map((item, i) => (
              <Card
                productId={item._id}
                name={item.name}
                price={item.price}
                Stock={item.stock}
                photo={`/api/${item.photo}`}
                handler={CardHandler}
                key={i}
              />
            ))
          )}
        </div>

        <article>
          <button
            disabled={!isPrevPage}
            onClick={() => setPage(page === 1 ? page + 0 : page - 1)}
          >
            Prev
          </button>
          <span>
            {page} of {4}
          </span>
          <button disabled={!isNextPage} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </article>
      </main>
    </div>
  );
};

export default Search;

{
  /* <Card
productId="12"
name="Mackbook"
price={45000}
Stock={13}
photo={`${img}`}
handler={CardHandler}
key={"12"}
/> */
}
