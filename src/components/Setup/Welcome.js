import React from "react";
import { Card, Carousel } from "antd";
const slideTitles = [
  "Are you considering a career change but your goals/path aren't clear ?",
  "Do you wish to get advices from people in similar situations ?",
  "Connect with career changers making brave choices just like you!",
];
const Welcome = (props) => {
  return (
    <Card className={`signup-message-card`}>
      <Carousel autoplay dots={false} autoplaySpeed={7000}>
        {slideTitles.map((title, index) => {
          return (
            <p className="sign-up-card-carousel" key={index}>
              {title}
            </p>
          );
        })}
      </Carousel>
    </Card>
  );
};
export default Welcome;
