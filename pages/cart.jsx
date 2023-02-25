import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import axios from 'axios';
const Cart = dynamic(
  () => import('../components/Cart'),
  {ssr: false}
)
const Cartt = ({mapLocation,deliveryChargePerKm}) => {
  const router = useRouter();
  const user = useSelector((state) => state.user);
  useEffect(()=>{
    if(user.username=='Guest'){
      router.push('/socialogin');
    }
  },[])
  return (
    <Cart mapLocation={mapLocation} deliveryChargePerKm={deliveryChargePerKm}/>
  )
}

export default Cartt

export const getServerSideProps = async () => {

  var res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/static`).then((res)=>res.data).catch((err)=>{
    console.log(err);
  });
  return {
    props: {
      mapLocation: res?.mapLocation||null,
      deliveryChargePerKm: res?.deliveryChargePerKm||null,
    },
  };
  
};