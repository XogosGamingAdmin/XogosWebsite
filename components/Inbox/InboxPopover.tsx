import { ClientSideSuspense } from "@liveblocks/react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ComponentProps, useEffect, useState } from "react";
import { InboxIcon } from "@/icons";
import { useUnreadInboxNotificationsCount } from "@/liveblocks.config";
import { Button } from "@/primitives/Button";
import { Popover } from "@/primitives/Popover";
import { Inbox } from "./Inbox";
import styles from "./InboxPopover.module.css";

function InboxPopoverUnreadCount() {
  // Parent component ensures session.user.info exists before rendering this
  const { count } = useUnreadInboxNotificationsCount();

  return count ? (
    <div className={styles.inboxPopoverUnreadCount}>{count}</div>
  ) : null;
}

export function InboxPopover(
  props: Omit<ComponentProps<typeof Popover>, "content">
) {
  const pathname = usePathname();
  const [isOpen, setOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Don't render inbox if no session
  if (!session?.user?.info) {
    return null;
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={setOpen}
      content={<Inbox className={styles.inboxPopover} />}
      {...props}
    >
      <Button variant="secondary" icon={<InboxIcon />} iconButton>
        <ClientSideSuspense fallback={null}>
          {() => <InboxPopoverUnreadCount />}
        </ClientSideSuspense>
      </Button>
    </Popover>
  );
}
