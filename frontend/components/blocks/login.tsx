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
        // TODO: Remove this console.log
        console.log(result);

        if (result.success) {
            //ADD: Redirect to login page or show a success message
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
        // TODO: Remove this console.log
        console.log(result);

        if (result.success) {
            // Redirect to login page or show a success message
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
                <Button className="bg-[#270927] px-3 py-2 font-bold capitalize text-white hover:bg-[#440f44]">
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
                                <TabsTrigger value="login" className="">Login</TabsTrigger>
                                <TabsTrigger value="register" className="">Register</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="">Login</CardTitle>
                                        <CardDescription className="">
                                            Login to your account here.
                                        </CardDescription>
                                    </CardHeader>
                                    <form onSubmit={handleLogin}>
                                        <CardContent className="space-y-2">

                                            <div className="space-y-1">
                                                <Label htmlFor="username" className="capitalize">username</Label>
                                                <Input name="username" id="username" placeholder="pedro" required />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="password" className="capitalize">Password</Label>
                                                <Input name="password" id="password" type="password" placeholder="123456" required />
                                            </div>
                                            {/* TODO: Improve coloring of error message */}
                                            <h3 className='my-3 text-black'>
                                                {errorMessage}
                                            </h3>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="bg-[#270927] text-white hover:bg-[#440f44]">Login</Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                            </TabsContent>
                            <TabsContent value="register">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="">Register</CardTitle>
                                        <CardDescription className="">
                                            Register your account here. After saving, you can log in on the other tab.
                                        </CardDescription>
                                    </CardHeader>
                                    <form onSubmit={handleRegister}>
                                        <CardContent className="space-y-2">
                                            <div className="space-y-1">
                                                <Label htmlFor="email" className="">Email</Label>
                                                <Input name="email" id="email" placeholder="pedro@example.com" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="username" className="">Username</Label>
                                                <Input name="username" id="username" placeholder="pedro" required />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="password" className="">Password</Label>
                                                <Input name="password"
                                                    value={password}
                                                    required
                                                    onChange={handlePasswordChange}
                                                    id="password" type="password" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="confirm-password" className="">Confirm Password</Label>
                                                <Input name="confirm-password" id="confirm-password"
                                                    value={confirmPassword}
                                                    onChange={handleConfirmPasswordChange}
                                                    type="password" required />
                                            </div>
                                            {/* Add input for nearId */}
                                            <div className="space-y-1">
                                                <Label htmlFor="nearId" className="">Near ID</Label>
                                                <Input required name="nearId" id="nearId" placeholder="near_id" />
                                            </div>
                                            {/* TODO: Improve coloring of error message */}
                                            <h3 className='my-3 text-black'>
                                                {errorMessage}
                                            </h3>
                                        </CardContent>
                                        <CardFooter>
                                            <Button type="submit" className="bg-[#270927] text-white hover:bg-[#440f44]" disabled={!validatePasswords()}>Register</Button>
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
