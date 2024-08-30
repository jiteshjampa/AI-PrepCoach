import { Lightbulb, Volume2 } from "lucide-react";
import React, { useEffect } from "react";

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("sorry your browser doesnot support text to speech");
    }
  };
  useEffect(() => {
    console.log(mockInterviewQuestion);
  }, []);

  return (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion &&
          mockInterviewQuestion.map((question, index) => (
            <div key={index}>
              <h2
                className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
                  activeQuestionIndex === index
                    ? "bg-primary text-white"
                    : "bg-secondary"
                }`}
              >
                Question #{index + 1}
              </h2>
            </div>
          ))}
      </div>
      {mockInterviewQuestion?.length > 0 && (
        <div>
          <h2 className="my-5 text-md md:text-lg">
            {mockInterviewQuestion[activeQuestionIndex]?.question}
          </h2>
          <Volume2
            className="cursor-pointer"
            onClick={() => {
              textToSpeech(
                mockInterviewQuestion[activeQuestionIndex]?.question
              );
            }}
          />
        </div>
      )}
      {process.env.NEXT_PUBLIC_QUESTION_NOTE && (
        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
          <h2 className="flex gap-2 items-center text-primary">
            <Lightbulb /> <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-primary my-2">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      )}
    </div>
  );
};

export default QuestionSection;
