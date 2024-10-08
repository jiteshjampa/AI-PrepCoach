"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import Link from "next/link";

export default function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    console.log(params.interviewId);
    getInterviewDetails();
  }, []);
  useEffect(() => {
    if (interviewData) {
      console.log(interviewData);
    }
  }, [interviewData]);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    console.log(result[0]);
    setInterviewData(result[0]);
  };

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          {interviewData ? (
            <div className="flex flex-col my-5 gap-5 ">
              <div className="flex flex-col p-5 rounded-lg border gap-5">
                <h2 className="text-lg">
                  <strong>Job Role/Job Position:</strong>{" "}
                  {interviewData.jobPosition}
                </h2>
                <h2 className="text-lg">
                  <strong>Job Description/Tech Stack:</strong>{" "}
                  {interviewData.jobDesc}
                </h2>
                <h2 className="text-lg">
                  <strong>Years of Experience:</strong>{" "}
                  {interviewData.jobExperience}
                </h2>
              </div>
              <div className="p-5 bg-yellow-100 border-yellow-300 rounded-lg ">
                <h2 className="flex items-center gap-2 text-yellow-500">
                  <Lightbulb />
                  <strong>Information</strong>
                </h2>
                <h2 className="text-yellow-500">
                  {process.env.NEXT_PUBLIC_INFORMATION}
                </h2>
              </div>
            </div>
          ) : (
            <p>Loading interview details...</p>
          )}
        </div>
        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <WebcamIcon className="h-72 w-full my-7 bg-secondary p-20 rounded-lg border" />
          )}
          <Button
            variant="ghost"
            onClick={() => {
              setWebCamEnabled(true);
            }}
            className=" w-full "
          >
            Enable Web Cam and Microphone
          </Button>
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}
