import { Image } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { IFoodItem } from "../../../types";
import ModalCart from "../../Modal/ModalCart";
import classes from "./MenuCard.module.css";
import IconNonVeg from "/icons/non-veg-icon.png";
import IconVeg from "/icons/veg-icon.png";
import FoodFallback from "/img/foodItem/pizza.jpg";

interface IMenuCardProps {
  foodItem: IFoodItem;
}

const MenuCard = ({ foodItem }: IMenuCardProps) => {
  const navigate = useNavigate();

  return (
    <div className={classes.row}>
      {/* Left: info */}
      <div className={classes.left}>
        <Image
          src={foodItem.is_veg ? IconVeg : IconNonVeg}
          style={{ width: 16, height: 16, marginBottom: 6 }}
        />
        <p className={classes.name}>{foodItem.name}</p>
        {foodItem.restaurantName && (
          <p
            className={classes.restaurantName}
            onClick={() => foodItem.restaurantId && navigate(`/restaurant/${foodItem.restaurantId}`)}
          >
            from <span>{foodItem.restaurantName}</span>
          </p>
        )}
        <p className={classes.price}>₹{foodItem.price}</p>

        {foodItem.rating > 0 && (
          <div className={classes.ratingRow}>
            <IconStarFilled size={11} color="#16a34a" />
            <span className={classes.ratingText}>{foodItem.rating}</span>
            <span className={classes.ratingCount}>(27)</span>
          </div>
        )}

        {foodItem.description && (
          <p className={classes.desc}>{foodItem.description}</p>
        )}

        {foodItem.options?.length >= 1 && (
          <p className={classes.customisable}>✦ Customisable</p>
        )}
      </div>

      {/* Right: image + add button */}
      <div className={classes.right}>
        <div className={classes.imgWrap}>
          <Image
            radius="md"
            src={foodItem.img_url || FoodFallback}
            className={classes.img}
          />
        </div>
        <div className={classes.addBtn}>
          <ModalCart item={foodItem} />
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
