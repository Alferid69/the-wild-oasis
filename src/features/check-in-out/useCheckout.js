import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckout(){
  const queryClient = useQueryClient();

  const {mutate: checkout, isLoading: isCheckingOut} = useMutation(
    {
      mutationFn: (bookingId)=> updateBooking(bookingId, {
        status: 'checked-out'
      }),
      onSuccess: (data)=>{
        toast.success(`Booking #${data.id} has checkedout successfully`);
        queryClient.invalidateQueries({active: true}) //  invalidate all queries
      },
      onError: ()=> toast.error("There was an error while checking out.")
    }
  );

  return {checkout, isCheckingOut} ; 
}