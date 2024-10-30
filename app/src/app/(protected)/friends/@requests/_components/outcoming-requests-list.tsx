import { type User } from 'next-auth';
import { NoUsersContainer } from '~/app/(protected)/_components/no-users-container';
import { UserItem } from '~/app/(protected)/_components/user-item';
import { UsersContainer } from '~/app/(protected)/_components/users-container';
import { UsersList } from '~/app/(protected)/_components/users-list';
import { UsersPagination } from '~/app/(protected)/_components/users-pagination';
import { getUsersSlice } from '~/lib/utils';
import { OutcomingRequestAction } from './outcoming-request-action';

const outcomingRequests: Pick<User, 'id' | 'name' | 'image'>[] = [
  // {
  //   id: '1',
  //   name: 'Good Man',
  //   image: undefined,
  // },
];

const REQUESTS_LIMIT = 5;
// temporary
const PAGE = 1;

export const OutcomingRequestsList = () => {
  if (!outcomingRequests.length) {
    return (
      <NoUsersContainer>
        <p>You don&apos;t have outcoming friend requests.</p>
        <p>Propose someone to be your friend and have your common chat.</p>
      </NoUsersContainer>
    );
  }

  const moreThanLimit = outcomingRequests.length > REQUESTS_LIMIT;
  const outcomingRequestsSlice = getUsersSlice({
    users: outcomingRequests,
    page: PAGE,
    perPage: REQUESTS_LIMIT - 1,
  });

  return (
    <UsersContainer>
      <UsersList>
        {outcomingRequestsSlice.map((outcomingRequest) => (
          <UserItem
            key={outcomingRequest.id}
            id={outcomingRequest.id}
            name={outcomingRequest.name}
            image={outcomingRequest.image}
          >
            <OutcomingRequestAction id={outcomingRequest.id} />
          </UserItem>
        ))}
        {moreThanLimit && <UsersPagination />}
      </UsersList>
    </UsersContainer>
  );
};
