import { useMutation, useQueryClient } from "@tanstack/react-query";
import {logout as logoutApi} from '../../services/apiAuth'
import { useNavigate } from "react-router-dom";

export function useLogout(){
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const {mutate: logout, isLoading} = useMutation({
    mutationFn: logoutApi,
    onSuccess: ()=>{
      queryClient.removeQueries(); // remove all query inorder to avoid malicious actors
      navigate('/login',{replace: true}) // will erase previous page
    }
  })

  return {logout, isLoading}
}