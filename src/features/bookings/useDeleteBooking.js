import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const { isLoading: isDeleting, mutate: deleteBooking } = useMutation({
    mutationFn: deleteBookingApi,
    onSuccess: () => {
      toast.success("Booking deleted successfully.");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      navigate('/bookings')
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteBooking };
}
