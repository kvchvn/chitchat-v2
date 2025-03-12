import { cookies } from 'next/headers';
import type React from 'react';
import { UserIdProvider } from '~/components/contexts/user-id-provider';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable';
import { UsersList } from '~/components/user/users-list';
import { logger } from '~/lib/logger';
import { getServerAuthSession } from '~/server/auth';

const log = logger.child({ module: '(protected)/(chats)/layout.tsx' });

const RESIZABLE_GROUP_ID = 'chats';

export default async function ChatsLayout({ children }: React.PropsWithChildren) {
  const session = (await getServerAuthSession())!;

  const resizableLayout = cookies().get(`react-resizable-panels:${RESIZABLE_GROUP_ID}`);
  let defaultResizableLayout: number[] | undefined = undefined;

  if (resizableLayout) {
    try {
      const value: unknown = JSON.parse(resizableLayout.value);

      if (Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number') {
        defaultResizableLayout = value;
      }
    } catch (err) {
      log.error(err);
    }
  }

  return (
    <>
      <ResizablePanelGroup direction="horizontal" autoSaveId={RESIZABLE_GROUP_ID}>
        <ResizablePanel defaultSize={defaultResizableLayout?.[0]} maxSize={30} className="min-w-14">
          <UserIdProvider userId={session.user.id}>
            <UsersList />
          </UserIdProvider>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultResizableLayout?.[1]}>{children}</ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
