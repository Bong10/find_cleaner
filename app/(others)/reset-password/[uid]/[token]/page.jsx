'use client';

import { useParams, useRouter } from 'next/navigation';
import ResetPasswordConfirmForm from '@/components/common/form/login/ResetPasswordConfirmForm';
import Header from '@/components/pages-menu/login/Header';
import MobileMenu from '@/components/header/MobileMenu';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const uid = params?.uid;
  const token = params?.token;

  return (
    <>
      <Header />
      <MobileMenu />
      <div className="login-section">
        <div className="image-layer" style={{ backgroundImage: 'url(/images/background/12.jpg)' }} />
        <div className="outer-box">
          <div className="login-form default-form">
            <ResetPasswordConfirmForm uid={uid} token={token} onSuccess={() => router.push('/login')} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
