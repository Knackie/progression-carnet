import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Carnet de Progression',
  description: 'Informations sur les données personnelles utilisées par Carnet de Progression.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      <header className="bg-white dark:bg-gray-900 shadow-md border-b dark:border-gray-800">
        <nav className="max-w-4xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/" aria-label="Accueil" className="hover:opacity-80 transition">
            <Logo size={36} />
          </Link>
          <Link href="/dashboard" className="text-sm font-semibold text-purple-700 dark:text-purple-300 hover:underline">
            Dashboard
          </Link>
        </nav>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Politique de confidentialité
          </h1>
          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Responsable et contact</h2>
              <p>
                Le responsable du traitement est Mathieu Dreyer. Pour toute question ou demande concernant vos données,
                écrivez à{' '}
                <a className="text-purple-700 dark:text-purple-300 underline" href="mailto:mathieudreyer1@gmail.com">
                  mathieudreyer1@gmail.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Données utilisées et finalités</h2>
              <p>
                Pour créer et utiliser votre compte, nous utilisons votre adresse e-mail et les informations
                nécessaires à votre authentification. Votre profil peut contenir notamment votre nom, votre âge,
                vos sports, vos classements et vos objectifs. Vos entrées contiennent les informations que vous
                renseignez sur vos matchs et entraînements : dates, résultats, scores, notes et analyses.
                Ces données servent à fournir le carnet et à afficher votre progression.
              </p>
              <p className="mt-3">
                La saisie du nom et du classement de votre adversaire est facultative. Ces informations, saisies
                par un utilisateur, servent à préparer et analyser ses matchs. Limitez les informations saisies
                au nécessaire et évitez les données sensibles ou les détails privés sur d’autres personnes.
              </p>
              <p className="mt-3">
                Le traitement des données du compte et du carnet repose sur la fourniture du service demandé.
                Celui des données d’adversaires repose sur l’intérêt légitime à suivre et préparer les matchs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Accès et prestataires</h2>
              <p>
                Supabase fournit l’authentification et la base de données ; Vercel héberge l’application.
                Si vous choisissez la connexion avec Google, Google intervient également dans l’authentification.
                Les règles d’accès à la base limitent la consultation et la modification des entrées et profils
                au compte qui les a créés.
              </p>
              <p className="mt-3">
                Vous pouvez aussi télécharger ou partager une carte de match : celle-ci peut contenir le nom
                de votre adversaire et d’autres informations de votre entrée. Vérifiez son contenu avant de la partager.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Conservation</h2>
              <p>
                La durée de conservation envisagée est d’un an, soit environ une saison. La suppression automatique
                au bout de cette période n’est pas encore mise en place : les données peuvent donc être conservées
                au-delà. Vous pouvez modifier ou supprimer vos entrées dans l’application et demander la suppression
                de vos données ou de votre compte par e-mail.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Stockage sur votre appareil</h2>
              <p>
                L’application utilise le stockage local du navigateur pour la session, le thème et les données
                des calculateurs. Ces données restent sur votre appareil jusqu’à leur suppression par l’application
                ou dans les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Vos droits</h2>
              <p>
                Vous pouvez demander l’accès à vos données, leur rectification ou leur effacement, ainsi que,
                selon les conditions applicables, la limitation du traitement, la portabilité de vos données
                ou vous opposer à leur traitement. Ces droits concernent aussi les personnes dont le nom a été
                saisi comme adversaire. Contactez-nous à l’adresse indiquée ci-dessus ; des informations permettant
                de retrouver les données concernées peuvent être nécessaires.
              </p>
              <p className="mt-3">
                Vous pouvez également introduire une réclamation auprès de la{' '}
                <a className="text-purple-700 dark:text-purple-300 underline" href="https://www.cnil.fr/">
                  CNIL
                </a>.
              </p>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
