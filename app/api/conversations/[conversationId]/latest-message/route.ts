import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(
  request: Request,
  { params }: { params: { conversationId?: string } }
) {
  console.log("📥 收到请求: /api/conversations/[conversationId]/latest-message");
  console.log("请求的 params 参数:", params);

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { conversationId } = params;
  if (!conversationId) {
    return new NextResponse('Invalid conversation ID', { status: 400 });
  }

  console.log("Fetching latest message for conversation:", conversationId);
  console.log("Current user email:", currentUser.email);

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          include: { sender: true },
        },
      },
    });

    if (!conversation) {
      console.log("Conversation not found.");
      return new NextResponse('Conversation not found', { status: 404 });
    }

    console.log("Messages in conversation:", conversation.messages);

    const latestMessage = conversation.messages.find(
      (message) => message.sender.email !== currentUser.email
    );

    if (!latestMessage) {
      console.log("No messages from other users found.");
      return new NextResponse('No messages from other users found', { status: 404 });
    }

    console.log("Latest message found:", latestMessage);
    return new NextResponse(JSON.stringify({ message: latestMessage }), { status: 200 });
  } catch (error) {
    console.error("Error fetching latest message:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 