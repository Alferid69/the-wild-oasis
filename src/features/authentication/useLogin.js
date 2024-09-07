import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin(){
  // const queryClient = useQueryClient()
  const navigate = useNavigate();

  const {mutate: login, isLoading: isLogingIn} = useMutation({
    mutationFn: ({email, password})=> loginApi({email, password}),
    mutationKey: ['login'],
    onSuccess: (user)=>{
      // queryClient.setQueryData(['user', user.user]), // set data into react query cache
      navigate('/dashboard',{replace: true})
    },
    onError: err=>{
      console.log('Error', err)
      toast.error("Failed to login. Incorrect email or password")

    }
  })

  return {login, isLogingIn}
}