"use client";
// import { cn } from "@/lib/utils";
// import { Button } from "./ui/button";
// import Image from "next/image";
// import { ComponentProps, PropsWithChildren } from "react";

// export function Form({
//   className,
//   img,
//   footer,
//   children,
//   heading,
//   subheading,
//   buttonContent,
//   onSubmit,
//   ...props
// }: React.ComponentPropsWithoutRef<"form"> &
//   PropsWithChildren<{
//     img?: ComponentProps<typeof Image>;
//     heading?: string | React.ReactNode;
//     subheading?: string | React.ReactNode;
//     footer?: string | React.ReactNode;
//     buttonContent?: string | React.ReactNode;
//   }>) {
//   return (
//     <div className="h-svh bg-white">
//       <form
//         className={cn("w-[85%] mx-auto", className)}
//         {...props}
//         onSubmit={(e) => {
//           e.preventDefault();
//           onSubmit?.(e);
//         }}>
//         {img && (
//           <div className="w-[88px] aspect-square mx-auto">
//             <Image src={img.src} alt="heading" className="object-cover" />
//           </div>
//         )}

//         {heading && (
//           <h1 className="text-2xl text-primary font-semibold text-center">
//             {heading}
//           </h1>
//         )}
//         {subheading && <p className="text-center text-darker">{subheading}</p>}
//         {children}
//         <Button type="submit" className="w-full">
//           {buttonContent}
//         </Button>
//         <footer className="mt-8">{footer}</footer>
//       </form>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
export const dynamic = "force-dynamic";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import FormInput from "./FormInput";

export function Form({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { loginPayload, isLoading, setLogin, validateLogin, login } = useAuth();
  const [lastPath, setLastPath] = React.useState<string>("/");
  const { toast } = useToast();
  const route = useRouter();
  React.useEffect(() => {
    const lastVisitedPath = localStorage.getItem("lastVisitedPath");
    setLastPath(lastVisitedPath || "/");
  }, []);
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const response = await login();
      if (response) {
        toast({ title: response.message, variant: "default" });
        setTimeout(() => {
          route.replace("/");
        }, 1500);
      }
    } catch (err) {
      const error = err as Error;
      toast({ title: error.message, variant: "destructive" });
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleLogin}>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-xl md:text-2xl font-medium">
          Login to your account
        </span>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <FormInput
            id="email"
            type="email"
            placeholder="st@example.com"
            onChange={(e) => setLogin("email", e.target.value)}
            value={loginPayload.email}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-xs md:text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <FormInput
            id="password"
            type="password"
            onChange={(e) => setLogin("password", e.target.value)}
            value={loginPayload.password}
          />
        </div>
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={!validateLogin()}>
          {isLoading && <Loader className="animate-spin" />}
          Login
        </Button>
      </div>
    </form>
  );
}
