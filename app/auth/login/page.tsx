import LoginForm from '@/components/LoginForm';
import Logo from '@/components/Logo';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"><Logo size={64} showText={false} /></div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Carnet de Progression
            </h1>
            <p className="text-gray-600 mt-2 text-sm">Suivez votre évolution sportive</p>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          Bienvenue dans votre carnet de progression personnel
        </p>
      </div>
    </main>
  );
}

