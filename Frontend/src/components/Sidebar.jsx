import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Sidebar() {

  const user = useSelector((state) => state.auth.user);
  
  return (
    <div className="w-60 p-4 pt-5 text-gray-100 bg[#0F0F0F]">
      <ul className="list-none p-0 m-0">
        <li className="mb-2">
          <Link to={"/"} className="block py-2 px-3 hover:bg-gray-900 rounded">
            Home
          </Link>
        </li>
        {/* <li className="mb-2">
          <a href="#" className="block py-2 px-3 hover:bg-gray-900  rounded">
            Shorts
          </a>
        </li> */}
        
        <li className="mb-2">
          <Link
            to={"/history"}
            className="block py-2 px-3 hover:bg-gray-900 rounded"
          >
            History
          </Link>
        </li>
        <li className="mb-2">
          <Link
            to={"/playlists"}
            className="block py-2 px-3 hover:bg-gray-900 rounded"
          >
            Playlists
          </Link>
        </li>
        <li className="mb-2">
          <Link to={`${user?._id}/videos`} className="block py-2 px-3 hover:bg-gray-900 rounded">
            Your Videos
          </Link>
        </li>

        <li className="mb-2">
          <Link
            to={"/liked"}
            className="block py-2 px-3 hover:bg-gray-900 rounded"
          >
            Liked Videos
          </Link>
        </li>
        <li className="border-b border-gray-300 my-3"></li>
        <li className="mb-2">
          <Link to={"#"} className="block py-2 px-3 hover:bg-gray-900 rounded">
            Zee News{" "}
          </Link>
        </li>
        <li className="mb-2">
          <Link
            to={"#"}
            className="block py-2 px-3 hover:bg-gray-900 rounded"
          >
            Aaj Tak
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
