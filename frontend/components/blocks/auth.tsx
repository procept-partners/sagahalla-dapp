import Login from "./login";
import { authenticate, logOut } from "@/lib/actions";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export const Auth = () => {

    // ADD: Better security for session cookies
    const [session, setSession] = React.useState(false);
    const [username, setUsername] = React.useState('');

    const fetchData = async () => {
        setSession((await authenticate()).success);
        setUsername((await authenticate()).user?.username || '');
    };

    const handleLogout = async () => {
        const result = await logOut();
        if (result.success) {
            setSession(false);
        } else {
            console.error(result.message);
        }
    };

    React.useEffect(() => { fetchData() }, []);
    return (
        <div>
            {session ?

                (
                    <>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="">
                                <Avatar>
                                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                    <AvatarFallback className="bg-black uppercase">{username.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-fit">
                                <Button variant={"ghost"} onClick={() => handleLogout()} className="w-fit font-bold capitalize">
                                    <DropdownMenuLabel className="w-fit">
                                        Logout
                                    </DropdownMenuLabel>
                                </Button>
                                {/* <DropdownMenuSeparator /> */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>

                )
                : <Login />}
        </div>
    )
}