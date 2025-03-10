import { SendHorizonal } from 'lucide-react';
import {
  type ChangeEventHandler,
  type FormEventHandler,
  type KeyboardEventHandler,
  useId,
  useState,
} from 'react';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { useToast } from '~/hooks/use-toast';
import { type ChatPretty } from '~/server/db/schema/chats';
import { api } from '~/trpc/react';

type Props = {
  chat: ChatPretty;
  onSubmitSideEffect: () => void;
};

export const ChatForm = ({ chat, onSubmitSideEffect }: Props) => {
  const utils = api.useUtils();
  const newMessageId = useId();
  const { toast } = useToast();
  const [message, setMessage] = useState('');

  const { mutate: sendMessage } = api.messages.create.useMutation({
    onMutate: async (newMessage) => {
      setMessage('');

      await utils.chats.getByMembersIds.cancel();

      const previousChat = utils.chats.getByMembersIds.getData();

      utils.chats.getByMembersIds.setData(
        { userId: chat.userId, companionId: chat.companionId },
        (oldData) =>
          oldData
            ? {
                chat: oldData.chat,
                messages: [
                  ...oldData.messages,
                  {
                    id: newMessageId,
                    chatId: newMessage.chatId,
                    senderId: newMessage.senderId,
                    receiverId: newMessage.receiverId,
                    text: newMessage.text,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isRead: false,
                    isSent: false,
                  },
                ],
              }
            : oldData
      );

      onSubmitSideEffect();

      return { previousChat };
    },
    onError: (_, __, context) => {
      utils.chats.getByMembersIds.setData(
        { userId: chat.userId, companionId: chat.companionId },
        context?.previousChat
      );

      toast({
        variant: 'destructive',
        title: 'Message sending failed',
        description: 'Something went wrong. Please try again later',
      });
    },
    onSettled: async () => {
      await utils.chats.getByMembersIds.invalidate({
        userId: chat.userId,
        companionId: chat.companionId,
      });
    },
  });

  const onSubmit = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    sendMessage({
      chatId: chat.chatId,
      senderId: chat.userId,
      receiverId: chat.companionId,
      text: trimmedMessage,
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLFormElement> = (e) => {
    if (e.ctrlKey && e.code === 'Enter') {
      setMessage((prevMessage) => `${prevMessage}\n`);
    } else if (!e.shiftKey && e.code === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessage(e.target.value);
  };

  return (
    <form
      onKeyDown={handleKeyDown}
      onSubmit={handleSubmit}
      className="mt-auto flex w-full gap-4 border-t border-slate-300 pt-2">
      <Textarea
        className="w-full resize-none bg-slate-100 p-2 scrollbar scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-w-[6px] dark:bg-slate-700"
        value={message}
        placeholder="Type your message..."
        maxRows={8}
        onChange={handleChange}
      />
      <Button type="submit" size="icon-lg" disabled={!message} className="shrink-0 rounded-full">
        <SendHorizonal />
      </Button>
    </form>
  );
};
