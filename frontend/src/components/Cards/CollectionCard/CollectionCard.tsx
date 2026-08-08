import classes from "./CollectionCard.module.css";

interface CollectionCardProps {
  image: string;
  label?: string;
  onClick?: () => void;
}

const CollectionCard = ({ image, label, onClick }: CollectionCardProps) => {
  return (
    <div className={classes.pill} onClick={onClick}>
      <div className={classes.imgWrap}>
        <img src={image} alt={label} className={classes.img} />
      </div>
      {label && <span className={classes.label}>{label}</span>}
    </div>
  );
};

export default CollectionCard;
