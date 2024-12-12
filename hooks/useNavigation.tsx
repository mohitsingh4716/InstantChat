import { MessageSquare, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

export const useNavigation = () => {
    const pathname= usePathname();

    const paths = useMemo(()=>[
        {
            name: "Conversations",
            href:"/conversations",
            icons: <MessageSquare/>,
            active: pathname.startsWith("/conversation"),
        },
        {
            name: "Friends",
            href:"/friends",
            icons: <Users/>,
            active: pathname.startsWith("/friends"),
        }
    ],
    [pathname]
);
return paths;
};