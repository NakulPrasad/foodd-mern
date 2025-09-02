// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchLocation} from '../redux/slices/locationSlice';
import { AppDispatch } from "../redux/store";
import { toast } from "react-toastify";

// export const useLocation = () => {
//   const [city, setCity] = useState("Hyderabad");
//   const [error, setError] = useState("");
//   const getCityFromOSM = () => {
//     if (!navigator.geolocation) {
//       setError("Geolocation not supported");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       async ({ coords }) => {
//         try {
//           const url = `http://localhost:3000/apiv1/home/getLocation?latitude=${coords.latitude}&longitude=${coords.longitude}`;

//           const res = await fetch(url);
//           const data = await res.json();

//           const addr = data.address;
//           const cityName = addr.state_district || "Unknown";

//           setCity(cityName);
//           // console.log(data);
//           console.log(cityName);
//         } catch (e) {
//           setError("Failed to fetch city");
//         }
//       },
//       (err) => setError(err.message),
//       { enableHighAccuracy: true },
//     );
//   };
//   return {city, getCityFromOSM, error};
// };


export const useLocation = ()=>{
  const dispatch = useDispatch<AppDispatch>();
  const {city, loading, error} = useSelector(state =>state.location);

  const getLocation = ()=>{
    dispatch(fetchLocation());
    loading && toast.success("Fetching Location")
  }
  return {city, loading, error, getLocation};
}
