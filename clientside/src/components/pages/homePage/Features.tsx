import { Text } from "../atoms/Text";
import { Card } from "../atoms/Card";
import { useCallback } from "react";
import Icon3 from "../../../assets/mindscribe2/svg/tasks.svg";
import Icon2 from "../../../assets/mindscribe2/svg/Analysis.svg";
import Icon1 from "../../../assets/mindscribe2/svg/statistics.svg";
import Icon4 from "../../../assets/mindscribe2/svg/writing.svg";

import { Fade } from "react-awesome-reveal";

const ServiceTexts = {
  firstText: "Features",
  secondText: "We Offer Various Features ",
  cards: [
    {
      firstText: "Analysis",
      secondText:
        "Deep AI- analysis and insights from your journal, tailored to the user",
    },
    {
      firstText: "Statistics",
      secondText:
        "Visual Statistics and charts for your data , to help you get a better understanding of your journals.",
    },
    {
      firstText: "Actionable Tasks",
      secondText:
        "AI-Created Actionable tasks that you can save , track and implement to improove your mood",
    },
    {
      firstText: "Journaling",
      secondText:
        "Intuitive Daily Journaling section which acts as the backbone to the application.",
    },
  ],
};
const Features = () => {
  const renderServiceIcon = useCallback((element: number) => {
    switch (element) {
      case 0:
        return Icon1;
      case 1:
        return Icon2;
      case 2:
        return Icon3;
      case 3:
        return Icon4;
      default:
        return "";
    }
  }, []);
  return (
    <section className="w-full h-auto flex flex-col items-center justify-center relative lg:px-20 md:px-20 px-6">
      <main className="w-full pt-5 flex flex-col gap-3 items-center justify-center">
        <Text
          as="p"
          className="font-light text-base text-color3/80 tracking-widest"
        >
          <Fade>{ServiceTexts.firstText}</Fade>
        </Text>
        <Text
          as="h2"
          className="md:text-4xl text-2xl font-medium capitalize text-color3"
        >
          <Fade>{ServiceTexts.secondText}</Fade>
        </Text>

        <div className="w-full h-auto grid lg:grid-cols-4 md:grid-cols-2 lg:gap-7 md:gap-10 gap-7 my-12 z-20 px-8 md:px-0">
          {ServiceTexts.cards.map((card, index) => (
            <Card
              cardClass="w-full bg-warm-orange-bright flex flex-col items-center justify-center py-6 cursor-pointer transition duration-300 hover:shadow-xl px-5 rounded-xl cardPseudo after:bg-color1"
              imageWrapperClass="w-50 h-28 relative z-10 before:content-[''] before:absolute before:top-3 before:right-3 before:w-16 before:h-16 before:bg-color2/30 before:-z-10 before:rounded-tl-3xl before:rounded-br-3xl"
              cover="object-cover"
              imageAlt={card.firstText}
              imageSrc={renderServiceIcon(index)}
              textWrapperClass="w-full flex flex-col items-center gap-2"
              key={index}
            >
              <Text
                as="h4"
                className="text-base rounded font-medium text-color3"
              >
                {card.firstText}
              </Text>
              <Text
                as="p"
                className="text-sm  font-light text-center text-color3"
              >
                {card.secondText}
              </Text>
            </Card>
          ))}
        </div>
      </main>
    </section>
  );
};

export default Features;
