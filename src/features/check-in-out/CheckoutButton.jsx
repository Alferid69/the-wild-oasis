import Button from "../../ui/Button";
import { useCheckout } from "./useCheckout";

// eslint-disable-next-line
function CheckoutButton({ bookingId }) {
  const {checkout, isCheckingOut} = useCheckout()
  return (
    <Button disabled={isCheckingOut} variation="primary" size="small" onClick={()=>checkout(bookingId)}>
      Check out
    </Button>
  );
}

export default CheckoutButton;
