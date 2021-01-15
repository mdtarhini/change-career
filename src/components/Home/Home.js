import React from "react";
import { useState } from "react";
import CategoryNavigation from "./CategoryNavigation";
import ListOfPosts from "../ListOfPosts/ListOfPosts";
const Home = (props) => {
  const [category, setCategory] = useState("all");

  const onCategoryChanged = (value) => {
    setCategory(value);
  };
  return (
    <div className="home">
      <ListOfPosts
        withAddButton
        orderByChildKey={category === "all" ? "date" : "category"}
        orderByChildValue={category === "all" ? null : category}
      >
        <CategoryNavigation
          value={category}
          onValueChange={onCategoryChanged}
        />
      </ListOfPosts>
    </div>
  );
};

export default Home;
