"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAiModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";
const AddNewInterview = () => {
  const [openDialog, setDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [JobDescription, setJobDescription] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const InputPrompt = `Job position:${jobPosition} , job description:${JobDescription},jobexperience:${jobExperience}. depends on the job positon, job description and job experience please give ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} questions along with answers in json format. question and answer are field of json. i need only in json form at and only that much is enough no need of extra explanation outside json and answer with respect to the job data`;
    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    console.log(JSON.parse(MockJsonResp));
    setLoading(false);
    if (MockJsonResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition: jobPosition,
          jobDesc: JobDescription,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .returning({ mockId: MockInterview.mockId });
      console.log("Inserted ID", resp);
      if (resp) {
        setDialog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } else {
      crossOriginIsolated.log("error");
    }
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md  cursor-pointer transition-all"
        onClick={() => {
          setDialog(true);
        }}
      >
        <h2 className="font-bold text-lg">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className=" text-2xl">
              Tell us more about your Job Interviewing
            </DialogTitle>
            <form onSubmit={onSubmit}>
              <DialogDescription>
                <div>
                  <h2>
                    Add details about your job position/role, Job description
                    and years of experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label htmlFor="">Job Role/Position</label>
                    <Input
                      onChange={(event) => {
                        setJobPosition(event.target.value);
                      }}
                      placeholder="Ex. Full Stack Developer"
                      required
                    />
                  </div>
                  <div className="my-3">
                    <label htmlFor="">
                      Job Description/Tech Stack (In Short)
                    </label>
                    <Textarea
                      placeholder="Ex. React, Angular, Node Js, MYSQL, etc"
                      required
                      onChange={(event) => {
                        setJobDescription(event.target.value);
                      }}
                    />
                  </div>
                  <div className="my-3">
                    <label htmlFor="">Years of experience</label>
                    <Input
                      placeholder="Ex.5"
                      type="number"
                      max="50"
                      required
                      onChange={(event) => {
                        setJobExperience(event.target.value);
                      }}
                    />
                  </div>
                </div>
              </DialogDescription>
              <div className="flex gap-5 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setDialog(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      'Generating from AI'
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
