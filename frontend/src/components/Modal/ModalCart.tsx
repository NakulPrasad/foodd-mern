import { Button, Divider, Image, Modal, ScrollArea, Text, Group, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconChevronDown, IconChevronUp, IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "../../hooks/useCart";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { replaceCartWithItem } from "../../redux/slices/cartSlice";
import { IFoodItem } from "../../types";
import { IValue } from "../../types/cart.types";
import { RootState } from "../../redux/store";
import classes from "./ModalCart.module.css";
import IconNonVeg from "/icons/non-veg-icon.png";
import IconVeg from "/icons/veg-icon.png";
import FoodFallback from "/img/foodItem/pizza.jpg";

interface IModalCartProps {
  item: IFoodItem;
}

const ModalCart = (props: IModalCartProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const { cart, addItem } = useCart();
  const [conflictModalOpened, { open: openConflictModal, close: closeConflictModal }] = useDisclosure(false);
  const selectedRestaurant = useAppSelector(
    (state: RootState) => state.restaurant.selected,
  ) as any;

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, IValue | IValue[]>
  >({});
  const [totalPrice, setTotalPrice] = useState(props.item.price);

  // Which option groups are expanded (all open by default)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        (props.item.options || []).map((opt) => [opt.name, true]),
      ),
  );

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // --- Price calculation ---
  useEffect(() => {
    let total = props.item.price;
    Object.values(selectedOptions).forEach((val) => {
      if (Array.isArray(val)) {
        val.forEach((v) => { total += Number(v.price) || 0; });
      } else if (val && typeof val === "object") {
        total += Number(val.price) || 0;
      }
    });
    setTotalPrice(total);
  }, [selectedOptions, props.item.price]);

  const handleRadioSelect = (groupName: string, v: IValue) => {
    setSelectedOptions((prev) => ({ ...prev, [groupName]: v }));
  };

  const handleCheckboxToggle = (groupName: string, v: IValue) => {
    setSelectedOptions((prev) => {
      const current = (prev[groupName] as IValue[]) || [];
      const exists = current.some((c) => c.label === v.label);
      const updated = exists
        ? current.filter((c) => c.label !== v.label)
        : [...current, v];
      return { ...prev, [groupName]: updated };
    });
  };

  const isRadioSelected = (groupName: string, v: IValue) => {
    const sel = selectedOptions[groupName] as IValue | undefined;
    return sel?.label === v.label;
  };

  const isCheckboxSelected = (groupName: string, v: IValue) => {
    const sel = (selectedOptions[groupName] as IValue[]) || [];
    return sel.some((c) => c.label === v.label);
  };

  // --- Cart ---
  const cartItem = {
    _id: props.item._id,
    restaurantId: props.item.restaurantId,
    restaurantName: props.item.restaurantName,
    restaurantImage:
      selectedRestaurant?.image || (props.item as any).restaurantImage,
    name: props.item.name,
    price: totalPrice,
    image_url: props.item.img_url,
    is_veg: props.item.is_veg,
    options: selectedOptions,
    quantity: 1,
  };

  const handleConfirmReplaceCart = () => {
    dispatch(replaceCartWithItem(cartItem as any));
    toast.info(`Cart updated with items from ${cartItem.restaurantName || "new restaurant"}`);
    closeConflictModal();
    if (opened) {
      close();
      resetState();
    }
  };

  const handleAddToCart = () => {
    if (
      cart.selectedRestaurantId &&
      cart.selectedRestaurantId !== cartItem.restaurantId &&
      cart.cartItems.length > 0
    ) {
      openConflictModal();
      return;
    }
    addItem(cartItem as any);
    toast.success(`${props.item.name} added to cart! 🎉`);
    close();
    resetState();
  };

  const resetState = () => {
    setSelectedOptions({});
    setTotalPrice(props.item.price);
  };

  const handleClose = () => {
    close();
    resetState();
  };

  const handleAddClick = () => {
    if (
      cart.selectedRestaurantId &&
      cart.selectedRestaurantId !== cartItem.restaurantId &&
      cart.cartItems.length > 0
    ) {
      openConflictModal();
      return;
    }

    if (!props.item.options || props.item.options.length < 1) {
      // No customisation needed — add directly
      addItem(cartItem as any);
      toast.success(`${props.item.name} added! 🎉`);
      return;
    }
    open();
  };

  const extraCost = totalPrice - props.item.price;

  return (
    <>
      {/* ── Customisation Drawer / Modal ── */}
      <Modal
        opened={opened}
        onClose={handleClose}
        centered
        size="md"
        padding={0}
        withCloseButton={false}
        radius="xl"
        styles={{
          content: { borderRadius: 24, overflow: "hidden" },
          body: { padding: 0 },
        }}
      >
        {/* ─ Header ─ */}
        <div
          style={{
            padding: "1.25rem 1.5rem 1rem",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            background: "#ffffff",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.25rem",
            }}
          >
            <Text size="xs" fw={700} c="#94a3b8" style={{ letterSpacing: "0.08em" }}>
              CUSTOMISE YOUR ORDER
            </Text>
            <button
              onClick={handleClose}
              style={{
                background: "#f1f5f9",
                border: "none",
                width: 32,
                height: 32,
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "#475569",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Item preview */}
          <div className={classes.itemPreview}>
            <Image
              src={props.item.img_url || FoodFallback}
              className={classes.itemPreviewImg}
              alt={props.item.name}
              radius="md"
            />
            <div className={classes.itemPreviewInfo}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Image
                  src={props.item.is_veg ? IconVeg : IconNonVeg}
                  style={{ width: 14, height: 14 }}
                />
              </div>
              <p className={classes.itemPreviewName}>{props.item.name}</p>
              <p className={classes.itemPreviewSubtitle}>
                Base price: ₹{props.item.price}
                {props.item.description && ` · ${props.item.description.slice(0, 50)}...`}
              </p>
            </div>
          </div>
        </div>

        {/* ─ Options body ─ */}
        <ScrollArea
          className={classes.modalBody}
          style={{ padding: "1rem 1.5rem" }}
        >
          {props.item.options.map((option, idx) => {
            const isExpanded = expandedGroups[option.name] !== false;
            const isRequired = option.type === "select";

            return (
              <div key={idx} className={classes.optionGroup}>
                {/* Group header */}
                <div
                  className={classes.optionGroupHeader}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleGroup(option.name)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <p className={classes.optionGroupTitle}>Choose {option.name}</p>
                    <span
                      className={`${classes.optionGroupBadge} ${isRequired ? classes.requiredBadge : classes.optionalBadge}`}
                    >
                      {isRequired ? "Required" : "Optional"}
                    </span>
                  </div>
                  {isExpanded ? (
                    <IconChevronUp size={18} color="#94a3b8" />
                  ) : (
                    <IconChevronDown size={18} color="#94a3b8" />
                  )}
                </div>

                {/* Option rows */}
                {isExpanded && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {option.values.map((v, vIdx) => {
                      const priceNum = Number(v.price) || 0;
                      const isRadio = option.type === "select";
                      const selected = isRadio
                        ? isRadioSelected(option.name, v)
                        : isCheckboxSelected(option.name, v);

                      return (
                        <div
                          key={vIdx}
                          className={`${classes.optionRow} ${selected ? classes.optionRowSelected : ""}`}
                          onClick={() =>
                            isRadio
                              ? handleRadioSelect(option.name, v)
                              : handleCheckboxToggle(option.name, v)
                          }
                        >
                          <div className={classes.optionLeft}>
                            {/* Custom radio / checkbox */}
                            {isRadio ? (
                              <div
                                className={`${classes.customRadio} ${selected ? classes.customRadioSelected : ""}`}
                              >
                                {selected && <div className={classes.customRadioDot} />}
                              </div>
                            ) : (
                              <div
                                className={`${classes.customCheckbox} ${selected ? classes.customCheckboxSelected : ""}`}
                              >
                                {selected && (
                                  <IconCheck size={12} color="#ffffff" strokeWidth={3} />
                                )}
                              </div>
                            )}

                            <div>
                              <div className={classes.optionLabel}>{v.label}</div>
                            </div>
                          </div>

                          <div
                            className={`${classes.optionPrice} ${priceNum > 0 ? classes.optionPricePositive : ""}`}
                          >
                            {priceNum === 0 ? "Free" : `+₹${priceNum}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {idx < props.item.options.length - 1 && (
                  <Divider my="md" color="#f1f5f9" />
                )}
              </div>
            );
          })}
        </ScrollArea>

        {/* ─ Sticky footer ─ */}
        <div
          style={{
            padding: "1rem 1.5rem 1.25rem",
            borderTop: "1px solid #e2e8f0",
            background: "#ffffff",
            position: "sticky",
            bottom: 0,
          }}
        >
          <div className={classes.modalFooter}>
            <div className={classes.priceBreakdown}>
              <span className={classes.basePrice}>
                ₹{props.item.price}
                {extraCost > 0 && ` + ₹${extraCost} extras`}
              </span>
              <span className={classes.totalPrice}>₹{totalPrice}</span>
            </div>
            <Button
              className={classes.addToCartBtn}
              onClick={handleAddToCart}
            >
              Add to Cart →
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Multi-Restaurant Cart Conflict Modal ── */}
      <Modal
        opened={conflictModalOpened}
        onClose={closeConflictModal}
        title={
          <Group gap="xs">
            <IconAlertTriangle size={22} color="#ea580c" />
            <Title order={4}>Replace cart items?</Title>
          </Group>
        }
        centered
        radius="lg"
        size="md"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Your cart contains items from <b>{cart.selectedRestaurantName || "another restaurant"}</b>. Would you like to discard those items and start a new order from <b>{cartItem.restaurantName || "this restaurant"}</b>?
          </Text>
          <Group justify="flex-end" gap="xs">
            <Button variant="default" onClick={closeConflictModal}>
              Cancel
            </Button>
            <Button color="orange" onClick={handleConfirmReplaceCart}>
              Discard &amp; Add
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ── ADD trigger button on the MenuCard ── */}
      <Button onClick={handleAddClick} className={classes.addBtn}>
        {props.item.options?.length >= 1 ? "ADD +" : "ADD"}
      </Button>
    </>
  );
};

export default ModalCart;
