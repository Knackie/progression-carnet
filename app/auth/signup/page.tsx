import SignUpForm from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-center mb-6">Carnet de Progression</h1>
        <SignUpForm />
      </div>
    </main>
  );
}
