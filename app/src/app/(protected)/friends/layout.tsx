import React from 'react';
import { Wrapper } from '~/components/ui/wrapper';

type Props = React.PropsWithChildren & {
  friends: React.ReactNode;
  requests: React.ReactNode;
};

export default function FriendsLayout({ children, friends, requests }: Props) {
  return (
    <Wrapper className="grid grid-cols-2 gap-6">
      {children}
      {friends}
      {requests}
    </Wrapper>
  );
}
