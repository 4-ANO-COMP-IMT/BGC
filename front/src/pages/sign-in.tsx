import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useContext, useEffect } from "react";
import { UserContext } from "@/contexts/user-context";

const LoginSchema = z
  .object({
    email: z.string().email({ message: "Email Invalido." }),
    password: z.string(),
  })
  .refine(
    (data) =>
      data.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      ),
    {
      message:
        "A senha deve ter pelo menos 8 caracteres, conter uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
      path: ["password"],
    },
  );

export default function SignIn() {
  const { setUser, user } = useContext(UserContext);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    const response = await axios({
      method: "post",
      url: "http://localhost:3000/sign-in",
      data: {
        email: values.email,
        password: values.password,
      },
    });

    setUser({
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
      company: response.data.company,
      role: response.data.role,
    });
  }

  useEffect(() => {
    if (user) {
      window.location.replace("/");
    }
  }, [user]);

  return (
    <div className="w-screen h-screen bg-muted flex items-center justify-center">
      <Card className="w-10/12 md:max-w-lg">
        <CardHeader>
          <CardTitle>Fazer Login</CardTitle>
          <CardDescription>
            Bem-vindo de volta! Conecte-se e deixe a eficiência transformar suas
            reuniões.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="exemplo@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit" className="w-full">
                Logar
              </Button>
            </form>
          </Form>
          <p className="text-muted-foreground text-sm w-full text-center pt-5">
            Ainda não tem uma conta?{" "}
            <a href="/sign-up" className="hover:underline">
              <strong className="font-semibold">Crie uma agora</strong>
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
