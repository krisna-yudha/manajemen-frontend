import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Welcome to Management App
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A powerful frontend application connected to your Laravel 12 API
          </p>
          
          {isAuthenticated ? (
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/login"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </Link>
              <Link href="/register" className="text-sm font-semibold leading-6 text-gray-900">
                Create account <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-5 w-5 flex-none bg-indigo-600 rounded-full" />
                Laravel Integration
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Seamlessly connected to your Laravel 12 API with authentication and data management.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-5 w-5 flex-none bg-indigo-600 rounded-full" />
                Modern Stack
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Built with Next.js, TypeScript, Tailwind CSS, and React Query for optimal performance.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="h-5 w-5 flex-none bg-indigo-600 rounded-full" />
                Ready to Use
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Authentication, dashboard, and CRUD operations ready out of the box.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Layout>
  );
}
