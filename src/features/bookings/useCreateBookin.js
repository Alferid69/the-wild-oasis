import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking as createBookingApi } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCreateBooking(){
  const queryClient = useQueryClient()
  const {mutate: createBooking, isLoading: isCreating} = useMutation({
    mutationFn: createBookingApi,
    onSuccess: ()=>{
      toast.success('Booking created successfully');
      queryClient.invalidateQueries({
        queryKey: ['today-activity']
      })
    },
    onError: (err)=> toast.error(err.message)
  })

  return  {createBooking, isCreating};

}