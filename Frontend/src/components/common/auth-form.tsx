import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
interface LoginFormProps extends React.ComponentProps<"div"> {
    type: "login" | "register";
}
export function AuthForm({
    className,
    type = "login",
    ...props
}: LoginFormProps) {
    const isRegister = type === "register";
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const { login, register, loginLoading, registerLoading } = useAuth();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (isRegister) {
            await register({
                names: data.name as string,
                email: data.email as string,
                telephone: data.phone as string,
                password: data.password as string,
            });
            console.log(data);
        } else {
            await login({
                email: data.email as string,
                password: data.password as string,
            });
        }
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden md:w-[120%] w-[100%]">
                <CardContent className="grid p-0 gap-6 md:grid-cols-2">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">
                                    {isRegister
                                        ? "Create an account"
                                        : "Welcome back"}
                                </h1>
                                <p className="text-balance text-muted-foreground">
                                    {isRegister
                                        ? "Register to use SMS"
                                        : "Login to your SMS account"}
                                </p>
                            </div>
                            {isRegister && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+250..."
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2 relative">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="pr-10"
                                    placeholder="********"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-[32px] text-muted-foreground cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {!isRegister && (
                                <div className="flex items-end justify-end pt-2">
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                            )}
                            <Button
                                type="submit"
                                className={`w-full cursor-pointer ${
                                    loginLoading || registerLoading
                                        ? "opacity-70"
                                        : ""
                                }`}
                                disabled={loginLoading || registerLoading}
                            >
                                {loginLoading || registerLoading ? (
                                    <div className="flex items-center justify-center gap-x-2 w-full">
                                        <ClipLoader size={20} color="#fff" />
                                        <span>Please wait...</span>
                                    </div>
                                ) : (
                                    <span>
                                        {isRegister ? "Register" : "Login"}
                                    </span>
                                )}
                            </Button>
                            <div className="text-center text-sm">
                                {isRegister ? (
                                    <>
                                        Already have an account?{" "}
                                        <a
                                            href="/login"
                                            className="underline underline-offset-4"
                                        >
                                            Login
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        Don&apos;t have an account?{" "}
                                        <a
                                            href="/register"
                                            className="underline underline-offset-4"
                                        >
                                            Sign up
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="/parking.png"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
