"use client";
import Webcam from "react-webcam";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAiModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  const [userAnswer, setUserAnswer] = useState("");
  useEffect(() => {
    if (isRecording) {
      // Clear previous results
      setUserAnswer("");
      results.map((result) => {
        setUserAnswer((prevAns) => prevAns + result.transcript);
      });

      console.log(results + " results are final");
    }
  }, [results, isRecording]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 0) {
      UpdateUserAnswer();
    }
    console.log(userAnswer);
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      setUserAnswer("");
    } else {
      startSpeechToText();
    }
  };
  const UpdateUserAnswer = async () => {
    try {
      setLoading(true);

      const feedbackPrompt = `
        Question: ${mockInterviewQuestion[activeQuestionIndex]?.question},
        User Answer: ${userAnswer},
        Depends on question and user answer for given interview question, 
        please give us a rating for the answer and feedback as an area of improvement if any 
        in just 3-5 lines to improve it in JSON format with rating field and feedback field.
      `;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");

      const JsonFeedbackResp = JSON.parse(mockJsonResp); // Parse JSON here

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });

      if (resp && userAnswer.length > 0) {
        toast("User Answer Recorded Successfully");
        setResults([]);
      }
      setResults([]);
    } catch (err) {
      console.error("Error updating user answer:", err);
      toast.error("Failed to record user answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center bg-black rounded-lg p-5 mt-20">
        <Image
          src="/webcam.png" // Ensure this is a PNG image
          alt="Webcam"
          width={100}
          height={100}
          className="absolute"
        />

        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2">
            <Mic />
            Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
    </div>
  );
};

export default RecordAnswerSection;
