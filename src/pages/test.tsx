import React, { useEffect } from "react";

type Props = {};

const Test = (props: Props) => {
  const tata = async () => {
    const res = await fetch(`${process.env.API}/task/1`);
    const data = await res.json();
    console.log(data);
    // console.log(actualData);
  };

  useEffect(() => {
    tata();
  }, []);

  return <div>Test</div>;
};

export default Test;
