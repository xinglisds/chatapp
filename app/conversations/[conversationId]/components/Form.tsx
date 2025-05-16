'use client';

import { useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import useConversation from "@/app/hooks/useConversation";
import Modal from "@/app/components/Modal";
import MessageInput from "./MessageInput";
import AiReplyButton from "./AiReplyButton"; // 注意：现在是纯按钮组件
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

const Form = () => {
  const { conversationId } = useConversation();
  const session = useSession();
  const [aiResponse, setAiResponse] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editableResponse, setEditableResponse] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });
    axios.post('/api/messages', {
      ...data,
      conversationId
    });
  };

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId
    });
  };

  const fetchLatestMessage = async () => {
    try {
      const response = await axios.get(`/api/conversations/${conversationId}/latest-message`);
      const latestMessage = response.data.message;
      if (latestMessage.sender.email !== session.data?.user?.email) {
        return latestMessage.body;
      }
    } catch (error) {
      console.error("Failed to fetch latest message", error);
    }
    return "";
  };

  const handleAiReply = useCallback(async () => {
    const latestMessage = await fetchLatestMessage();
    if (!latestMessage) return;

    try {
      const response = await axios.post('/api/artificialIntelligence', { message: latestMessage });
      setAiResponse(response.data.reply);
      setEditableResponse(response.data.reply);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to generate AI reply", error);
    }
  }, [conversationId]);

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="fpr8jf4m"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <AiReplyButton onClick={handleAiReply} />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="space-y-6">
            <div className="border-b border-gray-900/10 pb-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                AI Suggested Reply
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                This is a generated response based on the latest message:
              </p>
              <textarea
                className="mt-4 p-4 w-full rounded-md bg-gray-100 text-sm text-gray-800"
                value={editableResponse}
                onChange={(e) => setEditableResponse(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-x-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setValue("message", editableResponse);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Use Reply
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Form;
