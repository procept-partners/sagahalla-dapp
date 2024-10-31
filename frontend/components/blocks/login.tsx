import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { LogIn } from "lucide-react";

import { signUp, logIn } from "@/lib/actions";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Login() {
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    const validatePasswords = () => {
        return password === confirmPassword && password !== '';
    };

    const router = useRouter(); // Initialize useRouter
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await logIn(formData);

        if (result.success) {
            setPassword("");
            setErrorMessage("Logged in successfully! Holding on...");
            setTimeout(() => {
                setErrorMessage("...refreshing!");
                window.location.reload(); // Force a full page reload
            }, 3000);
        } else if (result.message) {
            setErrorMessage(result.message);
            setTimeout(() => {
                setErrorMessage("");
            }, 8000);
        }
    };

    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validatePasswords()) {
            setErrorMessage("Passwords don't match!");
            return;
        }

        const formData = new FormData(event.currentTarget);
        const result = await signUp(formData);

        if (result.success) {
            setConfirmPassword("");
            setPassword("");
            setErrorMessage("User registered successfully!");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        } else if (result.message) {
            setErrorMessage(result.message);
            setTimeout(() => {
                setErrorMessage("");
            }, 8000);
        }
    };

    return (
        <Dialog>
            <DialogTrigger>
                {/* Adjusted the Login button for consistency */}
                <Button className="flex items-center bg-[#ce711e] px-4 py-2 font-bold text-white hover:bg-[#a85a18]">
                    Login
                    <LogIn className="ml-2 h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="w-fit rounded-md border border-yellow-400 bg-[#270927] text-white shadow-lg focus:outline-none">
                <DialogHeader>
                    <DialogTitle className="text-center">Login / Register</DialogTitle>
                    <DialogDescription>
                        <Tabs defaultValue="login" className="w-[400px]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Register</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Login</CardTitle>
                                        <CardDescription>
                                            Login to your account here.
                                        </CardDescription>
                                    </CardHeader>
                                    <form onSubmit={handleLogin}>
                                        <CardContent className="space-y-2">
                                            <div className="space-y-1">
                                                <Label htmlFor="username">Username</Label>
                                                <Input className='bg-white' name="username" id="username" placeholder="Username" required />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="password">Password</Label>
                                                <Input className='bg-white' name="password" id="password" type="password" placeholder="Password" required />
                                            </div>
                                            <h3 className='my-3 text-yellow-900'>
                                                {errorMessage}
                                            </h3>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="bg-[#ce711e] text-white hover:bg-[#a85a18]">
                                                Login
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </TabsContent>
                            <TabsContent value="register">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Register</CardTitle>
                                        <CardDescription>
                                            Register your account here. After saving, you can log in on the other tab.
                                        </CardDescription>
                                    </CardHeader>
                                    <form onSubmit={handleRegister}>
                                        <CardContent className="space-y-2">
                                            <div className="space-y-1">
                                                <Label htmlFor="email">Email</Label>
                                                <Input className='bg-white' name="email" id="email" placeholder="Email" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="username">Username</Label>
                                                <Input className='bg-white' name="username" id="username" placeholder="Username" required />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="password">Password</Label>
                                                <Input className='bg-white' name="password" value={password} required onChange={handlePasswordChange} id="password" type="password" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                                <Input className='bg-white' name="confirm-password" id="confirm-password" value={confirmPassword} onChange={handleConfirmPasswordChange} type="password" required />
                                            </div>
                                            <h3 className='my-3 text-yellow-900'>
                                                {errorMessage}
                                            </h3>
                                        </CardContent>
                                        <CardFooter>
                                            <Button type="submit" className="bg-[#ce711e] text-white hover:bg-[#a85a18]" disabled={!validatePasswords()}>
                                                Register
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
