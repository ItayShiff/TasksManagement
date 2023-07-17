
"use client";

import styles from './page.module.css'
import Task from '../Task/task'
import React from "react";

type Props = {
  Tasks: Task[]
};

const HomeClientComponent = ({Tasks}: Props) => {
  console.log('This is my tasks', Tasks);
  
  return <div>HomeClientComponent</div>;
};

export default HomeClientComponent;
