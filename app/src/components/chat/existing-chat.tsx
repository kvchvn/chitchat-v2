import { useCallback, useEffect, useRef } from 'react';
import { ChatBlock } from '~/components/chat/chat-block';
import { ChatForm } from '~/components/chat/chat-form';
import { useUserId } from '~/components/contexts/user-id-provider';
import { MessageContainer } from '~/components/message/message-container';
import { MessageStatusBar } from '~/components/message/message-status-bar';
import { MessageStatusIcon } from '~/components/message/message-status-icon';
import { MessageTime } from '~/components/message/message-time';
import { useBlockUserSubscription } from '~/hooks/use-block-user-subscription';
import { useCompanionId } from '~/hooks/use-companion-id';
import { useNewMessagesSubscription } from '~/hooks/use-new-messages-subscription';
import { useNewReadMessagesSubscription } from '~/hooks/use-new-read-messages-subscription';
import { type ChatMessage } from '~/server/db/schema/messages';
import { api } from '~/trpc/react';

type Props = {
  messages: (ChatMessage | null)[];
  blockedBy: string | null;
};

export const ExistingChat = ({ messages, blockedBy }: Props) => {
  const userId = useUserId();
  const companionId = useCompanionId();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstUnreadMessageRef = useRef<HTMLLIElement | null>(null);
  const unreadMessages = useRef<Set<string>>(new Set([]));
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: readUnreadMessages } = api.messages.readUnreadMessages.useMutation();

  useNewMessagesSubscription();
  useNewReadMessagesSubscription({ companionId });
  useBlockUserSubscription();

  const onReadMessages = useCallback(() => {
    if (unreadMessages.current.size) {
      readUnreadMessages({
        senderId: companionId,
        receiverId: userId,
        messagesIds: Array.from(unreadMessages.current),
      });
    }
  }, [userId, companionId, readUnreadMessages]);

  const handleScroll = () => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    timerIdRef.current = setTimeout(() => {
      onReadMessages();
      unreadMessages.current.clear();
    }, 1000);
  };

  const onSendMessageSideEffect = () => {
    firstUnreadMessageRef.current = null;
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const containerOffset =
      containerRef.current.scrollHeight -
      (containerRef.current.scrollTop + containerRef.current.clientHeight);

    // scroll to the bottom when send a message
    if (messages.at(-1)?.senderId === userId || containerOffset < 200) {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages.length, userId]);

  useEffect(() => {
    // initial scroll to the freshest unread message or to the bottom of the chat
    const container = containerRef.current;
    const message = firstUnreadMessageRef.current;

    if (container) {
      if (message) {
        container.scrollTo({ top: message.offsetTop - message.offsetHeight - 100 });
      } else {
        container.scrollTo({ top: container.scrollHeight });
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // such way I get the freshest unreadMessages ref
    const timerId = setTimeout(() => {
      onReadMessages();
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [onReadMessages, messages.length]);

  return (
    <>
      {messages.length ? (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="relative mb-4 mt-2 w-[calc(100%+8px)] grow overflow-y-auto pr-[8px] scrollbar scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg scrollbar-w-[4px]">
          <ul className="flex min-h-full flex-col justify-end gap-2 overflow-y-auto px-1 pb-1 pt-4">
            {messages.map((message) =>
              message ? (
                <MessageContainer
                  key={message.id}
                  messageId={message.id}
                  fromCurrentUser={userId === message.senderId}
                  isRead={message.isRead}
                  unreadMessages={unreadMessages.current}
                  ref={firstUnreadMessageRef}>
                  <span className="px-5">{message.text}</span>
                  <MessageStatusBar fromCurrentUser={userId === message.senderId}>
                    <MessageTime createdAt={message.createdAt} />
                    {userId === message.senderId ? (
                      <MessageStatusIcon isRead={message.isRead} isSent={message.isSent} />
                    ) : null}
                  </MessageStatusBar>
                </MessageContainer>
              ) : null
            )}
          </ul>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-gray-dark dark:text-gray-light">There are no messages yet...</span>
        </div>
      )}
      {blockedBy ? (
        <ChatBlock byCurrentUser={blockedBy === userId} />
      ) : (
        <ChatForm onSubmitSideEffect={onSendMessageSideEffect} />
      )}
    </>
  );
};
