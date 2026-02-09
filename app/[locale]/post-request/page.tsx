import { redirect } from 'next/navigation';

export default function PostRequestRedirect() {
    redirect('/requests/create');
}
