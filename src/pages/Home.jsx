import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../component/Spinner";
import Product from "../component/Product";

function Home() {
  const API_URL = "/api/products";
  const { searchQuery, selectedCategory, sortBy } = useSelector((state) => state.filter);

  const [loading, setLoading] = useState(false);
  const [allproduct, setProduct] = useState([]);

  async function fetchProductData() {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.log("Error fetching products");
      setProduct([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProductData();
  }, []);

  const filteredProducts = allproduct.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort the filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'title-a-z':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="flex flex-col items-center mt-20">
      {loading ? (
        <Spinner />
      ) : sortedProducts.length > 0 ? (
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl p-2 mx-auto space-y-10 space-x-5 min-h-[80vh]">
          {sortedProducts.map((item) => {
            return <Product key={item._id} item={item} />;
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <p>No items found</p>
        </div>
      )}
    </div>
  );
}

export default Home;
