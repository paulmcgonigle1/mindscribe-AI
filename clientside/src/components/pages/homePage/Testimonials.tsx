import React, { useEffect, useState } from "react";

const testimonialsData = [
  {
    id: 1,
    name: "Alice Johnson",
    text: "MindScribe has been a game-changer for tracking my mental health and staying proactive about my emotional well-being.",
  },
  {
    id: 2,
    name: "Mark Bennett",
    text: "This app helps me understand my mood patterns better and has made journaling something I look forward to every day.",
  },
  {
    id: 3,
    name: "Sarah Lee",
    text: "The insights provided by MindScribe are incredibly helpful and their daily tasks make a real difference in my routine.",
  },
];

function Testimonials() {
  const [current, setCurrent] = useState(0);
  const length = testimonialsData.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(current === length - 1 ? 0 : current + 1);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, [current, length]);

  return (
    <div className="w-full bg-light-yellow p-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        What Our Users Say
      </h2>
      <div className="overflow-hidden relative">
        {testimonialsData.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className={` transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            style={{ left: 0, right: 0 }}
          >
            <p className="text-gray-600 text-center text-lg">
              "{testimonial.text}"
            </p>
            <p className="text-gray-800 text-center font-bold mt-4">
              {testimonial.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
