import axios from "axios";
import React, { useEffect } from "react";

type Props = {};

const Test = (props: Props) => {
  const tata = async () => {
    // const res = await fetch(`${process.env.API}/task/1`);
    const body = { token: "234" };
    const res = await axios.delete(`${process.env.API}/task/43534`, { data: body });
    // const data = await res.json();
    console.log(res);
    // console.log(actualData);
  };

  useEffect(() => {
    tata();
  }, []);

  return <div>Test</div>;
};

export default Test;
