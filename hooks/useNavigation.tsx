import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { MessageSquare, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

export const useNavigation = () => {
    const pathname= usePathname();

    const requestsCount= useQuery(api.requests.count);

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
            count: requestsCount,

        }
    ],
    [pathname, requestsCount]
);
return paths;
};