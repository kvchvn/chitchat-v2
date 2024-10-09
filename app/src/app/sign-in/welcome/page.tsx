import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { ROUTES } from '~/constants/routes';

export default function SignInWelcomePage() {
  return (
    <>
      <h2>Welcome!</h2>
      <h4>We are happy you are using our app</h4>
      <div>
        <p>If you will have questions or problems with the app, you can respond to our email:</p>
        <Link href="mailto:chitchat.app.2024@gmail.com" className="link mt-2">
          chitchat.app.2024@gmail.com
        </Link>
      </div>
      <div className="xs:mt-4 mt-8 flex gap-3">
        <Button variant="secondary" asChild>
          <Link href={ROUTES.profile}>
            <Icon scope="global" id="person" />
            Go to Profile
          </Link>
        </Button>
        <Button asChild>
          <Link href={ROUTES.chats}>
            <Icon scope="global" id="chats" />
            Go to Chats
          </Link>
        </Button>
      </div>
    </>
  );
}
