import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function Login() {
    return <Dialog>
        <DialogTrigger>
            <Button className="bg-yellow-700 px-3 py-2 font-bold capitalize text-white hover:bg-yellow-800">
                Login
                <LogIn className="ml-2 h-5 w-5" />
            </Button>
        </DialogTrigger>
        <DialogContent className="w-fit rounded-md border border-yellow-400 bg-yellow-500 shadow-lg focus:outline-none">
            <DialogHeader>
                <DialogTitle>Login</DialogTitle>
                <DialogDescription>
                    {/* Input for login username and password */}
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="username" className="text-sm font-medium text-gray-900">
                            Username
                        </label>
                        <input type="text" name="username" id="username" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 sm:text-sm" placeholder="Username" />
                        <label htmlFor="password" className="text-sm font-medium text-gray-900">
                            Password
                        </label>
                        <input type="password" name="password" id="password" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-yellow-400 sm:text-sm" placeholder="Password" />
                    </div>
                    {/* Button to submit login form */}
                    <Button className="bg-yellow-700 px-3 py-2 font-bold uppercase text-white hover:bg-yellow-800">
                        Login
                    </Button>
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                {/* Add a link to register a new account */}
                <a href="#" className="text-sm font-medium text-gray-900">
                    Don't have an account? Register
                </a>
            </DialogFooter>
        </DialogContent>
    </Dialog>;
}
