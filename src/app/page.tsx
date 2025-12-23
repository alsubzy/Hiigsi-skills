import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoinitoLogo } from '@/components/coinito-logo';
import { Mail, Lock, Eye } from 'lucide-react';
import { GoogleIcon } from '@/components/google-icon';
import { FacebookIcon } from '@/components/facebook-icon';
import Image from 'next/image';
import { CoinitoC } from '@/components/coinito-c';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="flex w-full max-w-6xl rounded-2xl bg-white shadow-2xl">
        {/* Left Side */}
        <div className="w-full space-y-8 p-12 lg:w-1/2">
          <CoinitoLogo />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Log in to your account.
            </h1>
            <p className="mt-2 text-gray-500">
              Enter your email address and password to log in.
            </p>
          </div>

          <form className="space-y-6">
            <div className="relative">
              <Label htmlFor="email" className="sr-only">
                Email Address
              </Label>
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                className="h-12 rounded-lg pl-12"
              />
            </div>
            <div className="relative">
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="h-12 rounded-lg pl-12 pr-12"
              />
              <Eye className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400" size={20} />
            </div>
            <div className="flex justify-end">
              <Link href="#" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="h-12 w-full rounded-lg bg-primary text-lg font-semibold text-primary-foreground hover:bg-primary/90">
              <Link href="/dashboard">Login</Link>
            </Button>
          </form>

          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="outline" className="h-12 w-full rounded-lg">
              <GoogleIcon className="mr-2 h-5 w-5" />
              Google
            </Button>
            <Button variant="outline" className="h-12 w-full rounded-lg">
              <FacebookIcon className="mr-2 h-5 w-5" />
              Facebook
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            Don't you have an account?{' '}
            <Link href="#" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative hidden w-1/2 items-center justify-center rounded-r-2xl bg-primary p-12 lg:flex">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="z-10 w-full">
            <div className="absolute right-8 top-8">
              <CoinitoC />
            </div>
            <Image
              src="https://storage.googleapis.com/aifirebase-images-7a32b.appspot.com/coinito_dashboard_mockup.png"
              alt="Coinito Dashboard Mockup"
              width={600}
              height={400}
              className="mb-8"
              data-ai-hint="dashboard mockup"
            />
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold">
                The easiest way to manage your portfolio.
              </h2>
              <p className="mt-2 text-lg">
                Join the Coinito community now!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
