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


import { signUp } from "@/lib/actions";
import { useState } from "react";

export default function Login() {
    const [errorMessage, setErrorMessage] = useState("");
    const [working, setWorking] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = await signUp(formData);

        if (result.success) {
            // Redirect to login page or show a success message
            setWorking(result.success);
        } else {
            setErrorMessage(result.message);
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
                    <DialogTitle className="">Login / Register</DialogTitle>
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
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="email" className="">Email</Label>
                                            <Input id="email" defaultValue="pedro@example.com" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="password" className="">Password</Label>
                                            <Input id="password" type="password" />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="bg-white text-black">Login</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="register">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="">Register</CardTitle>
                                        <CardDescription className="">
                                            Register your account here. After saving, you can login in on the other tab.
                                        </CardDescription>
                                    </CardHeader>
                                    <form action={signUp}>
                                        <CardContent className="space-y-2">
                                            <div className="space-y-1">
                                                <Label htmlFor="email" className="">Email</Label>
                                                <Input name="email" id="email" defaultValue="pedro@example.com" />
                                            </div>
                                            {/* username */}
                                            <div className="space-y-1">
                                                <Label htmlFor="username" className="">Username</Label>
                                                <Input name="username" id="username" defaultValue="pedro" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="password" className="">Password</Label>
                                                <Input name="password" id="password" type="password" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="confirm-password" className="">Confirm Password</Label>
                                                <Input id="confirm-password" type="password" />
                                            </div>
                                            {working && <div className="text-black">Working...</div>}
                                        </CardContent>
                                        <CardFooter>
                                            <Button type="submit" className="bg-[#270927] text-white">Register</Button>
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
