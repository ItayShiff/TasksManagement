import Image from "next/image";
import styles from "./page.module.css";
import HomeTasksList from "@/components/ClientComponents/HomeTasksList/HomeTasksList";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Task Management",
  description: "A site that allows you to manage your tasks",
};

export default async function HomeServerComponent() {
  return (
    <div>
      <div id={styles.flex}>
        <Image src="/task.png" alt="Task Management App" width={25} height={25}></Image>
        <h1 id={styles.title}>Task Management</h1>
        <Image src="/task.png" alt="Task Management App" width={25} height={25}></Image>
      </div>
      <div id={styles.wrapperTasks}>
        <HomeTasksList />
      </div>
    </div>
  );
}
