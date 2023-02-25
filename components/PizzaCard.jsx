import Image from "next/image";
import styles from "../styles/PizzaCard.module.css";
import Link from "next/link";
import { motion } from "framer-motion";
import Flip from 'react-reveal/Flip';

const PizzaCard = ({ pizza,id }) => {
  const shorten =(str) =>{
    var result;
    if(str.length>=79)
      result = str.substring(0,76)+"...";
    else
      result = str
    return result
  }
  return (
    <Flip left delay={300+id*300}>
    <Link href={`/product/${pizza._id}`} passHref>
      <motion.div className={styles.container} whileTap={{ scale: 0.8 }}>
        <Image className={styles.image} src={pizza.img} alt={pizza.title} width="200" height="200" />
        <h1 className={styles.title}>{pizza.title}</h1>
        <div className={styles.price}>
          <p className={styles.unit}>$</p><p>{pizza.measurment=="kg"?pizza.priceperkg:pizza.prices[0]==0?pizza.prices[1]==0?pizza.prices[2]:pizza.prices[1]:pizza.prices[0]}</p><p className={styles.unit}>{pizza.measurment=="kg"?" /kg":".00"}</p>
        </div>
        <p className={styles.desc}>{shorten(pizza.desc)}</p>      
      </motion.div>
      </Link>
    </Flip>
  );
};

export default PizzaCard;
