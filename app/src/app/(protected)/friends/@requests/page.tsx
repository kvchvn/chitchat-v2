import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ROUTES } from '~/constants/routes';
import { IncomingRequestsList } from './_components/incoming-requests-list';
import { OutcomingRequestsList } from './_components/outcoming-requests-list';

enum TabsValue {
  Incoming = 'incoming',
  Outcoming = 'outcoming',
}

export default function FriendRequests() {
  return (
    <section className="flex h-[434px] flex-col items-start gap-6 rounded-xl border border-slate-200 p-4">
      <Link href={ROUTES.allFriends} className="link-ghost">
        <h2 className="font-title">Friend Requests</h2>
      </Link>
      <Tabs
        defaultValue={TabsValue.Incoming}
        className="flex h-full w-full flex-col items-stretch gap-4"
      >
        <TabsList>
          <TabsTrigger value={TabsValue.Incoming}>Incoming</TabsTrigger>
          <TabsTrigger value={TabsValue.Outcoming}>Outcoming</TabsTrigger>
        </TabsList>
        <TabsContent value={TabsValue.Incoming} className="h-full">
          <IncomingRequestsList />
        </TabsContent>
        <TabsContent value={TabsValue.Outcoming} className="h-full">
          <OutcomingRequestsList />
        </TabsContent>
      </Tabs>
    </section>
  );
}
