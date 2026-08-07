import { Toaster } from 'react-hot-toast';

export const ToastHost = () => {
  return (
    <>
      <Toaster
        position="top-right"
        containerClassName="hidden md:block"
        toastOptions={{
          duration: 3200,
          style: {
            borderRadius: '20px',
            border: '1px solid #E5E7EB',
            background: '#FFFFFF',
            color: '#1F2937',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
            padding: '14px 16px',
          },
          success: {
            iconTheme: {
              primary: '#16A34A',
              secondary: '#F0FDF4',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#FEF2F2',
            },
          },
        }}
      />
      <Toaster
        position="bottom-center"
        containerClassName="md:hidden"
        toastOptions={{
          duration: 3200,
          style: {
            borderRadius: '20px',
            border: '1px solid #E5E7EB',
            background: '#FFFFFF',
            color: '#1F2937',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
            padding: '14px 16px',
          },
        }}
      />
    </>
  );
};
