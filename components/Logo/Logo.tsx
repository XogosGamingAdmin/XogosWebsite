import clsx from "clsx";
import Image from "next/image";
import { ComponentProps } from "react";
import icon from "@/app/banner.jpg"; // Make sure the path is correct
import styles from "./Logo.module.css";

export function Logo({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={clsx(className, styles.logo)} {...props}>
      <Image
        src={icon}
        alt="Xogos Gaming Logo"
        className={styles.icon}
        width={110}
        height={42}
      />
    </div>
  );
}
