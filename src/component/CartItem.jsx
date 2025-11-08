import React from "react";
import { FcDeleteDatabase } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQty } from "../redux/slice/cartSlice";
import toast from "react-hot-toast";

function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart(item.productId || item.product?._id));
    toast.error("Item removed from cart");
  };

  const inc = () => dispatch(updateQty(item.productId || item.product?._id, (item.qty || 1) + 1));
  const dec = () => dispatch(updateQty(item.productId || item.product?._id, Math.max(0, (item.qty || 1) - 1)));

  return (
    <div>
      <div className="flex items-center p-4 md:p-6 justify-between mt-2 mb-2 md:mx-5 bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-700">
        <div className="flex xs:p-2 md:p-3 md:gap-5 xs:gap-2 items-center">
          <div className="w-[30%] p-2">
            <img className="object-cover xs:h-[80px] rounded-md shadow-sm" src={item.product?.image} />
          </div>
          <div className="md:ml-10 xs:ml-5 self-start md:space-y-5 xs:space-y-3 w-[100%]">
            <h1 className="text-xl xs:text-md text-gray-100 font-semibold xs:text-md">
              {item.product?.title}
            </h1>
            <h1 className="text-base text-gray-400 font-medium xs:font-small">
              {(item.product?.description || '').split(" ").slice(0, 10).join(" ")}
            </h1>
            <div className="flex items-center justify-between">
              <p className="font-bold md:text-lg xs:text-md text-purple-400">
                ${item.product?.price}
              </p>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 bg-gray-700 text-white rounded" onClick={dec}>-</button>
                <span className="text-white">{item.qty || 1}</span>
                <button className="px-2 py-1 bg-gray-700 text-white rounded" onClick={inc}>+</button>
              </div>
              <div
                className="text-red-400 bg-gray-700 hover:bg-gray-600 transition-all duration-200 cursor-pointer rounded-full p-3 mr-3 shadow-sm hover:shadow-md"
                onClick={handleRemove}
              >
                <FcDeleteDatabase className="transform hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-700 my-2"></div>
    </div>
  );
}

export default CartItem;
