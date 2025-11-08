import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/slice/cartSlice";

const Product = ({ item }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart(item._id, 1));
    toast.success("Item added to cart");
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item._id));
    toast.error("Item removed from cart");
  };

  return (
    <div
      className="flex flex-col items-center justify-between 
    hover:scale-105 transition duration-300 ease-in gap-3 p-4 mt-10 ml-5 rounded-xl shadow-lg bg-gray-800/90 backdrop-blur-sm border border-gray-700 max-h-[370px] max-w-[270px] hover:shadow-xl hover:bg-gray-800"
    >
      <div>
        <p className="text-gray-100 font-semibold text-lg text-left truncate w-40 mt-1">
          {item.title}
        </p>
      </div>
      <div>
        <p className="w-40 text-gray-400 font-normal text-[10px] text-left">
          {item.description.split(" ").slice(0, 10).join(" ") + "..."}
        </p>
      </div>
      <div className="h-[180px] w-full flex items-center justify-center">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement.innerHTML = '<div class="text-gray-500 text-xs">Image unavailable</div>';
          }}
        />
      </div>

      <div className="flex justify-between gap-12 items-center w-full mt-5">
        <div>
          <p className="text-green-600 font-semibold">${item.price}</p>
        </div>

        {cartItems.some((p) => String(p.productId || p.product?._id) === String(item._id)) ? (
          <button
            className="text-purple-400 border-2 border-purple-400 rounded-full font-semibold 
          text-[12px] p-1 px-3 uppercase 
          hover:bg-purple-400
          hover:text-gray-900 transition duration-300 ease-in whitespace-nowrap shadow-sm hover:shadow-md"
            onClick={handleRemove}
          >
            Remove Item
          </button>
        ) : (
          <button
            className="text-gray-700 border-2 border-gray-700 rounded-full font-semibold 
          text-[12px] p-1 px-3 uppercase whitespace-nowrap
          hover:bg-gray-700
          hover:text-white transition duration-300 ease-in"
            onClick={handleAdd}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
