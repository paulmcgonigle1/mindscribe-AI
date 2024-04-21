import React from "react";

function AboutSection() {
  return (
    <div className=" py-12 px-8 md:px-24">
      <h2 className="text-3xl text-gray-800 font-bold mb-6">
        About MindScribe
      </h2>
      <p className="text-gray-600 mb-4">
        In a world where the pace of life accelerates daily, mental health
        concerns are becoming more prevalent, affecting all demographics but
        especially impacting students and young adults. The complexities of
        modern life demand innovative solutions to manage and understand our
        emotional well-being.
      </p>
      <p className="text-gray-600 mb-4">
        MindScribe leverages the power of Artificial Intelligence and Large
        Language Models to offer a unique solution—a mental health journaling
        web application designed to transform your emotional health journey. Our
        platform enables users to gain deep insights into their emotional
        patterns, helping identify stressors and mood enhancers, and providing
        actionable, personalized tasks based on AI-driven analysis.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-light-yellow p-4 rounded shadow-lg">
          <h3 className="text-2xl text-gray-800 font-semibold mb-3">
            Our Mission
          </h3>
          <p className="text-gray-600">
            To empower individuals by providing accessible, effective tools for
            emotional intelligence and mental health management. We strive to
            break down the barriers of stigma and accessibility, making
            self-improvement an integral part of everyday life.
          </p>
        </div>
        <div className="bg-light-yellow p-4 rounded shadow-lg">
          <h3 className="text-2xl text-gray-800 font-semibold mb-3">
            Technology and Innovation
          </h3>
          <p className="text-gray-600">
            By integrating cutting-edge AI technology, MindScribe offers a
            responsive and intuitive interface for journaling, mood tracking,
            and visualization. This technology not only understands the nuances
            of human emotions but also supports the user in creating a more
            positive mental health trajectory.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
