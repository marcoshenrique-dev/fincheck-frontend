import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { authService } from "../../../app/services/authService";
import { toast } from "react-hot-toast";
import { SigninParams } from "../../../app/services/authService/signin";

const schema = z.object({
  email: z.string().nonempty('E-mail é obrigatório').email('Informe um e-mail válido'),
  password: z.string().nonempty('Senha é obrigatória').min(8, 'Senha deve conter pelo menos 8 dígitos'),
})

type FormData = z.infer<typeof schema>;

export function useLoginController() {
 const {register, handleSubmit: hookFormHandleSubmit, formState: {errors}} = useForm<FormData>({
  resolver: zodResolver(schema)
 });


 const { mutateAsync, isLoading} = useMutation({
  mutationFn: async (data: SigninParams) => {
   return authService.signin(data);
  },
 })

 const handleSubmit = hookFormHandleSubmit(async (data) => {
  try {
    const { accessToken } = await  mutateAsync(data);
    toast.success(accessToken);
  } catch {
    toast.error('Credenciais inválidas');
  }
 })
 return {handleSubmit, register, errors, isLoading}
}
