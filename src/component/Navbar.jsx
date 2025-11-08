import React from "react";
import { MdShoppingCart } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery, setSelectedCategory, setSortBy } from "../redux/slice/filterSlice";

function Navbar() {
  const cartItems = useSelector((state) => state.cart.items);
  const { searchQuery, selectedCategory, sortBy } = useSelector((state) => state.filter);
  const dispatch = useDispatch();

  const categories = ["all", "men's clothing", "women's clothing", "jewelery", "electronics"];
  const sortOptions = [
    { value: "default", label: "Sort by..." },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "title-a-z", label: "Title: A-Z" }
  ];

  return (
    <div className="">
      <nav className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-20 max-w-6xl mx-auto py-4 px-5">
        <div className="flex items-center justify-between w-full sm:w-auto mb-4 sm:mb-0">
          <NavLink to="/">
            <div>
              <img
                className="h-14"
                src="https://res.cloudinary.com/dieds7her/image/upload/v1746012970/logo3_scsxy5.png"
                alt="Logo"
              />
            </div>
          </NavLink>
          <div className="flex items-center space-x-6 sm:hidden">
            <NavLink to="/cart">
              <div className="relative">
                <MdShoppingCart className="text-xl text-slate-100" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-green-600 text-xs w-4 h-4 flex justify-center items-center animate-bounce rounded-full text-white">
                    {cartItems.length}
                  </span>
                )}
              </div>
            </NavLink>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64 bg-gray-700"
            />
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
              className="px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" 
                    ? "All Categories"
                    : category.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex font-medium items-center text-white space-x-6">
            <NavLink to="/" className="hidden sm:block hover:text-indigo-200 transition-colors">
              <p>Home</p>
            </NavLink>

            <NavLink to="/cart" className="hidden sm:block hover:text-indigo-200 transition-colors">
              <div className="relative">
                <MdShoppingCart className="text-xl" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-pink-500 text-xs w-4 h-4 flex justify-center items-center animate-bounce rounded-full text-white">
                    {cartItems.length}
                  </span>
                )}
              </div>
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
