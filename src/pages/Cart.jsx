import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import CartItem from "../component/CartItem";
import { fetchCart, checkout } from "../redux/slice/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const { items: cartItems, total } = useSelector((state) => state.cart);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleCheckout = async () => {
    try {
      const receipt = await dispatch(checkout(name, email));
      setReceipt(receipt);
      setName("");
      setEmail("");
    } catch (e) {}
  };

  return (
    <div className="mt-20 max-h-[100vh]">
      {cartItems.length > 0 ? (
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-center">
          <div className="w-[100%] md:w-[60%] flex flex-col p-2">
            {cartItems.map((item, index) => {
              const key = String(item.productId || item.product?._id || index);
              return <CartItem key={key} item={item} />;
            })}
          </div>
          <div className="w-[100%]  md:w-[40%] mt-5 flex mb-5 flex-col ">
            <div className="flex flex-col p-5 gap-5 my-14 h-[100%] justify-between">
              <div className="flex flex-col gap-5 ">
                <div className="font-semibold text-xl text-purple-400">
                  Your Cart
                </div>
                <div className="font-semibold text-5xl text-gray-100 -mt-5">
                  Summary
                </div>
                <p className="text-xl">
                  <span className="text-gray-300 font-semibold text-xl">
                    Total Items: {cartItems.length}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-xl font-bold">
                <span className="text-gray-300 font-semibold">
                  Total Amount:
                </span>
                <span className="text-purple-400 ml-2">${total.toFixed(2)}</span>
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="px-4 py-2 rounded bg-gray-700 text-white"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="px-4 py-2 rounded bg-gray-700 text-white"
                />
                <button
                  onClick={handleCheckout}
                  className="bg-purple-500 hover:bg-purple-600 rounded-lg text-gray-100 transition duration-300 ease-in-out mt-2 font-bold p-3 text-xl shadow-md hover:shadow-lg"
                >
                  CheckOut Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <h1 className="text-gray-700 font-semibold text-xl mb-2">
            Your Cart is Empty!
          </h1>
          <NavLink to="/">
            <button className="uppercase bg-green-600 hover:bg-purple-50 rounded-lg text-white transition duration-300 ease-linear mt-5 border-2 border-green-600 font-semibold hover:text-green-700 p-3 -x-10 tracking-widest">
              Shop Now
            </button>
          </NavLink>
        </div>
      )}

      {receipt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-2">Receipt</h2>
            <p className="text-sm text-gray-300">{new Date(receipt.timestamp).toLocaleString()}</p>
            <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
              {(receipt.items || []).map((it, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{it.title} × {it.qty}</span>
                  <span>${it.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>${receipt.total.toFixed(2)}</span>
            </div>
            <button className="mt-6 w-full bg-purple-600 hover:bg-purple-700 rounded py-2" onClick={() => setReceipt(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
