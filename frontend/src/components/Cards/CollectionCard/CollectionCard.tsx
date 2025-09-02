import classes from "./CollectionCard.module.css";

interface CollectionCardProps {
  image: string;
}

const CollectionCard = ({ image }: CollectionCardProps) => {
  return (
    <div
      style={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    ></div>
  );
};

export default CollectionCard;
